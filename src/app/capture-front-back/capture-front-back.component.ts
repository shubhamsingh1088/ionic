import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { ToasterService } from '../toaster.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-capture-front-back',
  templateUrl: './capture-front-back.component.html',
  styleUrls: ['./capture-front-back.component.scss'],
})
export class CaptureFrontBackComponent  implements OnInit {
  isFrontPhoto: boolean = false;
  isBackPhoto: boolean = false;
  frontFilePath: any;
  backFilePath: any;
  showError: boolean = false;
  
  constructor(public photoService: PhotoService, public toasterService: ToasterService, private router: Router) {
    window.onload = () => {
      this.photoService.photos.forEach((data: any) => {
        console.log(data);
        if (data.type === 'front') {
          this.isFrontPhoto = true;
          this.frontFilePath = data.filepath;
        } else if(data.type === 'back') {
          this.isBackPhoto = true;
          this.backFilePath = data.filepath;
        }
      });
    }
  }
  
  async ngOnInit() {
    this.photoService.loadSaved();
    this.getImages();
  }
  
  async addPhotoToGallery(value: string) {
    if(value === 'front') {
      await this.photoService.addNewToGallery(value);
      await this.photoService.loadSaved();
      this.getImages();
    } else if(value === 'back') {
      await this.photoService.addNewToGallery(value);
      await this.photoService.loadSaved();
      this.getImages();
    }
  }
  
  async getImages() {
    if (this.photoService.photos.length === 0) {
      this.isFrontPhoto = false;
      this.isBackPhoto = false;
    } else {
      this.photoService.photos.forEach((data: any) => {
        if (data.type === 'front') {
          console.log('front');
          this.isFrontPhoto = true;
          this.frontFilePath = data.filepath;
        } else if(data.type === 'back') {
          console.log('back');
          this.isBackPhoto = true;
          this.backFilePath = data.filepath;
        }
      });
    }
  }
  
  async deleteFrontImage() {
    await this.photoService.deletePicture('front', this.frontFilePath);
    this.updateView('front');
  }
  
  async deleteBackImage() {
    await this.photoService.deletePicture('back', this.backFilePath);
    this.updateView('back');
  }
  
  updateView(value: string) {
    if(value === 'front') {
      this.isFrontPhoto = false;
    } else if(value === 'back') {
      this.isBackPhoto = false;
    }
  }
  
  onCancel() {
    this.router.navigate(['/dashboard/profile']);
  }
  
  onDone() {
    if(this.isFrontPhoto && this.isBackPhoto) {
      this.showError = false;
      this.photoService.photos.forEach((data: any) => {
        this.photoService.pushData(data);
        this.photoService.convertImageObjectToFile(data);
      });
      this.router.navigate(['/dashboard/profile']);
    } else {
      this.showError = true;
    }
  }
  
}
