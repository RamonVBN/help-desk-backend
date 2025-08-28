import { app } from "@/app"
import { prisma } from '@/database/prisma'

import request from "supertest"
import { loginAndGetCookie } from "./utils/auth"


describe('Users Controller', () => {

    afterAll(async () => {
        await prisma.user.delete({
            where: {
                email: 'testuser2@email.com'
            }
        })

        await prisma.user.delete({
            where: {
                email: 'testusertech@email.com'
            }
        })

        await prisma.$disconnect()
    })

    it('should create a new client user', async () => {

        const response = await request(app).post('/users').send({
            name: 'Test User',
            email: 'testuser2@email.com',
            password: 'password123'
        })

        expect(response.status).toBe(201)
    })

    it('should throw an error if user with same email already exists', async () => {

        const response = await request(app).post('/users').send({
            name: 'Duplicate User',
            email: 'testuser2@email.com',
            password: 'password123'
        })

        expect(response.status).toBe(400)
        expect(response.body.message).toBe('Já existe um usuário com esse email.')

        await prisma.user.delete({
            where: {
                email: 'testuser2@email.com'
            }
        })
    })

    it('should throw an error if email is invalid', async () => {

        const response = await request(app).post('/users').send({
            name: 'Test User',
            email: 'testuser-email.com',
            password: 'password123'
        })

        expect(response.status).toBe(400)
        expect(response.body.message).toBe('Validation error')
    })

    it("should return logged user infos", async () => {

        const { cookie } = await loginAndGetCookie({ email: 'testuser2@email.com', password: '123456', name: 'Test User2' })

        const res = await request(app).get("/users/me").set("Cookie", cookie)

        expect(res.status).toBe(200)
        expect(res.body.user.email).toBe('testuser2@email.com');
    })

    it("should return logged user infos without cookie", async () => {

        // Faz uma requisição autenticada sem os cookies.
        const res = await request(app).get("/users/me");
        expect(res.statusCode).toBe(401);
    })

    it('should create a tech user', async () => {

        const { cookie } = await loginAndGetCookie({ email: 'ramon@email.com', password: '123456' })

        const res = await request(app).post('/users').set('Cookie', cookie).send({
            name: 'Test Tech User',
            email: 'testusertech@email.com',
            password: '123456',
            role: 'TECHNICIAN',
            availableHours: ['7:00']
        })

        expect(res.status).toBe(201)
    })

    it('should allow to delete a user successfully', async () => {

        const user = await prisma.user.create({
            data: {
                name: 'Test User Client',
                email: 'testclient@email.com',
                password: '123456'
            }
        })

        const { cookie } = await loginAndGetCookie({ email: 'ramon@email.com', password: '123456' })

        const res = await request(app).delete(`/users/${user.id}`).set('Cookie', cookie)

        expect(res.status).toBe(200)
    })

    it('should not allow to delete a user', async () => {

        const user = await prisma.user.create({
            data: {
                name: 'Test User Client',
                email: 'testclient@email.com',
                password: '123456'
            }
        })

        const { cookie } = await loginAndGetCookie({ email: 'luffy@email.com', password: '123456' })

        const res = await request(app).delete(`/users/${user.id}`).set('Cookie', cookie)

        expect(res.status).toBe(403)

        await prisma.user.delete({
            where: {
                id: user.id
            }
        })
    })

})