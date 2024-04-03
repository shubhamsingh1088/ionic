import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/crud.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent  implements OnInit {
  userData: any;
  userKeys = Object.keys;
  editForm: FormGroup;
  userId: any;
  public min: Date = new Date(1917, 0, 1);
  public max: Date = new Date(2024, 0, 1);
  constructor(private cd: CrudService, private route: ActivatedRoute, private fb: FormBuilder) {
    this.editForm = this.fb.group({
      firstName: [],
      lastName: [],
      birthDate: [],
      email: [],
      password: [],
    });
  }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.cd.getUser(this.userId).subscribe((user: any) => {
      console.log(user);
      this.editForm = this.fb.group({
        firstName: [user.data.firstName],
        lastName: [user.data.lastName],
        birthDate: [this.convertToDate(user.data.birthDate)],
        email: [user.data.email],
        password: [user.data.password],
      });
    });
  }

  convertToDate(dateString: string): Date | null {
    const parsedDate = new Date(dateString);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    } else {
      return null;
    }
  }

  editUser() {
    this.cd.editUser(this.userId, this.editForm.value).subscribe((data:any) => {
      if(data.success) {
        console.log(data);
        this.editForm.reset();
      } else {
        console.log('Failed to update')
      }
    });
  }

}
