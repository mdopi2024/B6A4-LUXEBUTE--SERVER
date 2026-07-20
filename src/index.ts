import {app} from './app'
export default app;

import { loadEnv } from "./env";

console.log("DATABASE_URL:", !!loadEnv.DATABASE_URL);
console.log("APP_URL:", loadEnv.APP_URL);
console.log("BETTER_AUTH_URL:", loadEnv.BETTER_AUTH_URL);
console.log("PORT:", loadEnv.PORT);