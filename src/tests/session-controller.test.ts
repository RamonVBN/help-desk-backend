import { app } from '@/app'
import { prisma } from '@/database/prisma'
import request from 'supertest'

describe('Session Controller', () => {

    afterAll(async () => {
        await prisma.user.delete({
            where: {
                email: 'testuser1@email.com'
            }
        })

        await prisma.$disconnect()
    })

    it('Should autenticate get access token', async () => {
        
        // Cria um usuário cliente
        await request(app).post('/users').send({
            name: 'Test User',
            email: 'testuser1@email.com',
            password: 'password123'
        })

        // Loga com o usuário criado anteriormente.
        const sessionResponse = await request(app).post('/sessions').send({
            email: 'testuser1@email.com',
            password: 'password123'
        })

        expect(sessionResponse.status).toBe(201)
        expect(sessionResponse.headers['set-cookie']).toBeDefined()
        expect(sessionResponse.headers['set-cookie'][0]).toMatch(/HttpOnly/)
    }) 
})