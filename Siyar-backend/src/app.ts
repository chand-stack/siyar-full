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
? [
    'https://siyar-front.vercel.app', 
    'https://siyar-test-frontend.vercel.app',
    'https://siyar-frontend.vercel.app',
    'http://localhost:5173'
  ]
: [
    'http://localhost:5173', 
    'http://localhost:5174',
    'https://siyar-test-frontend.vercel.app',
    'https://siyar-frontend.vercel.app'
  ];

const corsOptions:cors.CorsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            return callback(new Error('Not allowed by CORS'), false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use("/api/v1",router)


app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({
        message: "siyar backend server is running"
    })
})

// CORS test endpoint
app.get("/api/v1/cors-test",(req:Request,res:Response)=>{
    res.status(200).json({
        message: "CORS is working properly",
        origin: req.headers.origin,
        timestamp: new Date().toISOString()
    })
})

app.use(globalErrorHandler)
app.use(notFound)

export default app