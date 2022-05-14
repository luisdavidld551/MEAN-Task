import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTaskComponent } from './board/list-task/list-task.component';
import { LoginComponent } from './home/login/login.component';
import { RegisterComponent } from './home/register/register.component';

import { AuthGuard } from './guard/auth.guard';
import { SaveTaskComponent } from './board/save-task/save-task.component';
import { ListTaskAdminComponent } from './admin/list-task-admin/list-task-admin.component';
import { ListRoleComponent } from './admin/list-role/list-role.component';
import { RegisterTaskComponent } from './admin/register-task/register-task.component';
import { ListUserComponent } from './admin/list-user/list-user.component';
import { AssignTaskComponent } from './admin/assign-task/assign-task.component';
import { ProfileUserComponent } from './user/profile-user/profile-user.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path:'signUp',
    component: RegisterComponent
  },
  {
    path:'listTask',
    component: ListTaskComponent,
    canActivate: [AuthGuard],
  },
  {
    path:'saveTask',
    component: SaveTaskComponent,
    canActivate: [AuthGuard],
  },
  {
    path:'listRole',
    component: ListRoleComponent,
    canActivate: [AuthGuard],
  },
  {
    path:'listTaskAdmin',
    component: ListTaskAdminComponent,
    canActivate: [AuthGuard],
  },
  {
    path:'saveTaskAdmin',
    component: RegisterTaskComponent,
    canActivate: [AuthGuard],
  },
  {
    path:'listUser',
    component: ListUserComponent,
    canActivate: [AuthGuard],
  },
  {
    path:'assignTask/:_id',
    component: AssignTaskComponent,
    canActivate: [AuthGuard],
  },
  {
    path:'profile',
    component: ProfileUserComponent,
    //canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
