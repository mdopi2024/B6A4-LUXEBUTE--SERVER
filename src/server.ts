import { app } from "./app";
import { prisma } from "./lib/prisma"

const post = process.env.PORT || 5000
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