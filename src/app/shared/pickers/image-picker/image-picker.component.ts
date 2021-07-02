import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @Output() imagePick = new EventEmitter<string>();
  selectedImage: string;
  constructor(private alertCtrl: AlertController) {}

  ngOnInit() {}

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.showErrorAlert();
      return;
    }
     Camera.getPhoto({
      quality: 7,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 1280,
      width: 720,
      resultType: CameraResultType.DataUrl
    })
    .then(image => {
      this.selectedImage = image.dataUrl;
      this.imagePick.emit(image.dataUrl);
    })
    .catch(error => {
      console.log(error);
      return false;
    });
  }
  private showErrorAlert() {
    this.alertCtrl
      .create({
        header: 'Could not open Camera',
        message: 'Please wait a seconde',
        buttons: ['Okay']
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }
}
