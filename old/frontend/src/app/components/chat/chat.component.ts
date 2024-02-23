import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { User } from '../../user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  currentUserRole: string = 'medic';
  doctorName: string = 'Dr. Jane Doe'
  assignedPatients: User[];
  messages: any[];
  userId: string;
  newMessage: string;

  constructor(private route: ActivatedRoute,
            private router: Router,
            private apiService: ApiService
           ) {
    this.assignedPatients = [];

    this.messages = [
      { text: 'Message 1', sent_by: 'userId1' },
      { text: 'Message 2', sent_by: 'userId2' },
      { text: 'Message 3', sent_by: 'userId1' },
      { text: 'Message 4', sent_by: 'userId2' },
      { text: 'Message 5', sent_by: 'userId1' },
      { text: 'Message 6', sent_by: 'userId2' }
    ];

    this.userId = 'userId1'; // Simulating the current user's ID
    this.newMessage = '';
  }

  ngOnInit(): void {
    this.getPatients();
    //this.getMessagesWithPatient("andrewdoe@yahoo.mail");
  }

  getPatients(): void {
    this.apiService.getPatients()
      .subscribe(data => {
        this.assignedPatients = data;
      });
  }

  getMessagesWithPatient(email: string): void {
    this.apiService.getMessagesWithPatient(email)
      .subscribe(data => {
        this.assignedPatients = data;
        console.log(this.assignedPatients[0].firstName)
      });
  }

  sendMessage(): void {
    // Logic for sending a message
    if (this.newMessage.trim() !== '') {
      const newMessageObj = {
        text: this.newMessage,
        sent_by: this.userId
      };
      this.messages.push(newMessageObj);
      this.newMessage = '';
    }

    this.apiService.sendNewMessage("janedoe@yahoo.mail", this.assignedPatients[0].email, this.newMessage).subscribe(() => {});
  }

  // Other component logic and code

}
