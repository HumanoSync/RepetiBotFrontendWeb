import { Injectable } from '@angular/core';
const TOKEN = 'authToken';
const USER = 'user';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  constructor() {}

  // Guardar el token en localStorage
  saveToken(token: string): void {
    console.log("Guardando token:", token);  // Confirmar el valor recibido
    if (!token) {
      console.error("Token inválido:", token);
      return;
    }
    window.localStorage.setItem(TOKEN, token);
    console.log("Token guardado en localStorage:", window.localStorage.getItem(TOKEN));  // Confirmar que se guardó
  }

  // Obtener el token desde localStorage
  getToken(): string | null {
    const token = window.localStorage.getItem(TOKEN);
    console.log("Token de localStorage:", token);  // Verificar el token al obtenerlo
    if (!token) {
      console.error("Token no encontrado en localStorage");
    }
    return token;
  }

  // Guardar usuario en localStorage
  saveUser(user: any): void {
    console.log("Guardando usuario:", user);
    window.localStorage.setItem(USER, JSON.stringify(user));
  }



  

  // Obtener usuario desde localStorage
  getUser(): any {
    try {
      const user = window.localStorage.getItem(USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      return null;
    }
  }

  // Limpiar datos de sesión
  signOut(): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);
  }
}
