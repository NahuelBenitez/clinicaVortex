import { BaseEntity } from "src/config/database/base.entity";
import { MedicalConsultation } from "src/modules/medical_consultations/entities/medical_consultation.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Disease extends BaseEntity{

    @Column()
    name: string;

    @OneToMany(() => MedicalConsultation, medicalConsultation => medicalConsultation.Disease)
    MedicalConsultation: MedicalConsultation[];

}
