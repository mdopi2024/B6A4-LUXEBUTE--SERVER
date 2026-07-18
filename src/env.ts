// src/env.ts

import dotenv from "dotenv";

dotenv.config();

export interface Env {
  DATABASE_URL: string;
  PORT: string;
  APP_URL: string;
  PROD_API_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRETE: string;
}

const getEnv = (key: keyof Env): string => {
  const value = process.env[key];

  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const loadEnv: Env = {
  DATABASE_URL: getEnv("DATABASE_URL"),
  PORT: getEnv("PORT"),
  APP_URL: getEnv("APP_URL"),
  PROD_API_URL: getEnv("PROD_API_URL"),
  BETTER_AUTH_SECRET: getEnv("BETTER_AUTH_SECRET"),
  BETTER_AUTH_URL: getEnv("BETTER_AUTH_URL"),
  STRIPE_SECRET_KEY: getEnv("STRIPE_SECRET_KEY"),
  STRIPE_WEBHOOK_SECRETE: getEnv("STRIPE_WEBHOOK_SECRETE"),
};