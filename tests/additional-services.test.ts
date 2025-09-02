import { prisma } from "@/database/prisma"
import { loginAndGetCookie } from "./utils/auth"
import request from 'supertest'
import { app } from "@/app"


describe('Additional Services', () => {

    afterEach(async () => {
        await prisma.user.delete({
            where: {
                email: 'client@email.com'
            }
        })

        await prisma.$disconnect()
    })

    it('should allow to create a new additional service successfully', async () => {

        const client = await prisma.user.create({
            data: {
                name: 'Client User',
                email: 'client@email.com',
                password: '123456'
            }
        })

        const service = await prisma.service.findFirst()

        const techTest = await prisma.user.findFirst({
            where: {
                role: 'TECHNICIAN'
            }
        })

        const called = await prisma.called.create({
            data: {
                title: 'Test Called',
                description: 'Testing',
                clientId: client.id,
                serviceId: service!.id,
                technicianId: techTest!.id
            }
        })

        const { cookie } = await loginAndGetCookie({ email: techTest!.email, password: '123456' })

        const res = await request(app).post('/additional-services').set('Cookie', cookie).send({
            description: 'Test additional service',
            price: 10,
            calledId: called.id
        })

        expect(res.status).toBe(201)

    })

    it('should not allow to create a new additional service successfully if the fields are not in valid format', async () => {

        const client = await prisma.user.create({
            data: {
                name: 'Client User',
                email: 'client@email.com',
                password: '123456'
            }
        })

        const service = await prisma.service.findFirst()

        const techTest = await prisma.user.findFirst({
            where: {
                role: 'TECHNICIAN'
            }
        })

        const called = await prisma.called.create({
            data: {
                title: 'Test Called',
                description: 'Testing',
                clientId: client!.id,
                serviceId: service!.id,
                technicianId: techTest!.id
            }
        })

        const { cookie } = await loginAndGetCookie({ email: techTest!.email, password: '123456' })

        const res = await request(app).post('/additional-services').set('Cookie', cookie).send({
            description: 'Test additional service',
            price: 1001,
            calledId: called.id
        })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Validation error')

    })

    it('should not allow to create a new additional service if the user role is not technician', async () => {

        const client = await prisma.user.create({
            data: {
                name: 'Client User',
                email: 'client@email.com',
                password: '123456'
            }
        })

        const service = await prisma.service.findFirst()

        const adminTest = await prisma.user.findFirst({
            where: {
                role: 'ADMIN'
            }
        })

        const called = await prisma.called.create({
            data: {
                title: 'Test Called',
                description: 'Testing',
                clientId: client!.id,
                serviceId: service!.id,
                technicianId: adminTest!.id
            }
        })

        const { cookie } = await loginAndGetCookie({ email: adminTest!.email, password: '123456' })

        const res = await request(app).post('/additional-services').set('Cookie', cookie).send({
            description: 'Test additional service',
            price: 10,
            calledId: called.id
        })

        expect(res.status).toBe(403)
    })

    it('should allow to delete a new additional service', async () => {

        const client = await prisma.user.create({
            data: {
                name: 'Client User',
                email: 'client@email.com',
                password: '123456'
            }
        })

        const service = await prisma.service.findFirst()

        const techTest = await prisma.user.findFirst({
            where: {
                role: 'TECHNICIAN'
            }
        })

        const called = await prisma.called.create({
            data: {
                title: 'Test Called',
                description: 'Testing',
                clientId: client!.id,
                serviceId: service!.id,
                technicianId: techTest!.id
            }
        })

        const { cookie } = await loginAndGetCookie({ email: techTest!.email, password: '123456' })

        const additionalService = await prisma.additionalService.create({
            data: {
                description: 'Test additional service',
                price: 10,
                calledId: called.id
            }
        })

        const res = await request(app).delete(`/additional-services/${additionalService.id}`).set('Cookie', cookie)

        expect(res.status).toBe(200)
    })
})