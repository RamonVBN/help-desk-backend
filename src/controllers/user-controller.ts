import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import {Request, Response } from "express";
import {z} from 'zod'
import {hash} from 'bcrypt'


export class UserController {

    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            name: z.string().min(3),
            email: z.string().email(),
            password: z.string().trim().min(8).max(16),
            role: z.enum(['CLIENT', 'TECHNICIAN']).default('CLIENT')
        })
    
        const {email, name, password, role} = bodySchema.parse(request.body)
    
        const userWithSameEmail = await prisma.user.findUnique({
            where: {
                email
            }
        })
        
        if (userWithSameEmail) {
            
            throw new AppError('Já existe um técnico com esse email.')
        }
        
        const hashedPassword = await hash(password, 8)
    
        const  { id: userId } = await prisma.user.create({
            data: {email, name, password: hashedPassword, role}
        })

        if (role === 'TECHNICIAN') {
            
            await prisma.technicianInfo.create({
                data: {
                    userId
                }
            })
        }
    
        response.status(201).json()   
    }

    client = {

        async index(request: Request, response: Response) {
            const clients = await prisma.user.findMany({
                    where: {
                        role: 'CLIENT'
                    }
                })
                
                response.status(200).json({clients})
        },

        async update(request: Request, response: Response){
            const paramsSchema = z.object({
                    clientId: z.string()
                })
                
                const {clientId} = paramsSchema.parse(request.params)
                
                const bodySchema = z.object({
                    name: z.string().min(3),
                    email: z.string().email(),
                })
                
                const {email, name} = bodySchema.parse(request.body)
                
                await prisma.user.update({data: {name, email}, where: {id: clientId}})
                
                response.status(200).json()
                
        },

        async delete(request: Request, response: Response) {
            const paramsSchema = z.object({
                clientId: z.string()
            })
            
            const {clientId} = paramsSchema.parse(request.params)
            
            await prisma.user.delete({where: {id: clientId}})
            
            response.status(200).json()   
        }
    }

    tech = {

        async index(request: Request, response: Response) {

                const users = await prisma.user.findMany({
                    where: {
                        role: 'TECHNICIAN'
                    },
                    include: {
                        technician: {
                            select: {
                                availableHours: true
                            }
                        }
                    },
                    omit: {
                        password: true
                    }
                })
            
                response.status(200).json({users})
        },

        async update(request: Request, response: Response){
            const paramsSchema = z.object({
                techId: z.string()
            })
        
            const {techId} = paramsSchema.parse(request.params)
        
            const bodySchema = z.object({
        
                name: z.string().min(3).optional(),
                email: z.string().email().optional(),
                password: z.string().trim().min(8).max(16).optional(),
                availableHours: z.array(z.string()).optional()
            })
        
            const {availableHours, email, name, password} = bodySchema.parse(request.body)

            if (request.user?.role !== 'ADMIN' && request.user?.id !== techId) {
                
                throw new AppError('O usuário só pode alterar os próprios dados.', 401)
            }
        
            await prisma.user.update({
                data: {
                    email,
                    name, 
                    password,
                    technician: {
                        update: {
                            availableHours
                        }
                    }
                },
                where: {
                    id: techId
                }
            })
        
            response.status(200).json()
        }
    }

}