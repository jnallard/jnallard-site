import { Injectable } from '@angular/core';
import * as eventData from '../content/events.json';
import * as homeImageData from '../content/home-images.json';
import { ChaosEvent } from '../models/chaos-event.model';
import { ChaosImage } from '../models/chaos-image.model';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  public events: ChaosEvent[];
  public homeImages: ChaosImage[];

  constructor() {
    this.events = eventData.default.map(x => new ChaosEvent(x));
    this.homeImages = homeImageData.default.map(x => new ChaosImage(x));
  }

  public getEvents() {
    return this.events;
  }

  public getHomeImages() {
    return this.homeImages;
  }
}
