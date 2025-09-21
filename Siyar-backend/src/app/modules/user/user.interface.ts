
export enum Role{
    SUPER_ADMIN="SUPER_ADMIN",
    ADMIN="ADMIN",
    USER="USER",
    GUIDE="GUIDE"
}

export enum IsActive{
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IAuthProvider{
    provider: "google" | "credentials";
    providerId: string;
}

export interface IUser{
_id ?: string;
name: string;
email: string;
password ?: string;
isDeleted ?: string;
isActive ?: IsActive;
isVerified ?: boolean;
role: Role;
auths: IAuthProvider[];
}