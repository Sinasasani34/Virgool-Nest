import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne } from "typeorm";
import { OtpEntity } from "./otp.entity";

@Entity(EntityNames.User)
export class UserEntity extends BaseEntity {
    @Column({ unique: true, nullable: true })
    username: string

    @Column({ unique: true, nullable: true })
    phone: string

    @Column({ unique: true, nullable: true })
    email: string

    @Column({ nullable: true })
    password: string

    @Column({ nullable: true })
    otpId: number;
    @OneToOne(() => OtpEntity, otp => otp.user, { nullable: true })
    @JoinColumn()
    otp: OtpEntity

    @CreateDateColumn()
    created_at: Date

    @CreateDateColumn()
    updated_at: Date
}