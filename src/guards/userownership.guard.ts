import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class UserOwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // from JwtStrategy validate()
    const targetUserId = parseInt(request.params.id, 10);

    // Admin can do anything
    if (user.role === 'admin') {
      return true;
    }

    // User can only access their own record
    if (user.userId === targetUserId) {
      return true;
    }

    throw new ForbiddenException('You are not allowed to perform this action');
  }
}
