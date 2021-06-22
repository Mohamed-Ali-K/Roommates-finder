import { Component, Input, OnInit } from '@angular/core';
import { Place } from 'src/app/places/place.model';

@Component({
  selector: 'app-creat-booking',
  templateUrl: './creat-booking.component.html',
  styleUrls: ['./creat-booking.component.scss'],
})
export class CreatBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  constructor() { }

  ngOnInit() {}

}
