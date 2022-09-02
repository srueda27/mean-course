import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  credentials = {
    email: '',
    password: ''
  }

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  login() {
    this.isLoading = true
    this.authService.login(this.credentials.email, this.credentials.password)
  }
}
