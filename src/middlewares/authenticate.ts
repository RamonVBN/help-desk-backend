import { authConfig } from "@/configs/auth"
import { AppError } from "@/utils/AppError"
import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken"

interface TokenPayload {
    role:string,
    sub: string
}

export async function authenticate(request: Request, _: Response, next: NextFunction){
    
    try {
        
        const authHeader = request.headers.authorization
    
        if (!authHeader) {
            
            throw new AppError('Token não informado.', 401)
        }
    
        const [, token] = authHeader?.split(' ')

        const {secret} = authConfig.jwt
    
        const {role, sub: user_id } = verify(token, secret) as TokenPayload
    
        request.user = {
            id: user_id,
            role
        }

        return next()

    } catch (error) {
        throw new AppError('Token JWT inválido.', 401)
    }

}