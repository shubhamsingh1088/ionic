import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { UsersListComponent } from './users-list/users-list.component';
import { SingleUserComponent } from './single-user/single-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { CaptureFrontBackComponent } from '../capture-front-back/capture-front-back.component';
import { IframeComponentComponent } from './iframe-component/iframe-component.component';

const routes: Routes = [
  {
    path: '',
    // canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent },
      { path: 'users-list', component: UsersListComponent },
      { path: 'user/:id', component: SingleUserComponent },
      { path: 'edit-user/:id', component: EditUserComponent },
      { path: 'insurance-card', component: CaptureFrontBackComponent },
      { path: 'iframe', component: IframeComponentComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
