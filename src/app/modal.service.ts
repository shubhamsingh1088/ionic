import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from './modal/modal.component';
import { IframeComponentComponent } from './dashboard/iframe-component/iframe-component.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  public croppedImage: string | null = null;
  constructor(private modalController: ModalController) { }
  
  async openDynamicModal(data: any) {
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: { message: data }
    });
    await modal.present();
    return modal.onDidDismiss();
  }

  async openIframeModal() {
    const modal = await this.modalController.create({
      component: IframeComponentComponent,
    });
    await modal.present();
    return modal.onDidDismiss();
  }

}
