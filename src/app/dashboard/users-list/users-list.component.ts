import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/crud.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent  implements OnInit {
  public gridData: [] = [];
  constructor(private crudService: CrudService, private router: Router) { }

  ngOnInit() {
    this.fetchAllUsers();
  }

  fetchAllUsers() {
    this.crudService.fetchData().subscribe((res: any) => {
      if(res.success) {
        this.gridData = res.data;
        console.log(res.data);
      } else {
        console.log('data failed to load');
      }
    });
  }

  viewUser(userId: string) {
    this.router.navigate(['/dashboard/user', userId]);
  }

  editUser(userId: string) {
    this.router.navigate(['/dashboard/edit-user', userId]);
  }

  deleteUser(userId: string) {
    this.crudService.deleteUser(userId).subscribe((data: any) => {
      if(data.success) {
        console.log(data.message);
      } else {
        console.log('Something failed')
      }
    });
  }

}
