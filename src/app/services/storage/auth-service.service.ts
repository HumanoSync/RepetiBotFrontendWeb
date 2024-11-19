import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserStorageService } from './user-storage.service';
import { map, Observable } from 'rxjs';

const BASIC_URL = "https://humansyncbackend.onrender.com/";

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(
    private http: HttpClient,
    private userStorageService: UserStorageService
  ) {}

  // Registro de usuario
  register(signupRequest: any): Observable<any> {
    return this.http.post(BASIC_URL + "api/v1/auth/register", signupRequest);
  }

  // Inicio de sesión
  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { email, password };
    console.log('Iniciando sesión con:', body); 

    return this.http.post(BASIC_URL + 'api/v1/auth/login', body, { headers })
      .pipe(
        map((res: any) => {
          console.log('Respuesta de inicio de sesión:', res);
          const token = res.access_token;
          const user = res.userResponse;

          if (token && user) {
            this.userStorageService.saveToken(token);
            this.userStorageService.saveUser(user);
            console.log('Token y usuario guardados correctamente');
            return { success: true, user };
          } else {
            console.error('Faltan el token o el usuario en la respuesta');
            return { success: false };
          }
        })
      );
  }
}