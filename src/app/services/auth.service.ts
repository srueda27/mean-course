import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import IAuthData from '../models/auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | undefined
  private authStatus = false
  private tokenTimer: any | undefined;

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token
  }

  getAuthStatus() {
    return this.authStatus
  }

  createUser(email: string, password: string) {
    const authData: IAuthData = { email, password }
    this.http.post('http://localhost:3000/api/user/signup', authData)
      .subscribe(response => {
        this.router.navigate(['/'])
      })
  }

  login(email: string, password: string) {
    const authData: IAuthData = { email, password }
    this.http.post<{ token: string, expiresIn: number }>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        this.token = response.token

        if (this.token) {
          const expiresInDuration = response.expiresIn
          this.setAuthTimer(expiresInDuration)
          this.authStatus = true
          const expirationDate = new Date(new Date().getTime() + (expiresInDuration * 1000))
          this.saveAuthData(this.token, expirationDate)
          this.router.navigate(['/'])
        }
      })
  }

  autoAuthUser() {
    const authInfo = this.getAuthDataLocalStorage()
    const now = new Date();
    const expiresIn = authInfo?.expirationDate.getTime() - now.getTime()

    if (expiresIn > 0) {
      this.token = authInfo.token
      this.authStatus = true
      this.setAuthTimer(expiresIn / 1000)
    }
  }

  logout() {
    this.token = undefined
    this.authStatus = false
    clearTimeout(this.tokenTimer)
    this.clearAuthData()
    this.router.navigate(['/'])
  }

  private setAuthTimer(duration: number) {

    this.tokenTimer = setTimeout(() => {
      this.logout()
    }, duration * 1000)

  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token)
    localStorage.setItem('expirationDate', expirationDate.toISOString())
  }

  private clearAuthData() {
    localStorage.removeItem('token')
    localStorage.removeItem('expirationDate')
  }

  private getAuthDataLocalStorage() {
    const token = localStorage.getItem('token') || undefined
    const expirationDate = localStorage.getItem('expirationDate')

    return {
      token,
      expirationDate: new Date(expirationDate || 0)
    }
  }
}
