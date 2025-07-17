import { Router } from "express";
import multer from "multer";
import uploadConfig from '../configs/upload'
import { UploadController } from "@/controllers/upload-controller";
import { authenticate } from "@/middlewares/authenticate";


export const uploadRoutes = Router()

const controller = new UploadController()

const upload = multer(uploadConfig.MULTER)

uploadRoutes.use(authenticate)

uploadRoutes.post('/', upload.single('file'), controller.create)

uploadRoutes.delete('/', controller.delete)

