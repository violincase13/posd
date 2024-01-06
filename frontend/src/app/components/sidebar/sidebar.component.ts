import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../user';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  userRole: any; // Setati acest camp cu rolul utilizatorului curent (patient/doctor)
  patients:  User[];
  doctors:  User[];
  loggedUser: string;

  constructor(private route: ActivatedRoute,
            private router: Router,
            private apiService: ApiService
           ) {
    this.patients = [];
    this.doctors = [];
    this.loggedUser = "janedoe@yahoo.mail";
  }
  ngOnInit(): void {
    //this.patients = this.getPatients();
    //console.log(this.patients);
    //this.getDoctors();
    this.apiService.getPatient(this.loggedUser)
      .subscribe(data => {
        this.loggedUser = data;
      });

    this.userRole = 'medic';
  }

  getPatients(): void {
    this.apiService.getPatients()
      .subscribe(data => {
        this.patients = data;
        //console.log(this.patients);
      });
  }

  getDoctors(): void {
    this.apiService.getDoctors()
      .subscribe(data => {
        this.doctors = data;
      });
  }

  logout() {
    // Logica pentru deconectare
    console.log('Log out clicked');
    this.router.navigate(['/login']);
  }
}
