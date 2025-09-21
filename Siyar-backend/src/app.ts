import express, { Request, Response } from "express"
import cors from "cors"
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session"
import "./app/config/passport"
import { envVars } from "./app/config/env";

const app = express()

app.use(expressSession({
    secret:envVars.EXPRESS_SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())


app.use(cookieParser())
app.use(express.json({ limit: '10mb' })); // Increased limit to handle large article content

const allowedOrigins = process.env.NODE_ENV === 'production' 
? ['https://siyar-front.vercel.app', 'http://localhost:5173','https://www.siyarinstitute.org', 'https://siyarinstitute.org']
: ['http://localhost:5173', 'http://localhost:5174','https://www.siyarinstitute.org', 'https://siyarinstitute.org'];

const corsOptions:cors.CorsOptions = {
    origin: allowedOrigins,
    credentials: true
};

app.use(cors(corsOptions));
app.use("/api/v1",router)


app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({
        message: "tour management server is running"
    })
})

app.use(globalErrorHandler)
app.use(notFound)

export default app