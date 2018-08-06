import { Component, OnInit } from '@angular/core';
import { ContentService } from '../shared/services/content.service';
import { ChaosImage } from '../shared/models/chaos-image.model';
import { ChaosEvent } from '../shared/models/chaos-event.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  images: ChaosImage[] = [];
  upcomingEvents: ChaosEvent[] = [];

  constructor(public content: ContentService) {
    this.images = content.getHomeImages();
    const events = content.getEvents().sort((a, b) => a.startDate < b.startDate ? -1 : 1).filter(x => !x.old);
    this.upcomingEvents = events.slice(0, Math.min(5, events.length));
  }

  ngOnInit() {
  }

}
