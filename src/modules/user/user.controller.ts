import { Body, Controller, Get, ParseFilePipe, Patch, Post, Put, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ChangeEmailDto, ProfileDto } from './dto/profile.dto';
import { SwaggerConsumes } from 'src/common/enums/swagger.consumes.enum';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { multerDestination, multerFileName, multerStorage } from 'src/common/utils/multer.util';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ProfileImages } from './types/files';
import { UploadedOptionalFiles } from 'src/common/decorators/upload-file.decorator';
import { response, Response } from 'express';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { CookiesOptionsToken } from 'src/common/utils/cookie.util';
import { PublicMessage } from 'src/common/enums/message';
import { CheckOtpDto } from '../auth/dto/auth.dto';

@Controller('user')
@ApiTags("User")
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Put("/profile")
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @ApiBearerAuth("Authorization")
  @UseGuards(AuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: "image_profile", maxCount: 1 },
    { name: "bg_image", maxCount: 1 }
  ], {
    storage: multerStorage("user-profile")
  }))
  changeProfile(
    @UploadedOptionalFiles() files: ProfileImages,
    @Body() profileDto: ProfileDto
  ) {
    return this.userService.changeProfile(files, profileDto);
  }

  @Get("/profile")
  @ApiBearerAuth("Authorization")
  @UseGuards(AuthGuard)
  profile() {
    return this.userService.profile();
  }

  @Patch("/change-email")
  async changeEmail(@Body() emailDto: ChangeEmailDto, @Res() res: Response) {
    const { code, token, message } = await this.userService.changeEmail(emailDto.email);
    if (message) return res.json({ message });
    res.cookie(CookieKeys.EmailOTP, token, CookiesOptionsToken());
    res.json({
      code,
      message: PublicMessage.SendOtp
    })
  }
  @Post("/verify-email-otp")
  async verifyEmail(@Body() otpDto: CheckOtpDto) {
    return this.userService.verifyEmail(otpDto.code);
  }
}
