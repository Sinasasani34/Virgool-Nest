import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enums/entity.enum";
import { Column, Entity } from "typeorm";

@Entity(EntityNames.Category)
export class CategoryEntity extends BaseEntity {
    @Column()
    title: string;

    // اولویت در نمایش
    @Column({ nullable: true })
    priority: number;
}
