import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

import { ServoControlComponent } from './components/servo-control/servo-control.component';
import { MyRobotComponent } from './components/my-robot/my-robot.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'servo', component: ServoControlComponent },
    { path: 'my-robot', component: MyRobotComponent},


];
