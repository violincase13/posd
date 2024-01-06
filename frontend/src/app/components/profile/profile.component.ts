import { Component } from '@angular/core';
import { LoggedUserService } from '../logged-user.service';
import { User } from '../../user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  currentUser: User;

  constructor(private loggedUserService: LoggedUserService) {
    // Example values
    this.currentUser = new User('', '', '', '', '', '');
    this.loggedUserService.loggedUser.subscribe(user => this.currentUser = user);
    this.firstName = "Jane";
    this.lastName = "Doe";
    this.username = "janedoe";
    this.email = "janedoe@gmail.com"
    this.role = "doctor";
    /*this.firstName = this.currentUser.firstName;
    this.lastName = this.currentUser.lastName;
    this.username = this.currentUser.username;
    this.role = this.currentUser.role;*/
  }
}
