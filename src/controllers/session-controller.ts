import { authConfig } from '@/configs/auth'
import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import { compare } from 'bcrypt'
import {Request, Response} from 'express'
import { sign } from 'jsonwebtoken'
import {z} from 'zod'

export class SessionController {

    async create(request: Request, response: Response) {

        const bodySchema = z.object({

            email: z.string().email(),
            password: z.string().min(8).max(16)
        })
    
        const {email, password} = bodySchema.parse(request.body)
    
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
    
        if (!user) {
            
            throw new AppError('Email ou senha inválido.')
        }
    
        const passwordMatched = compare(password, user.password)
    
       if (!passwordMatched) {
    
            throw new AppError('Email ou senha inválido.')
       } 
    
        const {secret, expiresIn} = authConfig.jwt
    
        const token = sign({role: user.role}, secret,
            {
                subject: user.id,
                expiresIn: `${expiresIn}D`
            }
        )
    
        const {password: _, ...userWithoutPassword} = user
    
        response.status(201).json({token, userWithoutPassword})
    
    }

}