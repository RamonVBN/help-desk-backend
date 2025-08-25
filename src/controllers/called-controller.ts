import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { z } from 'zod'
import dayjs from "dayjs";

export class CalledController {

    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            title: z.string().min(1),
            description: z.string().min(1),
            serviceId: z.string().uuid()
        })

        const { title, description, serviceId } = bodySchema.parse(request.body)

        const techList = await prisma.technicianInfo.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        technicianCalleds: true
                    }
                }
            }
        }) // Todos os técnicos.

        const techAvailable = techList.find((tech) => { // Técnico disponível, que será conectado ao chamado.

            const isHourInAvailableHours = tech.availableHours.some((hour) => {
               
                return Number(hour.split(':')[0]) === Number(new Date().getHours())

            })

            const isThisTechnicianNotBusy = tech.user.technicianCalleds.every((called) => {

                const createDate = dayjs(called.createdAt).format('DD/MM/YYYY')
      
                const createHour = dayjs(called.createdAt).hour()

                return createDate !== dayjs(new Date()).format('DD/MM/YYYY') && createHour !== dayjs(new Date()).hour()
            })

            return isHourInAvailableHours && isThisTechnicianNotBusy

        })

        if (!techAvailable) {

            throw new AppError('Não há nenhum técnico disponível no momento. Tente novamente mais tarde.')
        }

        const clientId = request.user?.id

        if (!clientId) {

            throw new AppError('Usuário não autenticado. Faça login para autenticar-se', 401)
        }

        await prisma.called.create({

            data: {
                title,
                description,
                clientId,
                technicianId: techAvailable.userId,
                serviceId
            }
        })

        response.status(201).json()
    }

    async index(request: Request, response: Response) {

        const user = request.user
        if (!user) {
            
            throw new AppError('Usuário não autenticado, faça login para autenticar-se')
        }

        if (user.role === 'ADMIN') {

            const calleds = await prisma.called.findMany({
                select: {
                    id: true,
                    title: true,
                    description: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,

                    service: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            status: true
                        }
                    },
                    client: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            imageUrl: true
                        }
                    },
                    technician: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            imageUrl: true
                        }

                    },
                    additionalServices: {
                        select: {
                            id: true,
                            description: true,
                            price: true,
                        }
                    },
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })

            response.status(200).json({ calleds })
            return
        }

        if (user.role === 'TECHNICIAN') {

            const allCalleds = await prisma.called.findMany({
                where: {
                    technicianId: user.id,
                },

                select: {
                    id: true,
                    title: true,
                    description: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,

                    service: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            status: true
                        }
                    },
                    client: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        }
                    },
                    technician: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        }

                    },
                    additionalServices: {
                        select: {
                            id: true,
                            description: true,
                            price: true,
                        }
                    },

                }
            })

            const filteredCalleds = allCalleds.filter((called) => {
                if (called.createdAt.setHours(0,0,0,0) === new Date().setHours(0,0,0,0) || called.status === 'OPEN') {
                    return true
                }
            })

            response.status(200).json({ calleds: filteredCalleds })
            return
        }

        if (user.role === 'CLIENT') {

            const calleds = await prisma.called.findMany({
                where: {
                    clientId: user.id
                },

                select: {
                    id: true,
                    title: true,
                    description: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,

                    service: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            status: true
                        }
                    },
                    client: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        }
                    },
                    technician: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        }

                    },
                    additionalServices: {
                        select: {
                            id: true,
                            description: true,
                            price: true,
                        }
                    },
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })

            response.status(200).json({ calleds })
            return
        }
    }

    async status(request: Request, response: Response) {
        const paramsSchema = z.object({
            calledId: z.string()
        })

        const { calledId } = paramsSchema.parse(request.params)

        const bodySchema = z.object({
            status: z.enum(['OPEN', 'CLOSED', 'PROGRESS'])
        })

        const { status } = bodySchema.parse(request.body)

        await prisma.called.update({ data: { status }, where: { id: calledId } })

        response.status(200).json()
        return
    }
}