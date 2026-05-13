import fs from 'node:fs/promises'

import { Request, Response } from 'express'
import { z, ZodError } from 'zod'

import uploadConfig from '@/configs/upload'
import { AppError } from '@/utils/AppError'
import { prisma } from '@/database/prisma'
import { cloudinary } from '@/configs/cloudinary'

export class UploadController {
  async create(request: Request, response: Response) {
    try {
      const fileSchema = z.object({
        filename: z.string().min(1, 'Arquivo é obrigatório'),
        path: z.string(),
        mimetype: z.string().refine(
          (type) =>
            uploadConfig.ACCEPTED_IMAGE_TYPES.includes(
              type
            ),
          `Formato de arquivo inválido. Formatos permitidos: ${uploadConfig.ACCEPTED_IMAGE_TYPES.join(
            ', '
          )}`
        ),
        size: z.number().positive().refine((size) => size <= uploadConfig.MAX_FILE_SIZE, `Arquivo excede o tamanho máximo de ${uploadConfig.MAX_SIZE}`),
      })

      const file = fileSchema.parse(request.file)

      const userId = request.user?.id

      if (!userId) {
        throw new AppError(
          'Usuário não autenticado.',
          401
        )
      }

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

      // remove avatar antigo do cloudinary
      if (user?.imagePublicId) {
        await cloudinary.uploader.destroy(
          user.imagePublicId
        )
      }

      // upload da nova imagem
      const uploadedImage =
        await cloudinary.uploader.upload(
          file.path,
          {
            folder: 'helpdesk-avatars',
          }
        )

      // remove arquivo temporário local
      await fs.unlink(file.path)

      // atualiza usuário
      await prisma.user.update({
        where: {
          id: userId,
        },

        data: {
          imageUrl: uploadedImage.secure_url,
          imagePublicId:
            uploadedImage.public_id,
        },
      })

        response.status(201).json({
        imageUrl: uploadedImage.secure_url,
      })
    } catch (error) {
      console.log(error)

      // remove arquivo temporário caso exista
      if (request.file?.path) {
        try {
          await fs.unlink(request.file.path)
        } catch {}
      }

      if (error instanceof ZodError) {
        throw new AppError(
          error.issues[0].message
        )
      }

      throw error
    }
  }

  async delete(
    request: Request,
    response: Response
  ) {
    const userId = request.user?.id

    if (!userId) {
      throw new AppError(
        'Usuário não autenticado.',
        401
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    // remove imagem do cloudinary
    if (user?.imagePublicId) {
      await cloudinary.uploader.destroy(
        user.imagePublicId
      )
    }

    // remove dados do usuário
    await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        imageUrl: null,
        imagePublicId: null,
      },
    })

    response.status(200).json()
  }
}