import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";
import { BlogStatus } from "../enum/status.enum";

@Entity(EntityNames.Blog)
export class BlogEntity extends BaseEntity {
    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    content: string;

    @Column()
    image: string;

    @Column()
    authorId: number;

    @Column({ default: BlogStatus.Draft })
    status: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}