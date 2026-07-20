
import { app } from "./app";
import { loadEnv } from "./env";
import { prisma } from "./lib/prisma"

const post = loadEnv.PORT
const main = async()=>{
   try{
     await prisma.$connect();
    console.log("database connected");
    app.listen(post,()=>{
        console.log(`server is running on port ${post}`)
    })
   }catch(error){
    console.log(error)
      await prisma.$disconnect();
      process.exit(1)
   }
}

main()