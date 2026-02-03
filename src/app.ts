import express, { Request, Response } from 'express'
import cors  from 'cors'
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';

const origin = process.env.APP_URL as string || "http://localhost:3000 "
export const app =  express()

app.use(express.json())

app.use(cors({
    origin:[origin],
    credentials:true
}))

app.all('/api/auth/*splat', toNodeHandler(auth));

app.get('/',(req:Request,res:Response)=>{
  res.send("HELLO WORLD")
})