import { SessionController } from "@/controllers/session-controller";
import { Router } from "express";

export const sessionRoutes = Router()
const controller = new SessionController()

sessionRoutes.post('/', controller.create)

sessionRoutes.delete('/', controller.remove)

