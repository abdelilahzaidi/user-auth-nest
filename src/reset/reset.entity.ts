import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('password_ressets')
export class ResetEntity{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    email : string;

    @Column()
    token : string;
}