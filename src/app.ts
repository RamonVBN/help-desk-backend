import express from 'express'
import { routes } from './routes'
import { errorHandling } from './middlewares/errorHandling'

import cookieParser from "cookie-parser";
import cors from "cors";

import uploadConfig from '@/configs/upload'

export const app = express()

app.use(cors({
  origin: "http://localhost:3000", // frontend Next.js
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true, 
}));

app.use(cookieParser())

app.use(express.json())

app.use('/uploads', express.static(uploadConfig.UPLOADS_FOLDER))

app.use(routes)

app.use(errorHandling)
