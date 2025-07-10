import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/blog.dto';
import { createSlug, randomId } from 'src/common/utils/functions.util';
import { BlogStatus } from './enum/status.enum';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { PublicMessage } from 'src/common/enums/message';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
    constructor(
        @InjectRepository(BlogEntity) private blogRepository: Repository<BlogEntity>,
        @Inject(REQUEST) private request: Request
    ) { }

    async create(blogDto: CreateBlogDto) {
        const user = this.request.user;
        let { title, slug, content, description, image, time_for_study } = blogDto;
        let slugData = slug ?? title;
        slug = createSlug(slugData);
        const isExist = await this.checkBlogBySlug(slug);
        if (isExist) {
            // for setting unique slug => تست-اسلاگ-9238klsjdfkj
            slug += `-${randomId()}`;
        }
        const blog = this.blogRepository.create({
            title,
            slug,
            description,
            content,
            image,
            status: BlogStatus.Draft,
            time_for_study,
            authorId: user?.id
        })
        await this.blogRepository.save(blog);
        return {
            message: PublicMessage.Created
        }
    }

    async checkBlogBySlug(slug: string) {
        const blog = await this.blogRepository.findOneBy({ slug });
        return !!blog;
    }
}
