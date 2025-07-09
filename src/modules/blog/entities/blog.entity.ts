import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { BlogStatus } from "../enum/status.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { BlogLikesEntity } from "./like.entity";
import { BlogBookmarkEntity } from "./bookmark.entity";

@Entity(EntityNames.Blog)
export class BlogEntity extends BaseEntity {
    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    content: string;

    @Column({ nullable: true })
    image: string;

    @Column()
    authorId: number;

    @ManyToOne(() => UserEntity, user => user.blogs, { onDelete: "CASCADE" })
    author: UserEntity;

    @OneToMany(() => BlogLikesEntity, likes => likes.blog)
    likes: BlogLikesEntity[];

    @OneToMany(() => BlogBookmarkEntity, bookmark => bookmark.blog)
    bookmarks: BlogBookmarkEntity[];

    @Column({ default: BlogStatus.Draft })
    status: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}