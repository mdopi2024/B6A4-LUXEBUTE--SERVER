import Stripe from "stripe";
import { loadEnv } from "../env";

const envbar = loadEnv

export const stripe =new Stripe(envbar.STRIPE_SECRET_KEY)