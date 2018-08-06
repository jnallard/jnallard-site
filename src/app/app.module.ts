import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CarouselModule } from 'ngx-bootstrap/carousel';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { HistoryComponent } from './history/history.component';
import { FirstComponent } from './first/first.component';
import { NewsAndEventsComponent } from './news-and-events/news-and-events.component';
import { SupportAndSponsorsComponent } from './support-and-sponsors/support-and-sponsors.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'first', component: FirstComponent },
  { path: 'news-and-events', component: NewsAndEventsComponent },
  { path: 'support-and-sponsors', component: SupportAndSponsorsComponent },
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

/* TODO: Routes aren't being added when deploying to the site. Something must be lost in the build process. For now, manually adding them
GameList.instance.games.forEach(game => {
  appRoutes.push({path: `${game.path}`, component: game.componentName, pathMatch: 'full'});
});
console.log(appRoutes);
*/

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    HistoryComponent,
    FirstComponent,
    NewsAndEventsComponent,
    SupportAndSponsorsComponent
  ],
  imports: [
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      // { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    BsDropdownModule.forRoot(),
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
