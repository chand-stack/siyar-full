import {Server} from "http"
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server : Server ;
const startServer = async()=>{
    try {
        mongoose.connect(envVars.DB_URL)
        console.log("Database connected");
        server = app.listen(envVars.PORT,()=>{
            console.log(`server is running on port ${envVars.PORT}`);
            
        })
        
    } catch (error) {
        console.log(error);
        
    }
}

// startServer()

(async()=>{
    await startServer()
    await seedSuperAdmin()
})()


process.on("SIGTERM",()=>{
    console.log("SIGTERM signal received.... server shutting down");
    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }

    process.exit(1)
    
})

process.on("SIGINT",()=>{
    console.log("SIGINT signal received.... server shutting down");
    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }

    process.exit(1)
    
})

// unhandle rejection error controll
process.on("unhandledRejection",(err)=>{
    console.log("unhandled rejection detected.... server shutting down",err);
    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }

    process.exit(1)
    
})


process.on("uncaughtException",(err)=>{
    console.log("uncaught exception detected.... server shutting down",err);
    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }

    process.exit(1)
    
})

// Promise.reject(new Error("i forgot promise"))
// throw new Error("for checking uncaught exception")