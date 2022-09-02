import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isLoading = false;
  credentials = {
    email: '',
    password: ''
  }

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  signup() {
    this.isLoading = true
    this.authService.createUser(this.credentials.email, this.credentials.password)
  }
}
