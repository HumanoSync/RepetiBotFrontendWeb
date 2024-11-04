import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserStorageService } from './user-storage.service';
import { map, Observable } from 'rxjs';
const BASIC_URL = "http://localhost:8000/";
@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private http: HttpClient, private userStorageService: UserStorageService
    ) { }

  register (signupRequest: any): Observable<any>{
    return this.http.post(BASIC_URL + "api/v1/auth/register", signupRequest);
  }
  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { username, password };
    console.log('Logging in with:', body); // Verifica los datos enviados
  
    return this.http.post(BASIC_URL + 'api/v1/auth/login', body, { headers })
      .pipe(
        map((res: any) => {
          console.log('Login response:', res); // Verifica la respuesta del servidor
          const token = res.access_token;
          const user = res.userResponse;
         
          
          if (token && user) {
            this.userStorageService.saveToken(token);
            this.userStorageService.saveUser(user);
            console.log('Token saved:', token); // Verifica que el token se guarde correctamente
            console.log('User saved:', user); // Verifica que el usuario se guarde correctamente
            




            return {success: true, user};
          }
          else {
            console.error('Token or user missing'); // Verifica si hay problemas con el token o el usuario
          }
          return{success: false};
        })
      );
  }
  
}
