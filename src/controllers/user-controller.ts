import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { z } from 'zod'
import { compare, hash } from 'bcrypt'


export class UserController {

    async show(request: Request, response: Response) {

        if (!request.user) {

            throw new AppError('Sua sessão expirou')
        }

        const requestUser = await prisma.user.findUnique({
            where: {
                id: request.user.id
            },
            include: {
                technician: {
                    select: {
                        availableHours: true
                    }
                }
            }
        })

        if (!requestUser) {

            throw new AppError('Usuário não encontrado', 401)
        }

        const { name, email, role, imageUrl, id, technician } = requestUser

        if (technician) {

            const { availableHours } = technician

            const user = {
                id,
                role,
                name,
                email,
                imageUrl,
                availableHours
            }

            response.status(200).json({ user })
            return
        }

        const user = {
            id,
            role,
            name,
            email,
            imageUrl,
        }

        response.status(200).json({ user })
        return
    }

    async index(request: Request, response: Response) {

        const querySchema = z.object({
            role: z.enum(['CLIENT', 'TECHNICIAN'])
        })

        const { role } = querySchema.parse(request.query)

        if (!role) {

            throw new AppError('É necessário informar o filtro de role')
        }

        const users = await prisma.user.findMany({
            where: {
                role: role
            },
            include: {
                technician: {
                    select: {
                        availableHours: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        response.status(200).json({ users })
        return
    }

    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            name: z.string().min(3),
            email: z.string().email(),
            password: z.string().trim().min(6).max(16),
            role: z.enum(['CLIENT', 'TECHNICIAN']).default('CLIENT'),
            availableHours: z.array(z.string()).optional()
        })

        const { email, name, password, role, availableHours } = bodySchema.parse(request.body)

        const userWithSameEmail = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (userWithSameEmail) {

            throw new AppError('Já existe um usuário com esse email.')
        }

        const hashedPassword = await hash(password, 8)

        const { id: userId, } = await prisma.user.create({
            data: { email, name, password: hashedPassword, role }
        })

        if (role === 'TECHNICIAN') {
            if (availableHours && availableHours.length > 0) {

                await prisma.technicianInfo.create({
                    data: {
                        userId,
                        availableHours
                    }
                })
            } else {
                throw new AppError('Não é possível criar uma conta de técnico sem sua respectiva carga horária.')
            }
        }

        response.status(201).json()
        return

    }

    async update(request: Request, response: Response) {

        const bodySchema = z.object({
            name: z.string().min(3).optional(),
            email: z.string().email().optional(),
            currentPassword: z.string().trim().min(6).max(16).optional(),
            newPassword: z.string().trim().min(6).max(16).optional(),
            availableHours: z.array(z.string()).optional(),
        })

        const paramsSchema = z.object({
            targetUserId: z.string().uuid()
        })

        const { name, email, currentPassword, newPassword, availableHours } = bodySchema.parse(request.body)

        const { targetUserId } = paramsSchema.parse(request.params)

        const reqUser = request.user

        const user = await prisma.user.findUnique({
            where: {
                id: targetUserId
            }
        })

        if (!user) {
            throw new AppError('Usuário não encontrado')
        }

        if (reqUser?.id === targetUserId) {

            if (currentPassword || newPassword) {

                if (!currentPassword || !newPassword) {

                    throw new AppError('É preciso enviar a senha atual e a nova senha.')
                }

                const isMatch = await compare(currentPassword, user.password)

                if (!isMatch) {

                    throw new AppError('Senha atual incorreta.')
                }

                const newPasswordHashed = await hash(newPassword, 8)

                await prisma.user.update({
                    where: {
                        id: targetUserId
                    },
                    data: {
                        password: newPasswordHashed
                    }
                })

                response.status(200).json()
                return
            }

            await prisma.user.update({
                where: {
                    id: targetUserId
                },
                data: {
                    name,
                    email,
                }
            })

            response.status(200).json()
            return
        }

        if (reqUser?.role === 'ADMIN') {

            if (user.role === 'TECHNICIAN') {

                await prisma.user.update({
                    where: {
                        id: targetUserId
                    },
                    data: {
                        name,
                        email,
                    }
                })

                await prisma.technicianInfo.update({
                    where: {
                        userId: targetUserId
                    },
                    data: {
                        availableHours
                    }
                })

            }

            if (user.role === 'CLIENT') {

                await prisma.user.update({
                    where: {
                        id: targetUserId
                    },
                    data: {
                        name,
                        email,
                    }
                })

            }

            response.status(200).json()
            return
        }

    }

    async delete(request: Request, response: Response) {

        const paramsSchema = z.object({
            clientId: z.string().uuid()
        })

        const { clientId } = paramsSchema.parse(request.params)

        const user = await prisma.user.findUnique({
            where: {
                id: clientId
            }
        })

        if (!user) {

            throw new AppError('Usuário não encontrado')
        }

        if (user.role !== 'CLIENT') {

            throw new AppError('Não é permitido excluir esse usuário', 403)
        }

        await prisma.user.delete({
            where: {
                id: clientId
            }
        })

        response.status(200).json()
        return
    }

}