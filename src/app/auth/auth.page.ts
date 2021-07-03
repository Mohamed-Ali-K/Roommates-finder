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
  isLogin = true;
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
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    console.log(email, password);
    if (this.isLogin) {
      // Send a request to login server
    } else{
      this.authService.singup(email, password).subscribe(resData =>{
        console.log(resData);
      });
    }
  }
  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }
}
