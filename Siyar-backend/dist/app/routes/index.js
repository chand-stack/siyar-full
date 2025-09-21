"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const contact_route_1 = require("../modules/contact/contact.route");
const auth_route_1 = require("../modules/auth/auth.route");
const article_route_1 = require("../modules/blog/article.route");
const category_route_1 = require("../modules/category/category.route");
const series_route_1 = require("../modules/series/series.route");
const video_route_1 = require("../modules/video/video.route");
const imageUpload_route_1 = __importDefault(require("../modules/imageUpload/imageUpload.route"));
const imageStore_route_1 = __importDefault(require("../modules/imageStore/imageStore.route"));
const translation_route_1 = __importDefault(require("../modules/translation/translation.route"));
const newsletter_route_1 = require("../modules/newsletter/newsletter.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/contact",
        route: contact_route_1.contactRouter
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes
    },
    {
        path: "/articles",
        route: article_route_1.ArticleRoutes
    },
    {
        path: "/categories",
        route: category_route_1.CategoryRoutes
    },
    {
        path: "/series",
        route: series_route_1.SeriesRoutes
    },
    {
        path: "/videos",
        route: video_route_1.VideoRoutes
    },
    {
        path: "/image-upload",
        route: imageUpload_route_1.default
    },
    {
        path: "/images",
        route: imageStore_route_1.default
    },
    {
        path: "/translate",
        route: translation_route_1.default
    },
    {
        path: "/newsletter",
        route: newsletter_route_1.NewsletterRoutes
    }
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
