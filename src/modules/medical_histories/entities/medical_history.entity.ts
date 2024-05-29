import { BaseEntity } from "src/config/database/base.entity";
import { Patient } from "src/modules/patients/entities/patient.entity";
import { Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { MedicalEntry } from "src/modules/medical_entries/entities/medical_entry.entity";

@Entity()
export class MedicalHistory extends BaseEntity {

    @OneToOne(() => Patient)
    @JoinColumn({ name: 'patientId' })
    patient: Patient;

    @OneToMany(() => MedicalEntry, entry => entry.medicalHistory)
    @JoinColumn({ name: 'medicalEntryId' })
    medicalEntries: MedicalEntry[];

}
