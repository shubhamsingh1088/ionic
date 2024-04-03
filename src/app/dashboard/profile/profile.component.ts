import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { PhotoService } from 'src/app/services/photo.service';
import { ModalService } from 'src/app/modal.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent  implements OnInit {
  
  data: any[] = [];
  public subscription!: Subscription;
  
  constructor(private authService: AuthService, public photoService: PhotoService, private router: Router, private route: ActivatedRoute, public modalService: ModalService) {}
  
  async ngOnInit() {
    this.photoService.data$.subscribe(data => {
      this.data = data;
      console.log(this.data);
    });
  }
  
  logout() {
    this.authService.logout();
  }
  
  uploadImages() {
    this.router.navigate(['/dashboard/insurance-card'], { relativeTo: this.route });
  }

  iframeLink() {
    this.modalService.openIframeModal();
  }
  
}
