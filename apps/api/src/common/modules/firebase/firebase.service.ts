import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
/**
 * Service to interact with Firebase for authentication and other operations.
 */
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);
  private firebaseApp: admin.app.App;

  /**
   * Initializes the FirebaseService with the provided configuration.
   * @param configService - The configuration service to retrieve Firebase settings.
   */
  constructor(private readonly configService: ConfigService) {
    const firebaseConfig = {
      projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
      privateKey: this.configService
        .get<string>('FIREBASE_PRIVATE_KEY')
        .replace(/\\n/g, '\n'),
      clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
    };

    if (!admin.apps.length) {
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig),
      });
    } else {
      this.firebaseApp = admin.app(); // Reuse existing app instance if initialized
    }
  }

  /**
   * Verifies a Firebase session cookie.
   * @param sessionCookie - The session cookie string.
   * @param checkRevoked - Whether to check for revoked tokens.
   * @returns The decoded claims if the cookie is valid.
   * @throws If verification fails.
   */
  public async verifySessionCookie(
    sessionCookie: string,
    checkRevoked: boolean = true,
  ): Promise<admin.auth.DecodedIdToken> {
    try {
      return await this.firebaseApp
        .auth()
        .verifySessionCookie(sessionCookie, checkRevoked);
    } catch (error) {
      this.logger.error('Invalid or expired session cookie', error);
      throw new Error('Invalid or expired session cookie');
    }
  }

  /**
   * Verifies a Firebase ID token.
   * @param idToken - The ID token string.
   * @returns The decoded claims if the token is valid.
   * @throws If verification fails.
   */
  public async verifyIdToken(
    idToken: string,
  ): Promise<admin.auth.DecodedIdToken> {
    try {
      return await this.firebaseApp.auth().verifyIdToken(idToken);
    } catch (error) {
      this.logger.error('Invalid or expired ID token', error);
      throw new Error('Invalid or expired ID token');
    }
  }

  /**
   * Sets custom user claims for a Firebase user.
   * @param uid - The user ID of the Firebase user.
   * @param data - The custom claims to set for the user.
   * @returns A promise that resolves when the operation is complete.
   * @throws If setting custom user claims fails.
   */
  public async setCustomerUserClaims(
    uid: string,
    data: Record<string, unknown>,
  ): Promise<void> {
    try {
      await this.firebaseApp.auth().setCustomUserClaims(uid, data);
    } catch (error) {
      this.logger.error('Error setting custom user claims', error);
      throw new Error('Error setting custom user claims');
    }
  }

  /**
   * Generates a Firebase session cookie from an ID token.
   * @param idToken - The ID token string.
   * @param expiresIn - The duration in milliseconds until the session cookie expires. Defaults to 2 weeks.
   * @returns An object containing the generated session cookie and the expiresIn value.
   * @throws If generating the session cookie fails.
   */
  public async generateSessionCookie(
    idToken: string,
    expiresIn: number = 1209600000,
  ): Promise<{ sessionCookie: string; expiresIn: number }> {
    // 2 weeks in milliseconds
    try {
      const sessionCookie = await this.firebaseApp
        .auth()
        .createSessionCookie(idToken, { expiresIn });
      return { sessionCookie, expiresIn };
    } catch (error) {
      this.logger.error('Error generating session cookie', error);
      throw new Error('Error generating session cookie');
    }
  }
}
