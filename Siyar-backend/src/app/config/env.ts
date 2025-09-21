import dotenv from "dotenv"
dotenv.config()


interface EnvConfig {
    PORT : string,
    DB_URL : string,
    NODE_ENV : "development" | "production",
    JWT_ACCESS_SECRET: string,
    JWT_ACCESS_EXPIRES: string,
    JWT_REFRESH_SECRET: string,
    JWT_REFRESH_EXPIRES: string,
    BCRYPT_SALT_ROUND: string,
    SUPER_ADMIN_EMAIL: string,
    SUPER_ADMIN_PASSWORD: string,
    // GOOGLE_CLIENT_SECRET: string,
    // GOOGLE_CLIENT_ID: string,
    // GOOGLE_CALLBACK_URL: string,
    // EXPRESS_SESSION_SECRET: string,
    FRONTEND_URL: string,
    EXPRESS_SESSION_SECRET: string,
    CLOUD_NAME: string,
    API_KEY: string,
    API_SECRET: string,
    // Klaviyo Newsletter Configuration
    KLAVIYO_LIST_ID: string,
    KLAVIYO_PRIVATE_API_KEY: string,
        
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariables: string[] = ["PORT", "DB_URL", "NODE_ENV", "JWT_ACCESS_SECRET", "JWT_ACCESS_EXPIRES", "BCRYPT_SALT_ROUND", "SUPER_ADMIN_EMAIL", "SUPER_ADMIN_PASSWORD", "JWT_REFRESH_SECRET", "JWT_REFRESH_EXPIRES","FRONTEND_URL","EXPRESS_SESSION_SECRET","CLOUD_NAME","API_KEY","API_SECRET","KLAVIYO_LIST_ID","KLAVIYO_PRIVATE_API_KEY"]

    requiredEnvVariables.forEach(key => {
        if(!process.env[key]){
            throw new Error(`Missing require enviroment variable ${key}`)
        }
    })

    return {
    PORT : process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    CLOUD_NAME: process.env.CLOUD_NAME as string,
    API_KEY: process.env.API_KEY as string,
    API_SECRET: process.env.API_SECRET as string,
    KLAVIYO_LIST_ID: process.env.KLAVIYO_LIST_ID as string,
    KLAVIYO_PRIVATE_API_KEY: process.env.KLAVIYO_PRIVATE_API_KEY as string,
}
}

export const envVars = loadEnvVariables() 