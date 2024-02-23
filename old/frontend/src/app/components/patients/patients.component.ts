import { Component, OnInit } from '@angular/core';
import { User } from '../../user';
import { MedicalRecord } from '../../medical_record';
import { Prescription } from '../../prescription';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  patients: User[];
  medicalRecords: MedicalRecord[];
  prescriptions: Prescription[];
  activePatient: string;

  constructor(private route: ActivatedRoute,
            private router: Router,
            private apiService: ApiService
           ) {
    this.patients = [];
    this.medicalRecords = [];
    this.prescriptions = []
    this.activePatient = "";
  }

  ngOnInit(): void {
    this.getPatients();
  }

  getPatients(): void {
    this.apiService.getPatients()
      .subscribe(data => {
        this.patients = data;
      });
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


/*      {
        name: 'Patient 1',
        medicalTests: [
          {
            date: '2023-05-01',
            hemogram: 120,
            urea: 10,
            creatine: 0.8,
            ALT: 30,
            AST: 25
          },
          {
            date: '2023-05-10',
            hemogram: 110,
            urea: 12,
            creatine: 0.9,
            ALT: 35,
            AST: 30
          }
        ],
        prescriptions: [
          {
            description: 'Prescription 1'
          },
          {
            description: 'Prescription 2'
          }
        ]
      },
      {
        name: 'Patient 2',
        medicalTests: [
          {
            date: '2023-05-03',
            hemogram: 115,
            urea: 11,
            creatine: 0.7,
            ALT: 32,
            AST: 28
          },
          {
            date: '2023-05-12',
            hemogram: 105,
            urea: 13,
            creatine: 0.8,
            ALT: 38,
            AST: 33
          }
        ],
        prescriptions: [
          {
            description: 'Prescription 3'
          },
          {
            description: 'Prescription 4'
          }
        ]
      },
      // Add more patients here if needed
    ];*/
