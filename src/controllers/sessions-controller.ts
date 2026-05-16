import { authConfig } from '@/configs/auth'
import { prisma } from '@/database/prisma'
import { env } from '@/env'
import { AppError } from '@/utils/AppError'
import { compare } from 'bcrypt'
import { Request, Response } from 'express'
import { sign } from 'jsonwebtoken'
import { z } from 'zod'
import { DEFAULT_DEMO_DATA } from '../utils/defaultDemoData'


export class SessionController {

    async create(request: Request, response: Response) {

        const bodySchema = z.object({
            email: z.string().email(),
            password: z.string().min(6).max(16)
        })

        const { email, password } = bodySchema.parse(request.body)

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {

            throw new AppError('Email ou senha incorretos.')
        }

        const passwordMatched = await compare(password, user.password)

        if (!passwordMatched) {

            throw new AppError('Email ou senha incorretos.')
        }

        const { secret, expiresIn } = authConfig.jwt

        const token = sign({ role: user.role }, secret,
            {
                subject: user.id,
                expiresIn: `${expiresIn}D`
            }
        )

        response.cookie("access_token", token, {
            httpOnly: true,    // não acessível via JS -> mais seguro
            secure: env.NODE_ENV === 'production',      // só HTTPS (em dev, false)
            sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',  // previne CSRF na maioria dos casos
            maxAge: 1000 * 60 * 120, // 15 min
            path: "/",         // válido em todo o site

        }).status(201).json()
        return

    }

    async demoCreate(request: Request, response: Response) {

        const bodySchema = z.object({
           role: z.enum(['ADMIN', 'CLIENT', 'TECHNICIAN'])
        })

        const { role } = bodySchema.parse(request.body)

        const user = await prisma.user.upsert({
            where: {
                id: DEFAULT_DEMO_DATA[role].id
            },
            create: {
                ...DEFAULT_DEMO_DATA[role]
            },
            update: {
                ...DEFAULT_DEMO_DATA[role]
            }
        })

        const { secret, expiresIn } = authConfig.jwt

        const token = sign({ role: user.role }, secret,
            {
                subject: user.id,
                expiresIn: `${expiresIn}D`
            }
        )

        response.cookie("access_token", token, {
            httpOnly: true,    // não acessível via JS -> mais seguro
            secure: env.NODE_ENV === 'production',      // só HTTPS (em dev, false)
            sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',  // previne CSRF na maioria dos casos
            maxAge: 1000 * 60 * 120, // 15 min
            path: "/",         // válido em todo o site

        }).status(201).json()
        return

    }

    async remove(_: Request, response: Response) {

        response.clearCookie('access_token', {
            httpOnly: true,    // não acessível via JS -> mais seguro
            secure: env.NODE_ENV === 'production',      // só HTTPS (em dev, false)
            sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',  // previne CSRF na maioria dos casos
            path: "/",         // válido em todo o site

        }).status(200).json()
        return
    }
}