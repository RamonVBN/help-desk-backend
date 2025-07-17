import { AppError } from "@/utils/AppError";
import { ErrorRequestHandler } from "express";
import {ZodError} from 'zod'


export const errorHandling: ErrorRequestHandler = async (error, _, response, next) => {
    
    if (error instanceof AppError) {
        
        response.status(error.statusCode).json({message: error.message})

    }else if (error instanceof ZodError) {
        
        response.status(400).json({message: 'Validation error', issues: error.format()})
        
    }else {

        response.status(500).json({message: error.message})
    }

    return next()
    
}