import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../config/auth';

interface TokenPayload {
  iat: string;
  exp: string;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
  ): void {
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      throw new Error('JWT is missing.')
    }

    const [, token] = authorizationHeader.split(' ');

    try {
      const decoded = verify(token, authConfig.jwt.secret);

      const { sub } = decoded as TokenPayload;

      request.user = {
        id: sub
      };

      return next();
    } catch (error) {
      throw new Error('Invalid JWT.')
    }
};
