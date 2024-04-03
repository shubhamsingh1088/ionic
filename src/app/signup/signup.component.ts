import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CrudService } from '../crud.service';
import { ToasterService } from '../toaster.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  registerForm!: FormGroup;
  public min: Date = new Date(1917, 0, 1);
  public max: Date = new Date(2024, 0, 1);
  formValues!: object;
  constructor(private cd: CrudService, private toasterService: ToasterService) { }
  
  generateForm() {
    this.registerForm = new FormGroup({
      userId: new FormControl(''),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      birthDate: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }
  
  ngOnInit() {
    this.generateForm();
  }
  
  submitForm() {
    this.registerForm.markAllAsTouched();
    if(this.registerForm.valid) {
      const uniqueId = this.generateUniqueId();
      this.registerForm.patchValue({
        userId: uniqueId
      });
      this.formValues = this.registerForm.value;
      console.log(this.formValues);
      this.cd.postData(this.formValues).subscribe((data: any) => {
        if(data) {
          this.toasterService.showSuccess(data.message);
          console.log(data);
        }
      });
    } else {
      this.toasterService.showError('Form is invalid. Please fill out all required fields.');
    }
  }
  
  generateUniqueId() {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return randomNumber.toString();
  }
  
  clearForm() {
    this.registerForm.reset();
  }
  
}
