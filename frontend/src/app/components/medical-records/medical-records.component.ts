import { Component } from '@angular/core';
import { MedicalRecord } from '../../medical_record';
import { Prescription } from '../../prescription';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { User } from '../../user';

@Component({
  selector: 'app-medical-records',
  templateUrl: './medical-records.component.html',
  styleUrls: ['./medical-records.component.scss']
})
export class MedicalRecordsComponent {
  patients: User[];
  medicalRecords: MedicalRecord[];
  prescriptions: Prescription[];
  activePatient: string;

  constructor(private route: ActivatedRoute,
            private router: Router,
            private apiService: ApiService,
           ) {
    this.patients = [];
    this.medicalRecords = [];
    this.prescriptions = [];
    this.activePatient = "";
  }

  getMedicalRecords(): void {
    this.apiService.getMedicalRecordsForPatient(this.activePatient)
      .subscribe(data => {
        this.medicalRecords = data;
        //console.log(this.patients);
      });
  }

  getPrescriptions(): void {
    this.apiService.getPrescriptionsForPatient(this.activePatient)
      .subscribe(data => {
        this.prescriptions = data;
        console.log(this.prescriptions);
      });
  }

  showPatientDetails(index: number) {
    this.activePatient = this.patients[index].email;
    this.getMedicalRecords();
    this.getPrescriptions();
  }
}