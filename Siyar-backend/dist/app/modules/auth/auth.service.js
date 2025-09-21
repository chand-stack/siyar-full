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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const userToken_1 = require("../../utils/userToken");
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const newAccessToken = yield (0, userToken_1.createNewAccessTokenWithRefreshToken)(refreshToken);
    return {
        accessToken: newAccessToken
    };
});
// const resetPassword = async(oldPassword:string,newPassword:string,decodedToken:JwtPayload)=>{
// const user = await User.findById(decodedToken.userId)
// const isOldPasswordMatch = await bcryptjs.compare(oldPassword,user!.password as string)
// if(!isOldPasswordMatch){
//     throw new AppError(httpStatus.UNAUTHORIZED,"Old Password Does Not Match")
// }
// user!.password = await bcryptjs.hash(newPassword,Number(envVars.BCRYPT_SALT_ROUND))
// user?.save()
// }
exports.AuthServices = {
    // credentialsLogin,
    getNewAccessToken,
    // resetPassword
};
