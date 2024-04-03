import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from './crud.service';
import { ToasterService } from './toaster.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated: boolean = false;
  private authSecretKey: string = 'Bearer Token';
  
  constructor(private router: Router, private cd: CrudService, private toasterService: ToasterService) {
    this.isAuthenticated = !!localStorage.getItem(this.authSecretKey);
  }
  
  login(email: string, password: string) {
    this.cd.checkUserLogin(email, password).subscribe({
      next: (res: any) => {
        if (res.success) {
          const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpheWRlZXAgUGF0aWwiLCJpYXQiOjE1MTYyMzkwMjJ9.yt3EOXf60R62Mef2oFpbFh2ihkP5qZ4fM8bjVnF8YhA';
          localStorage.setItem(this.authSecretKey, authToken);
          this.isAuthenticated = true;
          this.toasterService.showSuccess(res.message);
          this.router.navigate(['/dashboard']);
        } else {
          console.log('Authentication failed');
          this.isAuthenticated = false;
          this.toasterService.showError(res.error.message);
        }
      },
      error: (error: any) => {
        console.log('HTTP error:', error.error.message);
        this.isAuthenticated = false;
        this.toasterService.showError(error.error.message);
      }
    });
  }
  
  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }
  
  logout(): void {
    localStorage.removeItem(this.authSecretKey);
    this.isAuthenticated = false;
    this.toasterService.showSuccess('Succesfully Logged Out')
    this.router.navigate(['/login']);
  }
  
}
