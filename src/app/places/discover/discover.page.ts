import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  lisedLoadedPlaces: Place[];
  private placeSub: Subscription;
  constructor(
    private placesService: PlacesService,
    private menuCtrl: MenuController
  ) {}

  ngOnInit() {
    this.placeSub = this.placesService.places.subscribe((places) => {
      this.loadedPlaces = places;
      this.lisedLoadedPlaces = this.loadedPlaces.slice(1);
    });
  }
  onOpenMenu() {
    this.menuCtrl.toggle();
  }
  onFilterUpadate(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log(event.detail);
  }
  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
