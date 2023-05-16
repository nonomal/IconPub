import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { Role } from 'src/models/enum/role.enum'
import { ROLES_KEY } from 'src/decorators/roles.decorator'
import { AlbumService } from 'src/services/album.service'
import { UserService } from 'src/services/user.service'

@Injectable()
export class StatusGuard implements CanActivate {
  private readonly logger: Logger = new Logger(StatusGuard.name)

  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
    private readonly albumService: AlbumService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredRoles) {
      return true
    }
    const { user } = context.switchToHttp().getRequest()
    return true
  }
}
