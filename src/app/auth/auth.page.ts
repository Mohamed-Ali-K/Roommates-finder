import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private loadinCtrl: LoadingController
  ) {}

  ngOnInit() {}
  onLogin() {
    this.authService.login();
    this.isLoading = true;
    this.loadinCtrl
      .create({ keyboardClose: true, message: 'login in...' })
      .then((loadinEl) => {
        loadinEl.present();
        setTimeout(() => {
          this.isLoading = false;
          loadinEl.dismiss();
          this.router.navigateByUrl('/places/tabs/discover');
        }, 1500);
      });
  }
  onSubmit(form: NgForm) {
    console.log(form);
  }
}
