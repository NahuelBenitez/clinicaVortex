import { IsDate, IsNotEmpty, IsNumber, IsString } from "@nestjs/class-validator";

export class CreateDoctorDto {

    @IsNotEmpty()
    @IsNumber()
    licenseNumber: number;

    @IsNotEmpty()
    @IsString()
    name: string;  
    
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsDate()
    entryDate: Date;

}
