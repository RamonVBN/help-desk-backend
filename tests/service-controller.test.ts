import { app } from "@/app"
import { loginAndGetCookie } from "./utils/auth"
import request from 'supertest'
import { prisma } from "@/database/prisma"


describe('Service Controller', () => {

    afterAll(async () => {
        await prisma.service
        .delete({
            where: {
                name: 'Test Service'
            }
        })
        
        await prisma.$disconnect()
    })

    it('should allow to create a new service successfully', async () => {

        const allowedUser = await prisma.user.findFirst({
            where: {
                role: 'ADMIN'
            }
        })

        const { cookie } = await loginAndGetCookie({ email: allowedUser!.email, password: '123456' })

        const res = await request(app).post('/services').set('Cookie', cookie).send({
            name: 'Test Service',
            price: 10
        })

        expect(res.status).toBe(201)
    })

    it('should not allow to create a new service if the fields are not in the valid format', async () => {

        const allowedUser = await prisma.user.findFirst({
            where: {
                role: 'ADMIN'
            }
        })

        const { cookie } = await loginAndGetCookie({ email: allowedUser!.email, password: '123456' })

        const res = await request(app).post('/services').set('Cookie', cookie).send({
            name: 'Test Service',
            price: 0.5
        })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Validation error')
    })

    it('should not allow to create a new service if user role is not admin', async () => {

        const notAllowedUser = await prisma.user.findFirst({
            where: {
                OR: [
                    {role: 'CLIENT'},
                    {role: 'TECHNICIAN'}
                ]
            }
        })

        const { cookie } = await loginAndGetCookie({ email: notAllowedUser!.email, password: '123456' })

        const res = await request(app).post('/services').set('Cookie', cookie).send({
            name: 'Test Service',
            price: 10
        })

        expect(res.status).toBe(403)
    })
})