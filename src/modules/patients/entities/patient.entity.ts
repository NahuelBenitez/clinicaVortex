import { BaseEntity } from "src/config/database/base.entity";
import { MedicalHistory } from "src/modules/medical_histories/entities/medical_history.entity";
import { Column, Entity, OneToOne } from "typeorm";

@Entity()
export class Patient extends BaseEntity {

    @Column()
    dni: number;

    @Column()
    name: string;  

    @Column()
    lastName: string;

    @Column()
    birthdayDate: Date;

    @Column()
    medicalInsurance: string;

    @OneToOne(() => MedicalHistory, (medicalHistory) => medicalHistory.patient, {
        cascade: true,
      })
      medicalHistory: MedicalHistory;
    
}
