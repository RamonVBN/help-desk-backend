import request from "supertest";
import { app } from "@/app";
import { loginAndGetCookie } from "./utils/auth";
import { prisma } from "@/database/prisma";

describe("Called controller", () => {

    afterAll(async () => {
        await prisma.user.delete({
            where: {
                email: 'testuser3@email.com'
            }
        })

        await prisma.$disconnect()
    })

    // If there's no technician available, will fail, it depends on the time too.
    it('should create a called successfully if theres a technician available', async () => {
        const { cookie } = await loginAndGetCookie({ email: 'testuser3@email.com', password: '123456', name: 'Test User3' })

        const service = await prisma.service.findFirst()

        const res = await request(app).post('/calleds').set('Cookie', cookie).send({
            title: 'Test Called',
            description: 'Testing',
            serviceId: service?.id
        })

        expect(res.status).toBe(201)
    })

    it('should return a list of calleds as an admin', async () => {

        const { cookie } = await loginAndGetCookie({ email: 'ramon@email.com', password: '123456' })

        const res = await request(app).get('/calleds').set('Cookie', cookie)

        expect(res.status).toBe(200)
        expect(res.body.calleds).toBeDefined()
    })

    it('should return a list of calleds as a technician', async () => {

        const { cookie } = await loginAndGetCookie({ email: 'eren@email.com', password: '123456' })

        const res = await request(app).get('/calleds').set('Cookie', cookie)

        expect(res.status).toBe(200)
        expect(res.body.calleds).toBeDefined()
    })

    it('should return a list of calleds as a client', async () => {

        const { cookie } = await loginAndGetCookie({ email: 'testuser3@email.com', password: '123456', name: 'Test User' })

        const res = await request(app).get('/calleds').set('Cookie', cookie)

        expect(res.status).toBe(200)
        expect(res.body.calleds).toBeDefined()
    })

    it('should not return nothing if user is not authenticated', async () => {

        const res = await request(app).get('/calleds')

        expect(res.status).toBe(401)
    })

    it('should update a called status successfully', async () => {

        const allowedUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { role: 'ADMIN' },
                    { role: 'TECHNICIAN' }
                ]
            }
        })

        const client = await prisma.user.create({
            data: {
                name: 'Test User',
                email: 'testuser4@email.com',
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

        const { cookie } = await loginAndGetCookie({email: allowedUser!.email, password: '123456'})

        const res = await request(app).patch(`/calleds/${called.id}`).set('Cookie', cookie).send({
            status: 'PROGRESS'
        })

        expect(res.status).toBe(200)

        await prisma.user.delete({
            where: {
                id: client.id
            }
        })
    })

})