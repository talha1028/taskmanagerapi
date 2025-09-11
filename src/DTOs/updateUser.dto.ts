import { IsNotEmpty, IsEmail,IsEnum, IsOptional, MinLength } from "class-validator";
import { CreateUserDTO } from "./createuser.dto";
import { PartialType } from "@nestjs/mapped-types";
import { UserRole } from "./createuser.dto";

export class UpdateUserDTO extends PartialType(CreateUserDTO){
    @IsNotEmpty()
    @IsOptional()
    Name: string
    
    @IsEmail()
    @IsOptional()
    Email: string
    
    @IsNotEmpty()
    @IsOptional()
    @MinLength(8)
    Password: string
    
    @IsEnum(UserRole)
    @IsOptional()
    Role: UserRole
}