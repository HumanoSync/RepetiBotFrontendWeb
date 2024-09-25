import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HeaderComponent } from '../pages/header/header.component';
import { FooterComponent } from '../pages/footer/footer.component';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';  // Para usar directiva *ngIf

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
    MatNativeDateModule,
    HeaderComponent,
    FooterComponent,
    NgIf
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(7)]],
      region: ['', Validators.required],
      birthDate: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9,12}$/)]],
      idCard: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      typeofuser: ['', Validators.required],
      description: ['']
    });
  }

  // Método para manejar el envío del formulario
  onSubmit(): void {
    if (this.signupForm.valid) {
      console.log('Form Submitted', this.signupForm.value);
      alert('Form successfully submitted!');
    } else {
      alert('Please fill all the required fields correctly.');
    }
  }

  // Método para acceder a los campos del formulario
  get email() {
    return this.signupForm.get('email');
  }

  get first_name() {
    return this.signupForm.get('first_name');
  }

  get last_name() {
    return this.signupForm.get('last_name');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get region() {
    return this.signupForm.get('region');
  }

  get birthDate() {
    return this.signupForm.get('birthDate');
  }

  get phone() {
    return this.signupForm.get('phone');
  }

  get idCard() {
    return this.signupForm.get('idCard');
  }

  get typeofuser() {
    return this.signupForm.get('typeofuser');
  }

  get description() {
    return this.signupForm.get('description');
  }
}

