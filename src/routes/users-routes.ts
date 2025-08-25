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

usersRoutes.get('/me', controller.show)

usersRoutes.put('/:targetUserId', controller.update)

usersRoutes.get('/', verifyAuthorization(['ADMIN']), controller.index)

usersRoutes.delete('/:clientId', verifyAuthorization(['ADMIN']), controller.delete)





