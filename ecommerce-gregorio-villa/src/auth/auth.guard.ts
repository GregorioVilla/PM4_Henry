import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Role } from 'src/roles.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const requestHeader = request.headers.authorization;
    if (!requestHeader) return false;

    const token = requestHeader.split(' ')[1];
    if (!token) throw new UnauthorizedException('Invalid Token');

    try {
      const secret = process.env.JWT_SECRETS;
      const user = this.jwtService.verify(token, { secret });

      user.exp = new Date(user.exp * 1000);
      user.iat = new Date(user.iat + 1000);

      if (user.isAdmin) {
        user.roles = [Role.Admin]; // Asegúrate de que Role.Admin sea 'admin'
      } else {
        user.roles = [Role.User]; // Role.User debe ser 'user'
      }
      
      request.user = user;

      return true;
    } catch (error) {
      if (!token) throw new UnauthorizedException('Invalid Token');
    }

    return true;
  }
}
