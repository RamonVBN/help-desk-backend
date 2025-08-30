import { AppError } from "@/utils/AppError";
import { Request, Response, NextFunction } from "express";


export  function verifyAuthorization(role: string[]){

    return (request: Request, _: Response, next: NextFunction) => {

        if (!request.user || !role.includes(request.user.role)) {
            
            throw new AppError('Não Autorizado.', 403)
        }

        return next()
    }

}