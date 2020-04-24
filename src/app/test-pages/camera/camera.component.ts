import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit {

  constructor() { }

  error: any;
  devices: MediaDeviceInfo[];

  ngOnInit() {
    const video = document.querySelector('#videoElement') as HTMLVideoElement;

    if (navigator.mediaDevices.getUserMedia) {
      from(navigator.mediaDevices.getUserMedia({ video: true })).subscribe(stream => {
        console.log(stream);
        video.srcObject = stream;
      }, error => {
        this.error = error;
        console.error('Something went wrong!', error);
      });

      from(navigator.mediaDevices.enumerateDevices()).subscribe(result => {
        console.log(result);
        this.devices = result;
      }, error => {
        this.error = error;
        console.error('Something went wrong!', error);
      });
    }
  }

}
