import { Injectable } from '@angular/core';
const TOKEN = 'authToken';
const USER = 'user';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {
  

  constructor() { }

 static saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.setItem(TOKEN, token);
    localStorage.setItem('authToken', token);

  }

  static saveUser(user: any):void{
    window.localStorage.removeItem(USER);
    window.localStorage.setItem(USER, JSON.stringify(user));
    localStorage.setItem('user', JSON.stringify(user));
  }

  static getToken(): string {
    const token = localStorage.getItem(TOKEN);
    if (token === null) {
        throw new Error("Token not found in localStorage");
    }
    return token;
}

static getUser(): any {
  try {
      const user = localStorage.getItem(USER);
      return user ? JSON.parse(user) : {};
  } catch (error) {
      console.error("Error parsing user data:", error);
      return {};
  }
}


  static getUserId():number {
    const user = this.getUser();
    if(user == null || user.userId == null){
      return 0;
    }
    return user.userId;

  }

  static getUserRole(): string {
    const user = this.getUser();
    if(user == null){
      return '';
    }
    return user.role;
  }


  static isAdminLoggedIn(): boolean {
    const token = this.getToken();
    const role: string = this.getUserRole();
    return !!token && role === 'admin';
  }
  
  static isCustomerLoggedIn(): boolean {
    const token = this.getToken();
    const role: string = this.getUserRole();
    return !!token && role === 'user';
  }
  

  static signOut(): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);

  }







}


