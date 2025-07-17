import { Router } from "express";
import { servicesRoutes } from "./services-routes";
import { calledsRoutes } from "./calleds-routes";
import { sessionRoutes } from "./sessions-routes";
import { usersRoutes } from "./users-routes";
import { uploadRoutes } from "./uploads-routes";


export const routes = Router()

routes.use('/session', sessionRoutes)

routes.use('/users', usersRoutes)

routes.use('/services', servicesRoutes)

routes.use('/calleds', calledsRoutes)

routes.use('/uploads', uploadRoutes)

