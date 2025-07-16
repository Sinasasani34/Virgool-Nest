import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from '../entities/blog.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CategoryService } from '../../category/category.service';
import { CreateCommentDto } from '../dto/comment.dto';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BlogCommentEntity } from '../entities/comment.entity';
import { BlogService } from './blog.service';
import { RequestUser } from 'src/modules/user/interface/Request.User';
import { PublicMessage } from 'src/common/enums/message';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';

@Injectable({ scope: Scope.REQUEST })
export class BlogCommentService {
    constructor(
        @InjectRepository(BlogEntity) private blogRepository: Repository<BlogEntity>,
        @InjectRepository(BlogCommentEntity) private blogCommentRepository: Repository<BlogCommentEntity>,
        @Inject(REQUEST) private request: Request,
        private blogService: BlogService
    ) { }

    async create(commentDto: CreateCommentDto) {
        const { parentId, text, blogId } = commentDto;
        const { id: userId } = this.request.user as RequestUser;
        const blog = await this.blogService.checkExistBlogById(blogId);
        let parent: BlogCommentEntity | null = null;
        if (parentId && !isNaN(parentId)) {
            parent = await this.blogCommentRepository.findOneBy({ id: +parentId });
        }
        await this.blogCommentRepository.insert({
            text,
            accepted: true,
            blogId,
            parentId: parent ? parentId : null,
            userId,
        });
        return {
            message: PublicMessage.CommentCreated
        }
    }

    async find(paginationDto: PaginationDto) {
        const { limit, page, skip } = paginationSolver(paginationDto);
        const [comments, count] = await this.blogCommentRepository.findAndCount({
            where: {},
            relations: {
                blog: true,
                user: { profile: true }
            },
            select: {
                blog: {
                    title: true
                },
                user: {
                    username: true,
                }
            },
            skip,
            take: limit,
            order: { id: 'DESC' }
        });
        return {
            pagination: paginationGenerator(count, page, limit),
            comments
        }
    }
}