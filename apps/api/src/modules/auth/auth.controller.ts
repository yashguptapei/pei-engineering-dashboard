import { Controller, Logger, Res, UseGuards, Post } from '@nestjs/common';
import { FirebaseService } from 'src/common/modules/firebase/firebase.service';
import type { Response } from 'express';
import { FirebaseAuthGuard } from 'src/common/guard/firebase-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('login')
  public async login(@Res({ passthrough: true }) res: Response) {
    this.logger.log('Login request received');

    const idToken = res.req.headers.authorization.replace('Bearer ', '');
    this.logger.debug(`Extracted ID token: ${idToken}`);

    try {
      const decodedToken = await this.firebaseService.verifyIdToken(idToken);
      this.logger.log(
        `Successfully verified ID token for ${decodedToken.email}`,
      );

      const { sessionCookie, expiresIn } =
        await this.firebaseService.generateSessionCookie(idToken);
      this.logger.log(
        `Generated session cookie for ${decodedToken.email}, expires in ${expiresIn} ms`,
      );

      res.cookie('session', sessionCookie, {
        maxAge: expiresIn,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      });
      this.logger.log(`Set session cookie for ${decodedToken.email}`);

      return {
        status: 200,
        body: {
          message: 'Successfully logged in',
        },
      };
    } catch (error) {
      this.logger.error('Error during login process', error);
      throw error;
    }
  }

  @Post('logout')
  @UseGuards(FirebaseAuthGuard)
  public async logout(@Res({ passthrough: true }) res: Response) {
    this.logger.log('Logout request received');

    res.clearCookie('session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    this.logger.log('Cleared session cookie');

    return {
      status: 200,
      body: {
        message: 'Successfully logged out',
      },
    };
  }
}
