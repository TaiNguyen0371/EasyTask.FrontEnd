import { NgModule, createComponent } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { WorkspaceComponent } from './components/workspaces/workspace.component';
import { WorkspaceDetailComponent } from './components/workspace-detail/workspace-detail.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'workspaces', component: WorkspaceComponent},
  {path: 'wspDetail/:id', component: WorkspaceDetailComponent}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
