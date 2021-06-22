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
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}
  onBookPlace() {
    this.modalCtrl.dismiss({message: 'this is on book '}, 'confirm');
  }
  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
