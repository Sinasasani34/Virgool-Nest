import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { isJWT } from "class-validator";
import { Request } from "express";
import { Observable } from "rxjs";
import { AuthMessage } from "src/common/enums/message.enum";
import { AuthService } from "../auth.service";
import { Reflector } from "@nestjs/core";
import { SKIP_AUTH } from "src/common/decorators/skip-auth.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private reflector: Reflector
    ) { }
    async canActivate(context: ExecutionContext) {
        const isSkippedAuthorization = this.reflector.get<boolean>(SKIP_AUTH, context.getHandler());
        if (isSkippedAuthorization) return true;
        const httpContext = context.switchToHttp();
        const request: Request = httpContext.getRequest<Request>();
        const token = this.extractToken(request);
        request.user = await this.authService.validateAccessToken(token);
        return true;
    }

    protected extractToken(request: Request) {
        const { authorization } = request.headers;
        if (!authorization || authorization?.trim() === "") {
            throw new UnauthorizedException(AuthMessage.LoginIsRequired);
        }
        const [bearer, token] = authorization?.split(" ");
        if (bearer.toLowerCase() !== "bearer" || !token || !isJWT(token)) {
            throw new UnauthorizedException(AuthMessage.LoginIsRequired);
        }
        // console.log("✅ AuthGuard executed");
        return token;
    }
}