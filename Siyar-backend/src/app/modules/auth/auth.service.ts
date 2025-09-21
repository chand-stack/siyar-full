/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createNewAccessTokenWithRefreshToken } from "../../utils/userToken";


const getNewAccessToken = async(refreshToken:string)=>{
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

    return {
        accessToken: newAccessToken
    }
}

// const resetPassword = async(oldPassword:string,newPassword:string,decodedToken:JwtPayload)=>{
// const user = await User.findById(decodedToken.userId)

// const isOldPasswordMatch = await bcryptjs.compare(oldPassword,user!.password as string)

// if(!isOldPasswordMatch){
//     throw new AppError(httpStatus.UNAUTHORIZED,"Old Password Does Not Match")
// }

// user!.password = await bcryptjs.hash(newPassword,Number(envVars.BCRYPT_SALT_ROUND))

// user?.save()
// }

export const AuthServices = {
    // credentialsLogin,
    getNewAccessToken,
    // resetPassword
}