import { from, forkJoin, of, interval } from 'rxjs';
import { map, tap, flatMap } from 'rxjs/operators';
import { CardCastDeck } from './dtos/card-cast-deck';
import { Card } from './dtos/card';
import { JWT } from 'google-auth-library';
import { google } from 'googleapis';
import { EnvironmentService } from '../../util/environment-service';

class AuthWrapper {
  auth = new JWT({
    email: EnvironmentService.googleEmail,
    key: EnvironmentService.googleAuthKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  private authorized = false;
  authorize() {
    return this.authorized
      ? of(this.auth)
      : from(this.auth.authorize()).pipe(map(() => this.auth), tap(() => this.authorized = true));
  }
}

export class CardService {
  private readonly spreadSheetId = '1qaA5tfu6Y4R6UEuyYOkaA3YdzvttjnW9GLVn1bjGZIo';
  private readonly sheetsApi = google.sheets({ version: 'v4' });
  private readonly authWrapper = new AuthWrapper();

  constructor() {
    interval(60000).subscribe(() => {
      this.loadDecks();
    });
  }

  decks: Map<string, CardCastDeck> = new Map();

  public getDeck(id: string) {
    return this.decks.get(id);
  }

  public loadDecks() {
    return this.authWrapper.authorize().pipe(flatMap(auth => {
      return from(this.sheetsApi.spreadsheets.get({
        auth: auth,
        spreadsheetId: this.spreadSheetId,
      }));
    }),
    flatMap(response => {
      const sheets = response.data.sheets.map(sheet => sheet.properties.title);
      console.log(sheets);
      return forkJoin(sheets.map(sheet => this.loadDeck(sheet)));
    }),
    map(() => [...this.decks.values()]));
  }

  private loadDeck(deckName: string) {
    return this.authWrapper.authorize().pipe(flatMap(auth => {
      return from(this.sheetsApi.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: this.spreadSheetId,
        range: `${deckName}!A:B`,
        valueRenderOption: 'UNFORMATTED_VALUE',
      }));
    }),
    tap(response => {
      console.log(response.data.values);
      const whiteCards = [] as Card[];
      const blackCards = [] as Card[];
      response.data.values.forEach((row, index) => {
        const blackCardText = row[0];
        if (blackCardText) {
          blackCards.push(new Card(blackCardText.toString(), `${deckName}-black-${index}`));
        }
        const whiteCardText = row[1];
        if (whiteCardText) {
          whiteCards.push(new Card(whiteCardText.toString(), `${deckName}-white-${index}`));
        }
      });
      const newDeck = new CardCastDeck(deckName, deckName, blackCards, whiteCards);
      this.decks.set(deckName, newDeck);
    }));
  }
}
