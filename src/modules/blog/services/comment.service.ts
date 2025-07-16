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

@Injectable({ scope: Scope.REQUEST })
export class BlogCommentService {
    constructor(
        @InjectRepository(BlogEntity) private blogRepository: Repository<BlogEntity>,
        @InjectRepository(BlogCommentEntity) private blogCommentRepository: Repository<BlogCommentEntity>,
        @Inject(REQUEST) private request: Request,
        private blogService: BlogService
    ) { }

    async createComment(commentDto: CreateCommentDto) {
        const { parentId, text } = commentDto;
        let parent: BlogCommentEntity | null = null;
        if (parentId && !isNaN(parentId)) {
            parent = await this.blogCommentRepository.findOneBy({ id: +parentId });
        }
    }
}