import { Injectable } from '@angular/core';
const TOKEN = 'authToken';
const USER = 'user';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  constructor() {}

  public saveToken(token: string): void {
    window.localStorage.setItem(TOKEN, token);
  }

  public saveUser(user: any): void {
    window.localStorage.setItem(USER, JSON.stringify(user));
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

  static getUserId(): number {
    const user = this.getUser();
    return user?.id ?? 0;
  }

  static getUserRole(): string {
    const user = this.getUser();
    return user?.role ?? '';
  }

  static isAdminLoggedIn(): boolean {
    const token = this.getToken();
    const role = this.getUserRole();
    return !!token && role === 'ADMIN';
  }

  static isCustomerLoggedIn(): boolean {
    const token = this.getToken();
    const role = this.getUserRole();
    return !!token && role === 'USER';
  }

  static signOut(): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);
  }
}

