import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsNumberString, IsOptional, Length } from "class-validator";

export class CreateCommentDto {
    @ApiProperty()
    @Length(5)
    text: string;

    @ApiProperty()
    @IsNumber()
    blogId: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    parentId: number;
}