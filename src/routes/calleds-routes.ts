import { authenticate } from "@/middlewares/authenticate";
import { verifyAuthorization } from "@/middlewares/verifyAuthorization";
import { Router} from "express";

import { CalledController } from "@/controllers/called-controller";


export const calledsRoutes = Router()

const controller = new CalledController()

calledsRoutes.use(authenticate)

calledsRoutes.post('/', verifyAuthorization(['CLIENT']), controller.create)

calledsRoutes.get('/', verifyAuthorization(['ADMIN', 'TECHNICIAN', 'CLIENT']), controller.index)

calledsRoutes.patch('/:calledId', verifyAuthorization(['ADMIN', 'TECHNICIAN']), controller.status)


// Add Services


calledsRoutes.post('/add-services', verifyAuthorization(['TECHNICIAN']), controller.addService.create)

calledsRoutes.delete('/add-services/:addServiceId', verifyAuthorization(['TECHNICIAN']), controller.addService.remove)


