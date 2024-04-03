import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { UsersListComponent } from './users-list/users-list.component';
import { SingleUserComponent } from './single-user/single-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy } from '@angular/router';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from "@progress/kendo-angular-label";
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ModalComponent } from '../modal/modal.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CaptureFrontBackComponent } from '../capture-front-back/capture-front-back.component';
import { IframeComponentComponent } from './iframe-component/iframe-component.component';

@NgModule({
  declarations: [ProfileComponent, UsersListComponent, SingleUserComponent, EditUserComponent, ModalComponent, CaptureFrontBackComponent, IframeComponentComponent],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    DashboardRoutingModule,
    GridModule,
    ButtonsModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    InputsModule,
    LabelModule,
    DateInputsModule,
    ImageCropperModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
})
export class DashboardModule { }
