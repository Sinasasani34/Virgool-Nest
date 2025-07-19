import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request } from "express";

// WOV => With Out Validation
@Injectable()
export class AddUserToReqWOV implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log("Execute middleware in some routes");
        next();

    }
}