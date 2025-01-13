import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseService } from '../modules/firebase/firebase.service';
import { type Request } from 'express';

export type ReqWithUser = Request & {
  user: {
    id: string;
    email: string;
  };
};

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<ReqWithUser>();
    const sessionCookie = request.cookies?.session as string | undefined | null;

    if (!sessionCookie) {
      throw new UnauthorizedException('Session cookie is missing');
    }

    try {
      const decodedClaims = await this.firebaseService.verifySessionCookie(
        sessionCookie,
        true, // Check for revoked tokens
      );

      if (!decodedClaims.email) {
        throw new UnauthorizedException('User email is missing in token');
      }

      // Attach the user information to the request
      request.user = {
        id: decodedClaims.id,
        email: decodedClaims.email,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
