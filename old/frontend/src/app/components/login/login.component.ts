import { Component, OnInit } from '@angular/core';
import { User } from '../../user';
import { LoggedUserService } from '../logged-user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: any;
  password: any;
  currentUser: User;

  constructor(private route: ActivatedRoute,
            private router: Router,
            private apiService: ApiService,
            private loggedUserService: LoggedUserService) {
    this.currentUser = new User('', '', '', '', '', '');
    this.username = '';
    this.password = '';
  }

  ngOnInit(): void {
  }

  login() {
    this.apiService.checkUserCredentials(this.username, this.password).subscribe(response => {
      // You can access status:
      console.log(response);
      if (response.length != 0) {
        console.log("ok")
      }
  });
    console.log('Username:', this.username);
    console.log('Password:', this.password);
    this.router.navigate(['/dashboard']);
  }
}
