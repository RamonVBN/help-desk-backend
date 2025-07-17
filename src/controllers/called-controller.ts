import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import dayjs from "dayjs";
import {  Request, Response } from "express";
import {z} from 'zod'
export class CalledController {

    async create(request: Request, response: Response){
        const bodySchema = z.object({
        
                title: z.string(),
                description: z.string(),
                serviceId: z.string()
        
            })
        
            const {title, description, serviceId} = bodySchema.parse(request.body)
        
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
                    // return dayjs(hour.split(':')[0]).isAfter(dayjs(new Date()).hour()) || dayjs(hour).isSame(dayjs(new Date()).hour())
        
                    // return dayjs(hour.split(':')[0]).isSame(dayjs(new Date()).hour())
        
        
                    return Number(hour.split(':')[0]) === Number(new Date().getHours())
        
                })
        
                const isThisTechnicianNotBusy = tech.user.technicianCalleds.every((called) => {
        
                    // const createDate = dayjs(called.createdAt)
        
                    const createDate = dayjs(called.createdAt).format('DD/MM/YYYY')
        
                    // const createHour = dayjs(called.createdAt).hour()
        
                    const createHour = dayjs(called.createdAt).hour()
        
                    // return !dayjs(createDate).isSame(dayjs(new Date())) && !dayjs(createHour).isSame(dayjs(new Date()).hour())
        
                    return createDate !== dayjs(new Date()).format('DD/MM/YYYY') && createHour !== dayjs(new Date()).hour()
                })
        
                // console.log(isHourInAvailableHours, isThisTechnicianNotBusy)
        
                return isHourInAvailableHours && isThisTechnicianNotBusy
                
            })
        
            if (!techAvailable) {
                
                throw new AppError('Não há nenhum técnico disponível no momento. Volte novamente mais tarde.')
            }
        
            const clientId = request.user?.id
        
            if (!clientId) {
                
                throw new AppError('Usuário não autenticado. Faça login para autenticar-se', 401)
            }
            
            const called = await prisma.called.create({
        
                data: {
                    title,
                    description,
                    clientId,
                    technicianId: techAvailable.userId,
                    serviceId
                    
                }
            })
        
            const techUser = await prisma.user.findUnique({
                where: {
                    id: techAvailable.userId
                }
            })
        
        
            response.status(200).json({called, techUser})
        
    }

    async index(request: Request, response: Response){
        if (request.user?.role === 'ADMIN') {
                
            const calleds = await prisma.called.findMany({
                select: {
                    id: true,
                    title: true,
                    description: true,
                    status: true, 

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
        
            response.status(200).json({calleds})
            }
        
            if (request.user?.role === 'TECHNICIAN') {
        
                const calleds = await prisma.called.findMany({
                    where: {
                        technicianId: request.user.id
                    },

                    select: {
                        id: true,
                        title: true,
                        description: true,
                        status: true, 

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
        
                response.status(200).json({calleds})
            }
        
            if (request.user?.role === 'CLIENT') {
           
                const calleds = await prisma.called.findMany({
                    where: {
                        clientId: request.user.id
                    },

                    select: {
                        id: true,
                        title: true,
                        description: true,
                        status: true, 

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
        
                response.status(200).json({calleds})
            }
    }

    async status(request: Request, response: Response){
         const paramsSchema = z.object({
                calledId: z.string()
            })
        
            const { calledId } = paramsSchema.parse(request.params)
        
            const bodySchema = z.object({
                status: z.enum(['OPEN', 'CLOSED', 'PROGRESS'])
            })
        
            const { status } = bodySchema.parse(request.body)
        
            await prisma.called.update({data: {status}, where: {id: calledId}})
        
            response.status(200).json()
    }

    addService = {

        async create(request: Request, response: Response){
            const bodySchema = z.object({

                description: z.string().min(3),
                price: z.number().min(1),
                calledId: z.string().uuid()
            })
        
            const {description, price, calledId} = bodySchema.parse(request.body)
        
            const called = await prisma.called.findUnique({
                where: {
                    id: calledId
                }
            })
            
           if (!called) {
        
            throw new AppError('Não existe nenhum chamado com esse id.')
            
           }
           
           const {technicianId} = called
        
        
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
        
        },

        async remove(request: Request, response: Response){
            const paramsSchema = z.object({
                addServiceId: z.string()
            })
        
            const {addServiceId} = paramsSchema.parse(request.params)
        
            const additionalService = await prisma.additionalService.findUnique({
                where: {
                    id: addServiceId
                }
            })
        
            if (!additionalService) {
                
                throw new AppError('Não há nenhum serviço adicional existente com esse ID.')
            }
        
            const {calledId} = additionalService
        
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
        }
    }
}