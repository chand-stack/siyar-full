/* eslint-disable no-console */
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface"
import bcryptjs from "bcryptjs"
import { User } from "../modules/user/user.model";
import { envVars } from "../config/env";
export const seedSuperAdmin = async ()=>{
    try {
        const isSuperAdminExist = await User.findOne({email:envVars.SUPER_ADMIN_EMAIL})

        if(isSuperAdminExist){
            console.log("Super Admin already exist");
            return;
        }

        console.log("trying to create super admin...");

        const hashedPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND))

        const authProvider: IAuthProvider={
            provider:"credentials",
            providerId:envVars.SUPER_ADMIN_EMAIL
        }

        const payload:IUser={
            name:"Super Admin",
            role:Role.SUPER_ADMIN,
            email:envVars.SUPER_ADMIN_EMAIL,
            password:hashedPassword,
            isVerified:true,
            auths:[authProvider]
        }

        const superadmin = await User.create(payload)
        console.log("Super Admin Created Successfully! \n");
        console.log(superadmin);
        
        
        
    } catch (error) {
        console.log(error);
        
    }
}