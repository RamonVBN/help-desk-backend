import { ServiceController } from "@/controllers/service-controller";
import { authenticate } from "@/middlewares/authenticate";
import { verifyAuthorization } from "@/middlewares/verifyAuthorization";
import { Router} from "express";


export const servicesRoutes = Router()

const controller = new ServiceController()

servicesRoutes.use(authenticate)

servicesRoutes.post('/', verifyAuthorization(['ADMIN']), controller.create)  

servicesRoutes.get('/', verifyAuthorization(['ADMIN', 'CLIENT']), controller.index)

servicesRoutes.put('/:serviceId', verifyAuthorization(['ADMIN']), controller.update)

servicesRoutes.patch('/:serviceId', verifyAuthorization(['ADMIN']), controller.status)
