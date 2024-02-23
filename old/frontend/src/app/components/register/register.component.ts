import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { User } from '../../user';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  firstName: any;
  lastName: any;
  username: any;
  email: any;
  password: any;
  confirmPassword: any;
  role: any;
  agreeTerms: any;

  constructor(private route: ActivatedRoute,
            private router: Router,
            private apiService: ApiService) {
    
  }
  ngOnInit(): void {
    this.firstName = '';
    this.lastName = '';
    this.username = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.role = '';
    this.agreeTerms = false;
  }

  register(): void {
    // Logic for registration functionality
    var user = new User(this.firstName, this.lastName, this.username, this.email, this.password, this.role);
    this.apiService.createUser(this.firstName, this.lastName, this.username, this.email, this.password, this.role).subscribe(() => {});
    this.router.navigate(['/dashboard']);
    }
}
