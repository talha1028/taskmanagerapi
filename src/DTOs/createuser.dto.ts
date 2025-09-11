import { IsNotEmpty, IsEmail, IsEnum, MinLength, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export class CreateUserDTO {
  @ApiProperty({
    example: "John Doe",
    description: "Full name of the user",
  })
  @Transform(({ value }) => value?.trim()) // trims whitespace before validation
  @IsNotEmpty({ message: "Name is required" })
  @Matches(/\S/, { message: "Name cannot be only spaces" }) // ensures at least one non-space char
  @Matches(/^(?!\d+$).+$/, { message: "Name cannot be only numbers" }) // disallow only numbers
  name: string;

  @ApiProperty({
    example: "johndoe@example.com",
    description: "Email address of the user",
  })
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Please provide a valid email address" })
  email: string;

  @ApiProperty({
    example: "StrongPassword123!",
    description: "Password for account login",
  })
  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  password: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.USER,
    description: "Role assigned to the user",
  })
  @IsNotEmpty({ message: "Role is required" })
  @IsEnum(UserRole, { message: "Role must be either 'user' or 'admin'" })
  role: UserRole;
}
