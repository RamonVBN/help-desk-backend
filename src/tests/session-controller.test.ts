import { app } from '@/app'
import { prisma } from '@/database/prisma'
import request from 'supertest'

describe('Session Controller', () => {

    afterAll(async () => {
        await prisma.user.delete({
            where: {
                email: 'client@email.com'
            }
        })

        await prisma.$disconnect()
    })

    it('Should autenticate get access token', async () => {
        
        await request(app).post('/users').send({
            name: 'Client User',
            email: 'client@email.com',
            password: 'password123'
        })

        const sessionResponse = await request(app).post('/sessions').send({
            email: 'client@email.com',
            password: 'password123'
        })

        expect(sessionResponse.status).toBe(201)
        expect(sessionResponse.headers['set-cookie']).toBeDefined()
        expect(sessionResponse.headers['set-cookie'][0]).toMatch(/HttpOnly/)
    }) 
})