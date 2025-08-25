import { AdditionalServicesController } from "@/controllers/additional-services-controler";
import { authenticate } from "@/middlewares/authenticate";
import { verifyAuthorization } from "@/middlewares/verifyAuthorization";
import { Router} from "express";

export const additionalServicesRoutes = Router()

const controller = new AdditionalServicesController()

additionalServicesRoutes.use(authenticate)

additionalServicesRoutes.post('/', verifyAuthorization(['TECHNICIAN']), controller.create)

additionalServicesRoutes.delete('/:addServiceId', verifyAuthorization(['TECHNICIAN']), controller.remove)