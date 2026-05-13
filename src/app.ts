import express from 'express'
import { routes } from './routes'
import { errorHandling } from './middlewares/errorHandling'

import cookieParser from "cookie-parser";
import cors from "cors";

import { env } from './env';

export const app = express()

app.set("trust proxy", 1)

app.use(cors({
  origin: [env.CLIENT_BASE_URL], // frontend Next.js
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", 'Cookie']
}));

app.use(cookieParser())

app.use(express.json())

app.use(routes)

app.use(errorHandling)
