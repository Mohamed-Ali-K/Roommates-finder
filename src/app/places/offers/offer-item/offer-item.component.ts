import { Component, Input, OnInit } from '@angular/core';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-offer-item',
  templateUrl: './offer-item.component.html',
  styleUrls: ['./offer-item.component.scss'],
})
export class OfferItemComponent implements OnInit {
  @Input() offer: Place ;
  constructor(private placesService: PlacesService) { }

  ngOnInit() {}
  getDummyDate() {
    return new Date();
  }
}
