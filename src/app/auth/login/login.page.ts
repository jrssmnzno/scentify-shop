import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  credentials = {
    email: '',
    password: ''
  };
  rememberMe = false;
  showPassword = false;
  isLoading = false;
  errorMessage = '';
  hasError = false;

  demoCredentials = {
    admin: { email: 'admin@scentify.com', password: 'admin123' },
    client: { email: 'user@scentify.com', password: 'user123' }
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // If already logged in, redirect
    if (this.authService.isLoggedIn) {
      this.redirectBasedOnRole();
    }
    
    // Get demo credentials from service
    this.demoCredentials = this.authService.getDemoCredentials();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  fillDemoCredentials(type: 'admin' | 'client') {
    if (type === 'admin') {
      this.credentials.email = this.demoCredentials.admin.email;
      this.credentials.password = this.demoCredentials.admin.password;
    } else {
      this.credentials.email = this.demoCredentials.client.email;
      this.credentials.password = this.demoCredentials.client.password;
    }
    this.hasError = false;
    this.errorMessage = '';
  }

  async onLogin() {
    if (!this.credentials.email || !this.credentials.password) {
      this.showError('Please enter both email and password');
      return;
    }

    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';

    try {
      const result = await this.authService.login(
        this.credentials.email,
        this.credentials.password,
        this.rememberMe
      );

      if (result.success) {
        // Success - redirect based on role
        this.redirectBasedOnRole();
      } else {
        this.showError(result.error || 'Login failed');
      }
    } catch (error) {
      this.showError('An unexpected error occurred');
    } finally {
      this.isLoading = false;
    }
  }

  showError(message: string) {
    this.errorMessage = message;
    this.hasError = true;
    
    // Trigger shake animation
    setTimeout(() => {
      this.hasError = false;
    }, 500);
  }

  redirectBasedOnRole() {
    if (this.authService.isAdmin) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
