import { Component, OnInit } from '@angular/core';
import { SVGIcon, userIcon } from "@progress/kendo-svg-icons";
import { ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/crud.service';

@Component({
  selector: 'app-single-user',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.scss'],
})
export class SingleUserComponent  implements OnInit {
  public userSvg: SVGIcon = userIcon;
  userData: any;
  userKeys = Object.keys;

  constructor(private route: ActivatedRoute, private cd: CrudService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.getUserData(id);
  }

  getUserData(id: string) {
    this.cd.getUser(id).subscribe((res: any) => {
      if(res.success) {
        this.userData = res.data;
        console.log(this.userData);
      } else {
        console.log('Failed to fetch data');
      }
    });
  }

  getObjectKeys(obj: any): string[] {
    return obj? Object.keys(obj): [];
  }

}
