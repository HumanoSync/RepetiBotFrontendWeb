import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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
    MatIconModule,
    ReactiveFormsModule
   
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: FormGroup;
  hidePassword= true;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthServiceService,
    private userStorageService: UserStorageService,
    private snackBar: MatSnackBar,
    private router: Router
  ){}
 
  ngOnInit():void{
    this.loginForm= this.formBuilder.group({
      username: [null,[Validators.required]],
      password: [null,[Validators.required]],

    })
  }
  togglePasswordVisibility(){
    this.hidePassword = !this.hidePassword;
    
  }
  onSubmit(): void {
    console.log('Form submitted', this.loginForm.value);
    console.log('Form valid:', this.loginForm.valid);

    if (this.loginForm.invalid) {
      this.snackBar.open('Please fill out the form correctly.', 'Close', { duration: 5000 });
      return;
    }

    const username = this.loginForm.get('username')!.value;
    const password = this.loginForm.get('password')!.value;

    this.authService.login(username, password).subscribe({
      next: (res: any) => {
        console.log('Login response:', res); // Asegúrate de que la respuesta sea la esperada
      
        // Acceder a user desde la respuesta
        const userResponse = res.user; // Cambia esto de userResponse a user
      
        if (userResponse) {
          this.userStorageService.saveToken(res.access_token);
          this.userStorageService.saveUser(userResponse);
      
          // Verifica el rol del usuario y navega a la ruta correspondiente
          switch (userResponse.role) {
            case 'ADMIN':
              console.log('Navigating to servo');
              this.router.navigateByUrl('/servo');
              break;
            case 'USER':
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
        const errorMessage = error.status === 401 ? 'Invalid username or password' : 'An unexpected error occurred';
        this.snackBar.open(errorMessage, 'ERROR', { duration: 5000 });
      }
    });
}

  

}
