import { BaseEntity } from "src/config/database/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Doctor extends BaseEntity {

    @Column()
    licenseNumber: number;

    @Column()
    name: string;  

    @Column()
    lastName: string;

    @Column()
    entryDate: Date;
}
