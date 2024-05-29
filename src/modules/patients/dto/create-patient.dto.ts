import { IsDate, IsNotEmpty, IsNumber, IsString } from "@nestjs/class-validator";
import { DtoErrors } from "src/enums/errorMesages.enum"; 

export class CreatePatientDto {

    @IsNotEmpty()
    @IsNumber()
    dni: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsDate()
    birthdayDate: Date;

    @IsNotEmpty()
    @IsString()
    medicalInsurance: string;

}
