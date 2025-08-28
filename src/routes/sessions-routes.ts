import { SessionController } from "@/controllers/sessions-controller";
import { authenticate } from "@/middlewares/authenticate";
import { Router } from "express";

export const sessionRoutes = Router()
const controller = new SessionController()

sessionRoutes.post('/', controller.create)

sessionRoutes.delete('/', authenticate, controller.remove)

