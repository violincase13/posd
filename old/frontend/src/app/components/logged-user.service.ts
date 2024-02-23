import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../user';

@Injectable()
export class LoggedUserService {
  public loggedUser = new BehaviorSubject<User>(new User('', '', '', '', '', ''));

  setLoggedUser(user: User) {
    this.loggedUser.next(user);
  }

  getLoggedUser() {
    return this.loggedUser.asObservable();
  }
}
