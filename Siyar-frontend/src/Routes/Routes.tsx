import { createBrowserRouter } from "react-router";
import Root from "../MainLayout/Root";
import Home from "../Components/Pages/Home/Home";
import Article from "../Components/Pages/Article/Article";
import Articles from "../Components/Pages/Articles";
import ListingPage from "../Components/Pages/Category/ListingPage";
import VideoListing from "../Components/Pages/Video/VideoListing";
import About from "../Components/Pages/About";
import Contact from "../Components/Pages/Contact/Contact";
import Policies from "../Components/Pages/Policies";
import TermsOfUse from "../Components/Pages/TermsOfUse";
import Privacy from "../Components/Pages/Privacy";

import AdminLogin from "../Components/Pages/Admin/AdminLogin";
import AdminDashboard from "../Components/Pages/Admin/AdminDashboard";


const routes = createBrowserRouter([
    {
        path:"/",
        element:<Root/>,
        children:[
            {
                path:"/",
                element:<Home/>
            },
            {
                path:"/articles",
                element:<Articles/>
            },
            {
                path:"/category/:slug",
                element:<ListingPage/>
            },
            {
                path:"/series/:slug",
                element:<ListingPage/>
            },
            {
                path:"/videos",
                element:<VideoListing/>
            },
            {
                path:"/article/:slug",
                element:<Article/>
            },
            {
                path:"/about",
                element:<About/>
            },
            {
                path:"/contact",
                element:<Contact/>
            },
            {
                path:"/policies",
                element:<Policies/>
            },
            {
                path:"/terms-of-use",
                element:<TermsOfUse/>
            },
            {
                path:"/privacy",
                element:<Privacy/>
            },

        ]
    },
    {
        path:"/admin",
        element:<AdminLogin/>
    },
    {
        path:"/admin/dashboard",
        element:<AdminDashboard/>
    }
])

export default routes;