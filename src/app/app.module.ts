import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { GamesComponent } from './games/games.component';
import { MinesweeperComponent } from './games/minesweeper/minesweeper.component';
import { PressDirective } from './shared/directives/press.directive';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const socketConfig: SocketIoConfig = { url: `${window.location.origin}`, options: {} };

const appRoutes: Routes = [
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: 'games', component: GamesComponent, pathMatch: 'full' },
  { path: 'games/minesweeper', component: MinesweeperComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent }
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
    GamesComponent,
    MinesweeperComponent,
    PressDirective
  ],
  imports: [
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      // { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    SocketIoModule.forRoot(socketConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
