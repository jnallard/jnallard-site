import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { tap } from 'rxjs';

@Component({
  selector: 'app-auth-button',
  templateUrl: './auth-button.component.html',
  styleUrls: ['./auth-button.component.css']
})
export class AuthButtonComponent {

  static authEmail: string;

  constructor(private auth: AuthService) {
    this.auth.user$.subscribe(user => {
      AuthButtonComponent.authEmail = user?.email ?? '';
    })
  }

  isLoggedIn$() {
    return this.auth.isAuthenticated$;
  }

  logIn() {
    this.auth.loginWithRedirect();
  }

  logOut() {
    this.auth.logout({ logoutParams: { returnTo: document.location.origin } });
  }

  getUser$() {
    return this.auth.user$; //.pipe(tap(user => AuthButtonComponent.authId = user?.email ?? ''));
  }
}
