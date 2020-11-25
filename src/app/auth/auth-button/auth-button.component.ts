import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-auth-button',
  templateUrl: './auth-button.component.html',
  styleUrls: ['./auth-button.component.css']
})
export class AuthButtonComponent {

  constructor(private auth: AuthService) {
  }

  isLoggedIn$() {
    return this.auth.isAuthenticated$;
  }

  logIn() {
    this.auth.loginWithRedirect();
  }

  logOut() {
    this.auth.logout({ returnTo: document.location.origin });
  }

  getUser$() {
    return this.auth.user$;
  }
}
