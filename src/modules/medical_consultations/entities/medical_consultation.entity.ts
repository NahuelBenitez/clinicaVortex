import { BaseEntity } from "src/config/database/base.entity";
import { Disease } from "src/modules/diseases/entities/disease.entity";
import { MedicalEntry } from "src/modules/medical_entries/entities/medical_entry.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class MedicalConsultation extends BaseEntity{

    @Column()
    consultationReason: string;

    @Column()
    isConfirmed: boolean;

    @ManyToOne(() => MedicalEntry, entry => entry.MedicalConsultations)
    @JoinColumn({ name: 'medicalEntryId' })
    MedicalEntry: MedicalEntry;

    @ManyToOne(() => Disease, disease => disease.MedicalConsultation)
    Disease: Disease;
}
