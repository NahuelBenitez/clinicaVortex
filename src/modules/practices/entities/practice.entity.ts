import { BaseEntity } from "src/config/database/base.entity";
import { MedicalEntry } from "src/modules/medical_entries/entities/medical_entry.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class Practice extends BaseEntity {

    @Column()
    duration: string;

    @Column()
    complications: string;  

    @Column()
    finalResult: string;

    @ManyToOne(() => MedicalEntry, entry => entry.Practices)
    @JoinColumn({ name: 'medicalEntryId' })
    MedicalEntry: MedicalEntry;
}
