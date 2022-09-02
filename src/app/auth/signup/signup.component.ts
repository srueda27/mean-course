import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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

  signup() {
    this.isLoading = true
    this.authService.createUser(this.credentials.email, this.credentials.password)
  }
}
