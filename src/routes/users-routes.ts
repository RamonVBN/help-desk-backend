import { Router} from "express";
import { authenticate } from "@/middlewares/authenticate";
import { verifyAuthorization } from "@/middlewares/verifyAuthorization";

import { UserController } from "@/controllers/user-controller";



export const usersRoutes = Router()

const controller = new UserController()

// Client

// Public Route

usersRoutes.post('/', controller.create)

// Private Routes
usersRoutes.use(authenticate)

usersRoutes.get('/client', verifyAuthorization(['ADMIN']), controller.client.index)

usersRoutes.put('/client/:clientId', verifyAuthorization(['ADMIN', 'CLIENT']), controller.client.update)

usersRoutes.delete('/client/:clientId', verifyAuthorization(['ADMIN', 'CLIENT']), controller.client.delete)

//

// Tech

usersRoutes.get('/tech', verifyAuthorization(['ADMIN']), controller.tech.index)

usersRoutes.put('/tech/:techId', verifyAuthorization(['ADMIN', 'TECHNICIAN']), controller.tech.update)


