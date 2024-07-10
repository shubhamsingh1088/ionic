import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-courses',
  templateUrl: './all-courses.component.html',
  styleUrls: ['./all-courses.component.scss'],
})
export class AllCoursesComponent  implements OnInit {

  courses:any;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getAllCourses();
  }

  getAllCourses() {
    this.http.get('http://localhost:3000/items').subscribe((data: any) => {
      this.courses = data;
      console.log(this.courses);
    });
  }

}
