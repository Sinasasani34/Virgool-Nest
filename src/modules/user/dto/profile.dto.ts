import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsEnum, Length } from "class-validator"
import { Gender } from "../enum/gender.enum";

export class ProfileDto {
    @ApiPropertyOptional()
    @Length(3, 50, { message: "نام کاربری نمیتواند بیشتر از 50 کاراکتر باشد" })
    nick_name: string;

    @ApiPropertyOptional({ nullable: true })
    @Length(10, 200, { message: "نام کاربری نمیتواند بیشتر از 50 کاراکتر باشد" })
    bio: string;

    @ApiPropertyOptional({ nullable: true, format: 'binary' })
    image_profile: string;

    @ApiPropertyOptional({ nullable: true, format: 'binary' })
    bg_image: string;

    @ApiPropertyOptional({ nullable: true, enum: Gender })
    @IsEnum(Gender)
    gender: string;

    @ApiPropertyOptional({ nullable: true, example: "2000-01-15T07:27:48.484Z" })
    brithday: Date;

    @ApiPropertyOptional({ nullable: true })
    x_profile: string;

    @ApiPropertyOptional({ nullable: true })
    linkedin_profile: string;
}