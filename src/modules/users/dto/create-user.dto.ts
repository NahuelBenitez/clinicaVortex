import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    role: string

}
