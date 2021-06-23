import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false ;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}
  onLogin() {
    this.authService.login();
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigateByUrl('/places/tabs/discover');
    }, 1500);
  }
}
