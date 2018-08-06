import { Component, OnInit } from '@angular/core';
import { ContentService } from '../shared/services/content.service';
import { ChaosEvent } from '../shared/models/chaos-event.model';

@Component({
  selector: 'app-news-and-events',
  templateUrl: './news-and-events.component.html',
  styleUrls: ['./news-and-events.component.css']
})
export class NewsAndEventsComponent implements OnInit {

  public events: ChaosEvent[] = [];
  public upcomingEvents: ChaosEvent[] = [];
  public pastEvents: ChaosEvent[] = [];

  constructor(private contentService: ContentService) {
    this.events = this.contentService.getEvents();
    this.upcomingEvents = this.events.filter(x => !x.old).sort((a, b) => a.startDate < b.startDate ? -1 : 1);
    this.pastEvents = this.events.filter(x => x.old).sort((a, b) => a.startDate < b.startDate ? 1 : -1);
   }

  ngOnInit() {
  }

}
