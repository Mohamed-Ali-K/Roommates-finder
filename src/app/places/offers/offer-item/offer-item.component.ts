import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-offer-item',
  templateUrl: './offer-item.component.html',
  styleUrls: ['./offer-item.component.scss'],
})
export class OfferItemComponent implements OnInit, OnDestroy {
  @Input() offer: Place;
  private placesSub: Subscription;
  constructor(private placesService: PlacesService) {}

  ngOnInit() {}
  getDummyDate() {
    return new Date();
  }
  ngOnDestroy() {}
}
