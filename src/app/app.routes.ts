import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ConnectionManagerComponent} from './components/connection-manager/connection-manager.component';
import { ServoControlComponent } from './components/servo-control/servo-control.component';
export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'connection', component: ConnectionManagerComponent },
    { path: 'servo', component: ServoControlComponent },
];
