import { app } from "@/app"
import { loginAndGetCookie } from "./utils/auth"
import request from 'supertest'


describe('Service Controller', () => {

    it('should allow to create a new service successfully', async () => {

        const { cookie } = await loginAndGetCookie({ email: 'ramon@email.com', password: '123456' })

        const res = await request(app).post('/services').set('Cookie', cookie).send({
            name: 'Test Service',
            price: 10
        })

        expect(res.status).toBe(201)
    })

    it('should not allow to create a new service if the fields are not in the valid format', async () => {

        const { cookie } = await loginAndGetCookie({ email: 'ramon@email.com', password: '123456' })

        const res = await request(app).post('/services').set('Cookie', cookie).send({
            name: 'Test Service',
            price: 0.5
        })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Validation error')
    })

    it('should not allow to create a new service if user role is not admin', async () => {

        const { cookie } = await loginAndGetCookie({ email: 'luffy@email.com', password: '123456' })

        const res = await request(app).post('/services').set('Cookie', cookie).send({
            name: 'Test Service',
            price: 10
        })

        expect(res.status).toBe(403)
    })
})