
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    console.log('Authorization Header:', request.headers.authorization); 
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token manquant ou invalide');
    }

    try {
      const user = this.jwtService.verify(token);
      console.log('Decoded user from token:', user);
      request.user = { id: user.id }; 
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token invalide');
    }
  }
}
