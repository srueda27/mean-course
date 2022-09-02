import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  credentials = {
    email: '',
    password: ''
  }

  private authStatusSub: Subscription = new Subscription;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => this.isLoading = authStatus
    )
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe()
  }

  login() {
    this.isLoading = true
    this.authService.login(this.credentials.email, this.credentials.password)
  }
}
