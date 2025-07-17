import { prisma } from "@/database/prisma";
import { Request, Response } from "express";
import {z} from 'zod'



export class ServiceController {

    async create(request: Request, response: Response){
         const bodySchema = z.object({
        
                name: z.string(),
                price: z.number()
            })
        
            const {name, price} = bodySchema.parse(request.body)
        
            await prisma.service.create({
                data: {
                    name,
                    price
                }
            })
        
            response.status(201).json()
    }

    async index(request: Request, response: Response){
        const services = await prisma.service.findMany()
        
        response.status(200).json({services})
    }

    async update(request: Request, response: Response) {
        const paramsSchema = z.object({
            serviceId: z.string()
        })
    
        const {serviceId} = paramsSchema.parse(request.params)
    
        const bodySchema = z.object({
    
            name: z.string(),
            price: z.number()
        })
    
        const {name, price} = bodySchema.parse(request.body)
    
        await prisma.service.update({data: {name, price}, where: {id: serviceId}})
    
        response.status(200).json()
    }

    async status(request: Request, response: Response){
        const paramsSchema = z.object({
            serviceId: z.string()
        })
    
        const {serviceId} = paramsSchema.parse(request.params)
    
        const bodySchema = z.object({
            
            status: z.enum(['ACTIVE', 'INACTIVE'])
    
        })
    
        const {status} = bodySchema.parse(request.body)
    
        await prisma.service.update({data: {status}, where: {id: serviceId}})
    
    
        response.status(200).json()
    
    }
}