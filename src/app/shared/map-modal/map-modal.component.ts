import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit {
  @ViewChild('map') mapElementRef: ElementRef;
  constructor(
    private modalCtrl: ModalController,
    private renderer: Renderer2
  ) {}

  ngOnInit() {}
  ngAfterViewInit() {
    this.getGoogleMap()
      .then((googleMaps) => {
        const mapEl = this.mapElementRef.nativeElement;
        const map = new googleMaps.Map(mapEl, {
          center: { lat: 33.512, lng: 11.0322 },
          zoom: 16,
        });

        googleMaps.event.addListenerOnce(map, 'idel', () => {
          this.renderer.addClass(mapEl, 'visible');
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  onCancel() {
    this.modalCtrl.dismiss();
  }
  private getGoogleMap(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyAIoefFgnmDyUG9JiicAbt36ABq4Upvi1c';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google Maps SDK not available.');
        }
      };
    });
  }
}
