import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-iframe-component',
  templateUrl: './iframe-component.component.html',
  styleUrls: ['./iframe-component.component.scss'],
})
export class IframeComponentComponent  implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }

}
