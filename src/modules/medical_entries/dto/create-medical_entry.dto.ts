import { IsDate, IsNotEmpty, IsNumber } from "@nestjs/class-validator";

export class CreateMedicalEntryDto {

    @IsNotEmpty()
    @IsDate()
    date: Date;

    @IsNotEmpty()
    @IsNumber()
    medicalHistoryId: number;

    @IsNotEmpty()
    @IsNumber()
    doctorId: number;

}
