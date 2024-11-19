import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
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
export class SignupComponent implements OnInit, OnDestroy {
  signupForm!: FormGroup;
  hidePassword = true;
  private subscription: Subscription | null = null; // Manejo de la suscripción

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Inicialización del formulario con validadores para cada campo
    this.signupForm = this.fb.group({
      username: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      full_name: [null, [Validators.required]]
    });
  }

  // Método para alternar la visibilidad de la contraseña
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  // Método de suscripción para manejar el envío del formulario
  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.snackBar.open('Please fill out the form correctly.', 'Close', { duration: 5000 });
      return;
    }

    // Llamada al servicio de registro
    this.subscription = this.authService.register(this.signupForm.value).subscribe({
      next: () => {
        this.snackBar.open('Sign up successful!', 'Close', { duration: 5000 });
        this.router.navigateByUrl('/login');
      },
      error: () => {
        this.snackBar.open('Sign up failed. Please try again.', 'Close', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }

  // Método para liberar la suscripción al salir del componente
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
