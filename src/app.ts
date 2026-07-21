import express, { Request, Response } from 'express'
import cors from 'cors'
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import { categoryRouter } from './modules/category/category.route';
import { userRoute } from './modules/user/user.route';
import { mealRoute } from './modules/meal/meal.route';
import { addItemRotuer } from './modules/addCard/addCard.route';
import { orderRouter } from './modules/order/order.routes';
import { commentRoutes } from './modules/comments/comment.routes';
import { PaymentController } from './modules/payment/payment.controller';
import { loadEnv } from './env';

const env  = loadEnv

const origin = env.APP_URL as string || "http://localhost:3000" || "http://localhost:5000"

export const app = express()



app.post( "/webhook",express.raw({ type: "application/json" }),PaymentController.handleStripeWebhookEvent);


  app.use(express.json())

const allowedOrigins = [
  env.APP_URL || "http://localhost:3000",
  env.PROD_API_URL || "https://b6-a4-frontend-client.vercel.app",
  "http://localhost:4000",
  "http://localhost:6000"
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)

    const isAllowed =
      allowedOrigins.includes(origin) ||
      /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin)

    if (isAllowed) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"],
}))


app.all('/api/auth/*splat', toNodeHandler(auth));

// category

app.use('/api', categoryRouter)

// user

app.use('/api', userRoute)


// user

app.use('/api', mealRoute)


// user

app.use('/api', addItemRotuer)

// order

app.use('/api', orderRouter)

// order

app.use('/api', commentRoutes)

app.get('/', (req: Request, res: Response) => {
  res.send("HELLO WORLD")
})