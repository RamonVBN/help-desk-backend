import { Request, Response } from "express";
import {z, ZodError} from 'zod'

import uploadConfig from "@/configs/upload";
import { AppError } from "@/utils/AppError";
import { DiskStorage } from "@/providers/diskstorage";
import { prisma } from "@/database/prisma";
import { env } from "@/env";

export class UploadController {
    
    async create(request: Request, response: Response){
        
        const diskStorage = new DiskStorage()

       try {
        const fileSchema = z.object({
            filename: z.string().min(1, "Arquivo é obrigatório"),
            mimetype: z.string().refine((type) => uploadConfig.ACCEPTED_IMAGE_TYPES.includes(type), "Formato de arquivo inválido. Formatos permitidos: " + uploadConfig.ACCEPTED_IMAGE_TYPES),
            size: z.number().positive().refine((size) => size <= uploadConfig.MAX_FILE_SIZE, "Arquivo excede o tamanho máximo de " + uploadConfig.MAX_SIZE)
        }).passthrough()


        const file = fileSchema.parse(request.file)

        const { filename } = await diskStorage.saveFile(file.filename)

        const userId = request.user?.id

        if (!userId) {
            
            throw new AppError('Usuário não autenticado.', 401)
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (user?.imageUrl) {

            const filenameToDelete = user.imageUrl.split('uploads/')[1]

            await diskStorage.deleteFile(filenameToDelete, 'upload')
        }

        await prisma.user.update({
            data: {imageUrl: `${env.BASE_URL}/uploads/${filename}`},
            where: {
                id: userId
            }
        })

        response.json({filename})
        return

       } catch (error) {
        console.log(error)
        if (error instanceof ZodError) {

            if (request.file) {
                
                await diskStorage.deleteFile(request.file?.filename, 'tmp')
            }
            
            throw new AppError(error.issues[0].message)

        }

        throw error

       }
    }

    async delete(request: Request, response: Response){

        const diskStorage = new DiskStorage()

        const userId = request.user?.id

        if (!userId) {
            
            throw new AppError('Usuário não autenticado.', 4001)
        }
        
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (user?.imageUrl) {

            const filenameToDelete = user.imageUrl.split('uploads/')[1]

            await diskStorage.deleteFile(filenameToDelete, 'upload')
        }

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                imageUrl: null
            }
        })

        response.status(200).json()
        return
    }
}