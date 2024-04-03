import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent  implements OnInit {
  @Input() message!: string;
  @Input() type!: string;
  logout: boolean = false;
  insurance: boolean = false;
  croppedImage!: string;
  imagePreview: boolean = false;
  imageChangedEvent: any = '';

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    switch(this.type) {
      case 'logout':
        this.logout = true;
        break;
      case 'insurance':
        this.insurance = true;
        break;
      case 'imagePreview':
        this.imagePreview = true;
        break;
      default:
        // Handle default case if needed
        break;
    }    
  }

  imageCropped(event: ImageCroppedEvent) {
    if (event && event.objectUrl) {
      this.croppedImage = event.objectUrl;
      return;
    } else {
      console.error('Error cropping the image.');
    }
  }

  imageLoaded(image: LoadedImage) {
    // console.log(image);
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  closeModal() {
    this.modalController.dismiss();
  }

  confirmAction() {
    this.modalController.dismiss({ confirmed: true, croppedImage: this.croppedImage });
  }

  cancelAction() {
    this.modalController.dismiss({ confirmed: false });
  }

}
