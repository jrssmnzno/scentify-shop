import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  email: string;
  role: 'admin' | 'client';
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  // Pre-configured demo credentials
  private readonly DEMO_USERS = {
    admin: {
      email: 'admin@scentify.com',
      password: 'admin123',
      role: 'admin' as const,
      name: 'Admin User'
    },
    client: {
      email: 'user@scentify.com',
      password: 'user123',
      role: 'client' as const,
      name: 'Client User'
    }
  };

constructor() {
  const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
  this.currentUserSubject = new BehaviorSubject<User | null>(
    storedUser ? JSON.parse(storedUser) : null
  );
  this.currentUser = this.currentUserSubject.asObservable();
}
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  public get isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  public get isClient(): boolean {
    return this.currentUserSubject.value?.role === 'client';
  }

  async login(email: string, password: string, rememberMe: boolean = false): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check admin credentials
    if (email === this.DEMO_USERS.admin.email && password === this.DEMO_USERS.admin.password) {
      const user: User = {
        email: this.DEMO_USERS.admin.email,
        role: this.DEMO_USERS.admin.role,
        name: this.DEMO_USERS.admin.name
      };
      
      if (rememberMe) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
      }
      
      this.currentUserSubject.next(user);
      return { success: true, user };
    }

    // Check client credentials
    if (email === this.DEMO_USERS.client.email && password === this.DEMO_USERS.client.password) {
      const user: User = {
        email: this.DEMO_USERS.client.email,
        role: this.DEMO_USERS.client.role,
        name: this.DEMO_USERS.client.name
      };
      
      if (rememberMe) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
      }
      
      this.currentUserSubject.next(user);
      return { success: true, user };
    }

    // Invalid credentials
    return { success: false, error: 'Invalid email or password' };
  }

  logout() {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getDemoCredentials() {
    return {
      admin: {
        email: this.DEMO_USERS.admin.email,
        password: this.DEMO_USERS.admin.password
      },
      client: {
        email: this.DEMO_USERS.client.email,
        password: this.DEMO_USERS.client.password
      }
    };
  }
}
