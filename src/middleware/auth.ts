import { NextFunction, Request, Response } from "express"
import { auth as betterAuth } from "../lib/auth"


export enum userRole {
    ADMIN = 'ADMIN',
    CUSTOMER = 'CUSTOMER',
    PROVIDER = 'PROVIDER'
}

export const auth = (...role: userRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const session = await betterAuth.api.getSession({
                headers: req.headers as any
            })
            if (!session) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized access"
                });
            }
            req.user = {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                role: session.user.role as userRole,
            }

            if (role.length && !role.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "You do not have permission to access this resource"
                });
            }
            next()
        } catch (error) {
            return res.status(401).json({
                message: "Authentication failed"
            })
        }

    }
}