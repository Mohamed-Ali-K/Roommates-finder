import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  form: FormGroup;
  private placesSub: Subscription;
  constructor(
    private route: ActivatedRoute,
    private placeService: PlacesService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.placesSub = this.placeService
        .getPlace(paramMap.get('placeId'))
        .subscribe((place) => {
          this.place = place;
          this.form = new FormGroup({
            title: new FormControl(this.place.title, {
              updateOn: 'blur',
              validators: [Validators.required],
            }),
            description: new FormControl(this.place.description, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.maxLength(180)],
            }),
          });
        });
    });

    console.log(this.place.title);
  }

  onEditOffer() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({ message: 'Updating Place...' })
      .then((loadingEl) => {
        loadingEl.present();
        this.placeService
          .updatePlace(
            this.place.id,
            this.form.value.title,
            this.form.value.description
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['places/tabs/offers']);
          });
      });
  }
  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
