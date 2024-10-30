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
    console.log('Form submitted', this.loginForm.value); // Mensaje de envío del formulario
    console.log('Form valid:', this.loginForm.valid); // Verificar si el formulario es válido

    if (this.loginForm.invalid) {
      this.snackBar.open('Please fill out the form correctly.', 'Close', { duration: 5000 });
      return; // Salir si el formulario no es válido
    }

    const username = this.loginForm.get('username')!.value;
    const password = this.loginForm.get('password')!.value;

    this.authService.login(username, password).subscribe({
      next: (res: any) => {
        // Suponiendo que 'res.userResponse' contenga los datos del usuario
        const userResponse = res.userResponse; 

        // Guarda el token y la información del usuario
        UserStorageService.saveToken(res.access_token);
        UserStorageService.saveUser(userResponse);

        // Verifica el rol del usuario y navega a la ruta correspondiente
        if (userResponse.role =='admin') {
          console.log('Navigating to servo');
          this.router.navigateByUrl('servo');
        } else if (userResponse.role =='user') {
          console.log('Navigating to my-robot');
          this.snackBar.open('Login successful!', 'Close', { duration: 5000 });
          this.router.navigateByUrl('my-robot');
        } else {
          this.snackBar.open('Unknown user role', 'ERROR', { duration: 5000 });
        }
      },
      error: (error: any) => {
        console.error('Login error', error);
        this.snackBar.open('Bad credentials', 'ERROR', { duration: 5000 });
      }
    });
  }
  

}
