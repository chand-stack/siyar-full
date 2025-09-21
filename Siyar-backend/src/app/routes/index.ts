import { Router } from "express";
import { contactRouter } from "../modules/contact/contact.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ArticleRoutes } from "../modules/blog/article.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { SeriesRoutes } from "../modules/series/series.route";
import { VideoRoutes } from "../modules/video/video.route";
import imageUploadRoutes from "../modules/imageUpload/imageUpload.route";
import imageStoreRoutes from "../modules/imageStore/imageStore.route";
import translationRoutes from "../modules/translation/translation.route";
import { NewsletterRoutes } from "../modules/newsletter/newsletter.route";

export const router = Router()

const moduleRoutes =[
    {
        path:"/contact",
        route:contactRouter
    },
    {
        path:"/auth",
        route:AuthRoutes
    }
    ,
    {
        path: "/articles",
        route: ArticleRoutes
    },
    {
        path: "/categories",
        route: CategoryRoutes
    },
    {
        path: "/series",
        route: SeriesRoutes
    },
    {
        path: "/videos",
        route: VideoRoutes
    },
    {
        path: "/image-upload",
        route: imageUploadRoutes
    },
    {
        path: "/images",
        route: imageStoreRoutes
    },
    {
        path: "/translate",
        route: translationRoutes
    },
    {
        path: "/newsletter",
        route: NewsletterRoutes
    }
]

moduleRoutes.forEach((route)=>{
    router.use(route.path,route.route)
})