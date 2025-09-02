import { app } from "@/app"
import { prisma } from '@/database/prisma'

import request from "supertest"
import { loginAndGetCookie } from "./utils/auth"


describe('Users Controller', () => {

    afterAll(async () => {
        await prisma.user.delete({
            where: {
                email: 'client@email.com'
            }
        })

        await prisma.user.delete({
            where: {
                email: 'tech@email.com'
            }
        })

        await prisma.$disconnect()
    })

    it('should create a new client user', async () => {

        const response = await request(app).post('/users').send({
            name: 'Client User',
            email: 'client@email.com',
            password: '123456'
        })

        expect(response.status).toBe(201)
    })

    it('should throw an error if user with same email already exists', async () => {

        const response = await request(app).post('/users').send({
            name: 'Duplicate Client',
            email: 'client@email.com',
            password: '123456'
        })

        expect(response.status).toBe(400)
        expect(response.body.message).toBe('Já existe um usuário com esse email.')

    })

    it('should throw an error if email is invalid', async () => {

        const response = await request(app).post('/users').send({
            name: 'Client User',
            email: 'clientuser-email.com',
            password: '123456'
        })

        expect(response.status).toBe(400)
        expect(response.body.message).toBe('Validation error')
    })

    it("should return logged user infos", async () => {

        const { cookie } = await loginAndGetCookie({ email: 'client@email.com', password: '123456'})

        const res = await request(app).get("/users/me").set("Cookie", cookie)

        expect(res.status).toBe(200)
        expect(res.body.user.email).toBe('client@email.com');
    })

    it("should not return logged user infos without cookie", async () => {

        // Faz uma requisição autenticada sem os cookies.
        const res = await request(app).get("/users/me");
        expect(res.statusCode).toBe(401);
    })

    it('should create a tech user', async () => {

        const allowedUser = await prisma.user.findFirst({
            where: {
                role: 'ADMIN'
            }
        })

        const { cookie } = await loginAndGetCookie({ email: allowedUser!.email, password: '123456' })

        const res = await request(app).post('/users').set('Cookie', cookie).send({
            name: 'Tech User',
            email: 'tech@email.com',
            password: '123456',
            role: 'TECHNICIAN',
            availableHours: ['7:00']
        })

        expect(res.status).toBe(201)
    })

    it('should allow to delete a user successfully', async () => {

        const user = await prisma.user.findFirst({
            where: {
                email: 'client@email.com',
            }
        })

         const allowedUser = await prisma.user.findFirst({
            where: {
                role: 'ADMIN'
            }
        })

        const { cookie } = await loginAndGetCookie({ email: allowedUser!.email, password: '123456' })

        const res = await request(app).delete(`/users/${user!.id}`).set('Cookie', cookie)

        expect(res.status).toBe(200)
    })

    it('should not allow to delete a user', async () => {

        const user = await prisma.user.create({
            data: {
                name: 'Client User',
                email: 'client@email.com',
                password: '123456'
            }
        })

         const notAllowedUser = await prisma.user.findFirst({
            where: {
                OR: [
                    {role: 'CLIENT'},
                    {role: 'TECHNICIAN'}
                ]
            }
        })

        const { cookie } = await loginAndGetCookie({ email: notAllowedUser!.email, password: '123456' })

        const res = await request(app).delete(`/users/${user.id}`).set('Cookie', cookie)

        expect(res.status).toBe(403)
    })

})