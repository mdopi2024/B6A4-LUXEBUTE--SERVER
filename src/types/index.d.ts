
import { Request } from 'express';
import { userRole } from '../middleware/auth';

declare global{
    namespace Express{
        interface Request{
            user?:{
                id:string,
                name:string,
                email:string,
                role:userRole
            }
        }
    }
}

export {}