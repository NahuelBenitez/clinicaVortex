import { IsNotEmpty, IsNumber, IsString } from "@nestjs/class-validator";

export class CreateMedicalConsultationDto {

    @IsNotEmpty()
    @IsString()
    consultationReason: string;

    @IsNotEmpty()
    @IsNumber()
    diseaseId: number;

    @IsNotEmpty()
    @IsString()
    isConfirmed: boolean;

    @IsNotEmpty()
    @IsNumber()
    medicalEntryId: number;

}
