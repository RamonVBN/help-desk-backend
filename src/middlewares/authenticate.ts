import { authConfig } from "@/configs/auth"
import { AppError } from "@/utils/AppError"
import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken"

interface TokenPayload {
  role: string,
  sub: string
}

export function authenticate(request: Request, response: Response, next: NextFunction) {
  const token = request.cookies.access_token;

  if (!token) {
    response.status(401).json({ error: "Token não encontrado" })
  }

  try {
    const { role, sub: user_id } = verify(token, authConfig.jwt.secret) as TokenPayload

    request.user = {
      id: user_id,
      role
    } // usuário na requisição

    next()
  } catch (err) {
    console.log(err)
    throw new AppError("Token inválido ou expirado", 401)
  }
}