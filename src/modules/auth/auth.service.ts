import { BadRequestException, ConflictException, Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthType } from './enums/type.enum';
import { AuthMethod } from './enums/method.enum';
import { isEmail, isMobilePhone } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../user/entities/profile.entity';
import { AuthMessage, BadRequestMessage } from 'src/common/enums/message.enum';
import { OtpEntity } from '../user/entities/otp.entity';
import { randomInt } from 'crypto';
import { PublicMessage } from 'src/common/enums/message';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './tokens.service';
import { Request, Response } from 'express';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { AuthResponse } from './types/response'
import { REQUEST } from '@nestjs/core';
import { CookiesOptionsToken } from 'src/common/utils/cookie.util';
import { KavenegarService } from '../http/kavenegar.service';
@Injectable({ scope: Scope.REQUEST })
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
        @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
        @Inject(REQUEST) private request: Request,
        private tokenService: TokenService,
        private kavenegarService: KavenegarService
    ) { }

    async userExistence(authDto: AuthDto, res: Response) {
        const { method, type, username } = authDto;
        let result: AuthResponse;
        switch (type) {
            case AuthType.Login:
                result = await this.login(method, username);
                // await this.sendOtp(method, username, result.code)
                return this.sendResponse(res, result)
            case AuthType.Register:
                result = await this.register(method, username);
                // await this.sendOtp(method, username, result.code)
                return this.sendResponse(res, result)
            default:
                throw new UnauthorizedException('')
        }
    }

    async login(method: AuthMethod, username: string) {
        const validUsername = this.usernameValidator(method, username);
        let user: UserEntity | null = await this.checkExistUser(method, validUsername);
        if (!user) throw new UnauthorizedException(AuthMessage.NotFoundAccount);

        const otp = await this.saveOtp(user.id, method);
        const token = this.tokenService.createOtpToken({ userId: user.id });
        return {
            token,
            code: otp.code,
            // mobile: method == AuthMethod.Phone : user.phone,
            method
        }
    }


    async register(method: AuthMethod, username: string) {
        const validUsername = this.usernameValidator(method, username);
        let user: UserEntity | null = await this.checkExistUser(method, validUsername);
        if (user) throw new ConflictException(AuthMessage.AlreadyExistAccount);
        if (method === AuthMethod.Username) {
            throw new BadRequestException(BadRequestMessage.InValidRegisterData)
        }
        user = this.userRepository.create({
            [method]: username,
        });
        user = await this.userRepository.save(user);
        // generate random username for new users
        user.username = `m_${user.id}`;
        await this.userRepository.save(user);
        const otp = await this.saveOtp(user.id, method);

        const token = this.tokenService.createOtpToken({ userId: user.id });
        return {
            token,
            code: otp.code
        }
    }

    async sendOtp(method: AuthMethod, username: string, code: string) {
        if (method == AuthMethod.Email) {
            console.log("send Email");
        } else if (method == AuthMethod.Phone) {
            await this.kavenegarService.sendVerificationSms(username, code);
        }
    }

    async sendResponse(res: Response, result: AuthResponse) {
        const { token, code } = result;
        res.cookie(CookieKeys.OTP, token, CookiesOptionsToken());
        res.json({
            message: PublicMessage.SendOtp,
            code
        })
    }

    async saveOtp(userId: number, method: AuthMethod) {
        const code = randomInt(10000, 99999).toString();
        const expiresIn = new Date(Date.now() + (1000 * 60 * 2));
        let otp = await this.otpRepository.findOneBy({ userId });
        let existOtp = false;
        if (otp) {
            existOtp = true;
            otp.code = code;
            otp.expiresIn = expiresIn;
            otp.method = method;
        } else {
            otp = this.otpRepository.create({
                code,
                expiresIn,
                userId,
                method
            })
        }
        otp = await this.otpRepository.save(otp);
        if (!existOtp) {
            await this.userRepository.update({ id: userId }, {
                otpId: otp.id
            })
        }

        return otp;
    }

    async checkOtp(code: string) {
        const token = this.request.cookies?.[CookieKeys.OTP];
        if (!token) throw new UnauthorizedException(AuthMessage.ExpiredCode);
        const { userId } = this.tokenService.verifyOtpToken(token);
        const otp = await this.otpRepository.findOneBy({ userId })
        if (!otp) throw new UnauthorizedException(AuthMessage.LoginAgain);
        const now = new Date();
        if (otp.expiresIn < now) throw new UnauthorizedException(AuthMessage.ExpiredCode);
        if (otp.code !== code) throw new UnauthorizedException(AuthMessage.TryAgain);
        const accessToken = this.tokenService.createAccessToken({ userId });
        if (otp.method === AuthMethod.Email) {
            await this.userRepository.update({ id: userId }, {
                verify_email: true
            })
        } else if (otp.method === AuthMethod.Phone) {
            await this.userRepository.update({ id: userId }, {
                verify_phone: true
            })
        }
        return {
            message: PublicMessage.LogedIn,
            accessToken
        }
    }

    async checkExistUser(method: AuthMethod, username: string) {
        let user: UserEntity | null;
        if (method === AuthMethod.Phone) {
            user = await this.userRepository.findOneBy({ phone: username });
        } else if (method === AuthMethod.Email) {
            user = await this.userRepository.findOneBy({ email: username })
        } else if (method === AuthMethod.Username) {
            user = await this.userRepository.findOneBy({ username })
        } else {
            throw new BadRequestException(BadRequestMessage.InValidLoginData)
        }
        return user;
    }

    async validateAccessToken(token: string) {
        const { userId } = this.tokenService.verifyAccessToken(token);
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) throw new UnauthorizedException(AuthMessage.LoginAgain);
        return user;
    }

    usernameValidator(method: AuthMethod, username: string) {
        switch (method) {
            case AuthMethod.Email:
                if (isEmail(username)) return username;
                throw new BadRequestException('فرمت ایمیل نادرست میباشد');
            case AuthMethod.Phone:
                if (isMobilePhone(username, "fa-IR")) return username;
                throw new BadRequestException('شماره تماس نادرست میباشد');
            case AuthMethod.Username:
                return username;
            default:
                throw new UnauthorizedException('اطلاعات وارد شده نادرست میباشد')
        }
    }
}
