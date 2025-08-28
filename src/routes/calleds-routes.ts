import { authenticate } from "@/middlewares/authenticate";
import { verifyAuthorization } from "@/middlewares/verifyAuthorization";
import { Router} from "express";

import { CalledController } from "@/controllers/calleds-controller";


export const calledsRoutes = Router()

const controller = new CalledController()

calledsRoutes.use(authenticate)

calledsRoutes.post('/', verifyAuthorization(['CLIENT']), controller.create)

calledsRoutes.get('/', controller.index)

calledsRoutes.get('/:calledId', controller.show)

calledsRoutes.patch('/:calledId', verifyAuthorization(['ADMIN', 'TECHNICIAN']), controller.status)



