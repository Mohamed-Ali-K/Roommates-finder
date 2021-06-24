import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  @ViewChild('f', { static: true }) form: NgForm;
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
    if (!this.form.value || !this.datesValid()) {
      return;
    }
    this.modalCtrl.dismiss(
      {
        bookingData: {
          fristName: this.form.value['frist-name'],
          lastName: this.form.value['last-name'],
          guestNumber: this.form.value['guest-number'],
          fromDate: this.form.value['date-from'],
          toDate: this.form.value['date-to'],
        },
      },
      'confirm'
    );
  }
  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
  datesValid() {
    const startDate = new Date(this.form.value['date-from']);
    const endDate = new Date(this.form.value['date-to']);
    return endDate > startDate;
  }
}
