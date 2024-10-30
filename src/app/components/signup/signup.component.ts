import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';  // Para usar directiva *ngIf
import { AuthServiceService } from '../../services/storage/auth-service.service';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
    MatNativeDateModule,
    NgIf,
    CommonModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm! : FormGroup;
  hidePassword = true;
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthServiceService,
    private router: Router){

  }

  ngOnInit():void{
    this.signupForm= this.fb.group({
      username:[null, [Validators.required, Validators.email]],
      password: [null,[Validators.required]],
      phone: [null, [Validators.required]]


    })
  }

  togglePasswordVisibility(){
    this.hidePassword= !this.hidePassword;
  }

  onSubmit():void {
    const password = this.signupForm.get('password')?.value;


    const subscription: Subscription = this.authService.register(this.signupForm.value)
    .subscribe({
      next: (response) => {
        this.snackBar.open('Sign up successful!', 'Close', { duration: 5000 });
        this.router.navigateByUrl("/login");
      },
      error: (error) => {
        this.snackBar.open('Sign up failed. Please try again.', 'close', {
          duration: 5000, panelClass: 'error-snackbar'
        });
      }
    });




  }


  // Método para acceder a los campos del formulario
  
}

