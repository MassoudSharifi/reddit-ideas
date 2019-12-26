import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request) {
      const headersAuthorization = request.headers.authorization;
      if (
        !headersAuthorization ||
        headersAuthorization.split(' ')[0] !== 'Bearer'
      ) {
        return false;
      }

      try {
        request.user = await jwt.verify(
          headersAuthorization.split(' ')[1],
          process.env.JWT_SECRET,
        );
      } catch (err) {
        return false;
      }

      return true;
    }

    return false;
  }
}
