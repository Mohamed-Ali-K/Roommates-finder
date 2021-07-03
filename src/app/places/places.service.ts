/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { PlaceLocation } from './loaction.model';

// Damy places
// new Place(
//   'p1',
//   'Manhattan Mansion',
//   'In the heart of New York City.',
//   'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
//   149.99,
//   new Date('2021-01-01'),
//   new Date('2021-12-31'),
//   'abc'
// ),
// new Place(
//   'p2',
//   "L'Amour Toujours",
//   'A romantic place in Paris!',
//   'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Paris_Night.jpg/1024px-Paris_Night.jpg',
//   189.99,
//   new Date('2021-01-01'),
//   new Date('2021-12-31'),
//   'abc'
// ),
// new Place(
//   'p3',
//   'The Foggy Palace',
//   'Not your average city trip!',
//   'https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg',
//   99.99,
//   new Date('2021-01-01'),
//   new Date('2021-12-31'),
//   'abc'
// ),

interface PlaceData {
  avilableFrom: string;
  avilableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
  location: PlaceLocation;
}

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);
  get places() {
    return this._places.asObservable();
  }
  constructor(private authService: AuthService, private http: HttpClient) {}
  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>(
        'https://roommatefinder-23af6-default-rtdb.europe-west1.firebasedatabase.app/offerd-places.json'
      )
      .pipe(
        map((resData) => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  new Date(resData[key].avilableFrom),
                  new Date(resData[key].avilableTo),
                  resData[key].userId,
                  resData[key].location
                )
              );
            }
          }
          return places;
        }),
        tap((places) => {
          this._places.next(places);
        })
      );
  }

  getPlace(id: string) {
    return this.http
      .get<PlaceData>(
        `https://roommatefinder-23af6-default-rtdb.europe-west1.firebasedatabase.app/offerd-places/${id}.json`
      )
      .pipe(
        map(
          (placeData) =>
            new Place(
              id,
              placeData.title,
              placeData.description,
              placeData.imageUrl,
              placeData.price,
              new Date(placeData.avilableFrom),
              new Date(placeData.avilableTo),
              placeData.userId,
              placeData.location
            )
        )
      );
  }
  addPlace(
    title: string,
    description: string,
    price: number,
    fromDate: Date,
    toDate: Date,
    location: PlaceLocation,
    imageUrl: string
  ) {
    let genratedId: string;
    let newPlace: Place;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('No user Found!');
        }
        newPlace = new Place(
          Math.random().toString(),
          title,
          description,
          imageUrl,
          price,
          fromDate,
          toDate,
          userId,
          location
        );
        return this.http.post<{ name: string }>(
          'https://roommatefinder-23af6-default-rtdb.europe-west1.firebasedatabase.app/offerd-places.json',
          { ...newPlace, id: null }
        );
      }),
      switchMap((resData) => {
        genratedId = resData.name;
        return this.places;
      }),
      take(1),
      tap((places) => {
        newPlace.id = genratedId;
        this._places.next(places.concat(newPlace));
      })
    );
  }
  updatePlace(placeId: string, title: string, description: string) {
    let updatesplaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap((places) => {
        if (!places || places.length < 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap((places) => {
        const updatePlaceIndex = places.findIndex((pl) => pl.id === placeId);
        updatesplaces = [...places];
        const oldPlace = updatesplaces[updatePlaceIndex];
        updatesplaces[updatePlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.avilableFrom,
          oldPlace.avilableTo,
          oldPlace.userId,
          oldPlace.location
        );
        return this.http.put(
          `https://roommatefinder-23af6-default-rtdb.europe-west1.firebasedatabase.app/offerd-places/${placeId}.json`,
          { ...updatesplaces[updatePlaceIndex], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatesplaces);
      })
    );
  }
  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);
    return this.http.post<{ imageUrl: string; imagePath: string }>(
      'https://us-central1-roommatefinder-23af6.cloudfunctions.net/storeImage',
      uploadData
    );
  }
}
