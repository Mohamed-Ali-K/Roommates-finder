import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Place } from 'src/app/places/place.model';

@Component({
  selector: 'app-creat-booking',
  templateUrl: './creat-booking.component.html',
  styleUrls: ['./creat-booking.component.scss'],
})
export class CreatBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMod: 'select' | 'randome';
  startDate: string;
  endDate: string;
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    const avilableFrom = new Date(this.selectedPlace.avilableFrom);
    const avilableTo = new Date(this.selectedPlace.avilableTo);
    if (this.selectedMod === 'randome') {
      this.startDate = new Date(
        avilableFrom.getTime() +
          Math.random() *
            (avilableTo.getTime() -
              7 * 24 * 60 * 60 * 1000 -
              avilableFrom.getTime())
      ).toISOString();

      this.endDate = new Date(
        new Date(this.startDate).getTime() +
          Math.random() *
            (new Date(this.startDate).getTime() +
              6 * 24 * 60 * 60 * 1000 -
              new Date(this.startDate).getTime())
      ).toISOString();
    }
  }
  onBookPlace() {
    this.modalCtrl.dismiss({ message: 'this is on book ' }, 'confirm');
  }
  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
