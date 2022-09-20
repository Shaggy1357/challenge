import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { GoogleUsers } from 'src/entities/GoogleUsers.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private authService: AuthService) {
    super();
  }

  serializeUser(user: GoogleUsers, done: Function) {
    console.log('Serialize User');

    done(null, user);
  }

  async deserializeUser(payload: any, done: Function) {
    const user = this.authService.findUser(payload.id);
    console.log('Deserialize User');
    console.log(user);
    return user ? done(null, user) : done(null, null);
  }
}
