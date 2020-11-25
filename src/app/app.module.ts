import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthModule } from '@auth0/auth0-angular';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { AppComponent } from './app.component';
import { CardsComponent } from './games/cards/cards.component';
import { CreateGameComponent } from './games/cards/create-game/create-game.component';
import { PickUsernameComponent } from './games/cards/pick-username/pick-username.component';
import { GamesComponent } from './games/games.component';
import { MinesweeperComponent } from './games/minesweeper/minesweeper.component';
import { RpgComponent } from './games/rpg/rpg.component';
import { HomeComponent } from './home/home.component';
import { ConfirmationModalComponent } from './shared/components/confirmation-modal/confirmation-modal.component';
import { PressDirective } from './shared/directives/press.directive';
import { CameraComponent } from './test-pages/camera/camera.component';
import { AuthButtonComponent } from './auth/auth-button/auth-button.component';

const socketConfig: SocketIoConfig = { url: window.location.origin, options: {} };

const appRoutes: Routes = [
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: 'games', pathMatch: 'full', redirectTo: '/games/all' },
  { path: 'games/all', component: GamesComponent, pathMatch: 'full' },
  { path: 'games/minesweeper', component: MinesweeperComponent, pathMatch: 'full' },
  { path: 'games/cards', component: CardsComponent, pathMatch: 'full' },
  { path: 'games/rpg', component: RpgComponent, pathMatch: 'full' },
  { path: 'test-pages/camera', component: CameraComponent, pathMatch: 'full' },
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
    PressDirective,
    CameraComponent,
    CardsComponent,
    CreateGameComponent,
    PickUsernameComponent,
    ConfirmationModalComponent,
    RpgComponent,
    AuthButtonComponent
  ],
  imports: [
    AuthModule.forRoot({
      domain: 'joallard.auth0.com',
      clientId: 'YVEiFzpvvn67oh933D0bNNydND2uRHWY',
      cacheLocation: 'localstorage'
    }),
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      // { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    CarouselModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    SocketIoModule.forRoot(socketConfig),
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
