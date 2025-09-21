"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const auth_service_1 = require("./auth.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const setCookies_1 = require("../../utils/setCookies");
// import { JwtPayload } from "jsonwebtoken";
const userToken_1 = require("../../utils/userToken");
// import { envVars } from "../../config/env";
const passport_1 = __importDefault(require("passport"));
const credentialsLogin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const loginInfo = await AuthServices.credentialsLogin(req.body)
    // res.cookie("accessToken", loginInfo.accessToken,{
    //     httpOnly:true,
    //     secure:false
    // })
    // res.cookie("refreshToken", loginInfo.refreshToken,{
    //     httpOnly:true,
    //     secure:false
    // })
    passport_1.default.authenticate("local", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return next(new AppError_1.default(401, err));
        }
        if (!user) {
            return next(new AppError_1.default(401, info.message));
        }
        const userTokens = yield (0, userToken_1.createUserToken)(user);
        const _a = user.toObject(), { password: pass } = _a, rest = __rest(_a, ["password"]);
        (0, setCookies_1.setAuthCookie)(res, userTokens);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "User Logged In Successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest
            }
        });
    }))(req, res, next);
    // setAuthCookie(res, loginInfo)
    // sendResponse(res,{
    //     success:true,
    //     statusCode:httpStatus.OK,
    //     message:"User Logged In Successfully",
    //     data:loginInfo
    // })
}));
const getNewAccessToken = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "No Refresh token recieved from cookies");
    }
    const tokenInfo = yield auth_service_1.AuthServices.getNewAccessToken(refreshToken);
    (0, setCookies_1.setAuthCookie)(res, tokenInfo);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "New Access Token Retrived Successfully",
        data: tokenInfo
    });
}));
const logout = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User Logged Out Successfully",
        data: null
    });
}));
// const resetPassword = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
// const newPassword = req.body.newPassword;
// const oldPassword = req.body.oldPassword;
// const decodedToken = req.user;
// await AuthServices.resetPassword(oldPassword,newPassword,decodedToken as JwtPayload)
// sendResponse(res,{
//     success:true,
//     statusCode:httpStatus.OK,
//     message:"Password Changed Successfully",
//     data:null
// })
// })
// const googleCallbackController = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
//     let redirectTo = req.query.state ? req.query.state as string : ""
//     if(redirectTo.startsWith("/")){
//         redirectTo = redirectTo.slice(1)
//     }
//     const user = req.user
//     if(!user){
//         throw new AppError(httpStatus.NOT_FOUND,"User Not Found")
//     }
//     const tokenInfo = createUserToken(user)
//     setAuthCookie(res,tokenInfo)
//     res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
// })
exports.AuthController = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    // resetPassword,
    // googleCallbackController
};
