import { Inject, Injectable, Scope } from '@nestjs/common';
import { ProfileDto } from './dto/profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { RequestUser } from './interface/Request.User';
import { isDate } from 'class-validator';
import { Gender } from './enum/gender.enum';
import { ProfileImages } from './types/files';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
        @Inject(REQUEST) private request: Request
    ) { }

    async changeProfile(files: ProfileImages, profileDto: ProfileDto) {
        if (files?.image_profile?.length > 0) {
            let [image] = files?.image_profile;
            profileDto.image_profile = image?.path?.replace(/\\/g, '/');
        }
        if (files?.bg_image?.length > 0) {
            let [image] = files?.bg_image;
            profileDto.bg_image = image?.path?.replace(/\\/g, '/');
        }

        const { id: userId, profileId } = this.request.user as RequestUser;
        let profile = await this.profileRepository.findOneBy({ userId });
        const { bio, brithday, gender, linkedin_profile, nick_name, x_profile, image_profile, bg_image } = profileDto;
        if (profile) {
            if (bio) profile.bio = bio;
            if (brithday && isDate(new Date(brithday))) profile.brithday = new Date(brithday);
            if (gender && Object.values(Gender as any).includes(gender)) profile.gender = gender;
            if (linkedin_profile) profile.linkedin_profile = linkedin_profile;
            if (x_profile) profile.x_profile = x_profile;
            if (image_profile) profile.image_profile = image_profile;
            if (bg_image) profile.bg_image = bg_image;
        } else {
            profile = this.profileRepository.create({
                bio,
                brithday,
                gender,
                linkedin_profile,
                nick_name,
                x_profile,
                userId,
                image_profile,
                bg_image
            })
        }
        profile = await this.profileRepository.save(profile);
        if (!profileId) {
            await this.userRepository.update({ id: userId }, { profileId: profile.id })
        }
    }

    profile() {
        const { id } = this.request.user as RequestUser;
        return this.userRepository.findOne({
            where: { id },
            relations: ['profile']
        })
    }
}
