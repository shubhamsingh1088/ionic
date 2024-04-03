import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToasterService } from '../toaster.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {
  loginForm!: FormGroup;
  constructor(private authService: AuthService, private router: Router, private toasterService: ToasterService) { }
  
  generateForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }
  
  ngOnInit() {
    this.generateForm();
  }
  
  login() {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    if(email !== null && email !== undefined && email !== '' && password !== null && password !== undefined && password !== '') {
      this.authService.login(email, password);
    } else {
      this.toasterService.showError('Please fill in the required details');
    }
  }
  
}
