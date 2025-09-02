import request from "supertest";
import { app } from "@/app";

export async function loginAndGetCookie({ email, name, password }: { name?: string, email: string, password: string }) {
  // cria usuário com dados default ou sobrescritos

  if (name) {
    await request(app).post('/users').send({
      name,
      email,
      password
    })

  }

  // faz login e retorna cookie
  const res = await request(app)
    .post('/sessions')
    .send({ email, password })

  expect(res.status).toBe(201)
  expect(res.headers['set-cookie']).toBeDefined()

  return { cookie: res.headers["set-cookie"] };
}