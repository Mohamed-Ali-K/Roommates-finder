import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

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
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}
  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'login in...' })
      .then((loadingEl) => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;
        if (this.isLogin) {
          authObs = this.authService.login(email, password);
        } else {
          authObs = this.authService.singup(email, password);
        }
        authObs.subscribe(resData =>{
          this.isLoading = false;
          loadingEl.dismiss();
          this.router.navigateByUrl('/places/tabs/discover');
        },errRes =>{
          loadingEl.dismiss();
          const code = errRes.error.error.message;
          let message ='Could not sign you up please try again.';
          if (code === 'EMAIL_EXISTS') {
            message = 'The email address is already in use by another account.';
          } else if (code === 'EMAIL_NOT_FOUND') {
            message = 'There is no user record corresponding to this identifier. The user may have been deleted';
          } else if (code === 'INVALID_PASSWORD') {
            message = 'The password is invalid or the user does not have a password.';
          }
          this.showAlert(message);
        });
      });
  }
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.authenticate(email, password);
  }
  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }
  private showAlert(message: string){
    this.alertCtrl.create({header: 'Authentication failed', message: message, buttons: ['Okay']}).then(alertEl =>alertEl.present());
  }
}
