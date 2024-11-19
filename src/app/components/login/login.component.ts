import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { AuthServiceService } from '../../services/storage/auth-service.service';
import { UserStorageService } from '../../services/storage/user-storage.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthServiceService,
    private userStorageService: UserStorageService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],  // Corrección en la estructura de validadores
      password: [null, [Validators.required]]
    });
  }

  // Alternar visibilidad de la contraseña
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  // Método de envío del formulario
  onSubmit(): void {
    console.log('Form submitted', this.loginForm.value);
    console.log('Form valid:', this.loginForm.valid);

    if (this.loginForm.invalid) {
      this.snackBar.open('Please fill out the form correctly.', 'Close', { duration: 5000 });
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res: any) => {
        console.log('Login response:', res);

        const userResponse = res.user;  // Reemplaza userResponse con user si es necesario en tu API

        if (userResponse) {
          this.userStorageService.saveToken(res.access_token);
          this.userStorageService.saveUser(userResponse);

          // Navegación basada en el rol del usuario
          switch (userResponse.role) {
            case 'admin':
              console.log('Navigating to servo');
              this.router.navigateByUrl('/servo');
              break;
            case 'user':
              console.log('Navigating to my-robot');
              this.snackBar.open('Login successful!', 'Close', { duration: 5000 });
              this.router.navigateByUrl('/my-robot');
              break;
            default:
              this.snackBar.open('Unknown user role', 'ERROR', { duration: 5000 });
          }
        } else {
          console.error('User response is undefined:', userResponse);
          this.snackBar.open('User response is not valid', 'ERROR', { duration: 5000 });
        }
      },
      error: (error: any) => {
        console.error('Login error', error);
        const errorMessage = error.status === 401 ? 'Invalid email or password' : 'An unexpected error occurred';
        this.snackBar.open(errorMessage, 'ERROR', { duration: 5000 });
      }
    });
  }
}
