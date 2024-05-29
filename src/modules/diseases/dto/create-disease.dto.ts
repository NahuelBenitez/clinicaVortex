import { IsNotEmpty, IsString } from '@nestjs/class-validator';
export class CreateDiseaseDto {

    @IsString()
    @IsNotEmpty()    
    name: string;

}
