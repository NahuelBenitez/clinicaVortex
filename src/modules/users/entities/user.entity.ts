import { BaseEntity } from "src/config/database/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class User extends BaseEntity {

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    role:string;
}
