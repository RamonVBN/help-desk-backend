import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { z } from 'zod'

export class AdditionalServicesController {

    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            description: z.string().min(3),
            price: z.coerce.number().gte(1).lte(1000),
            calledId: z.string().uuid()
        })

        const { description, price, calledId } = bodySchema.parse(request.body)

        const called = await prisma.called.findUnique({
            where: {
                id: calledId
            }
        })

        if (!called) {

            throw new AppError('Não existe nenhum chamado com esse id.')
        }

        const { technicianId } = called


        if (technicianId !== request.user?.id) {

            throw new AppError('Só é permitido alterar chamados atribuídos ao usuário.', 401)
        }

        await prisma.additionalService.create({
            data: {
                description,
                price,
                calledId
            }
        })

        response.status(201).json()
        return
    }

    async remove(request: Request, response: Response) {
        const paramsSchema = z.object({
            addServiceId: z.string().uuid()
        })

        const { addServiceId } = paramsSchema.parse(request.params)

        const additionalService = await prisma.additionalService.findUnique({
            where: {
                id: addServiceId
            }
        })

        if (!additionalService) {

            throw new AppError('Serviço adicional não encontrado.')
        }

        const { calledId } = additionalService

        const called = await prisma.called.findUnique({
            where: {
                id: calledId
            }
        })

        if (!called) {

            throw new AppError('Não existe nenhum chamado com esse ID.')

        }

        const { technicianId } = called


        if (technicianId !== request.user?.id) {

            throw new AppError('Só é permitido alterar chamados atribuídos ao usuário.', 401)
        }


        await prisma.additionalService.delete({
            where: {
                id: addServiceId
            }
        })

        response.status(200).json()
        return
    }
}