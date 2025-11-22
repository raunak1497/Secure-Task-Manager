import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class OrgGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const orgId = parseInt(request.params.orgId || request.body.orgId);

    if (!user) {
      throw new ForbiddenException('User missing');
    }

    if (!orgId) {
      // If route has no orgId param, allow (e.g., login)
      return true;
    }

    if (user.orgId !== orgId) {
      throw new ForbiddenException(
        `User does not belong to organization ${orgId}`
      );
    }

    return true;
  }
}