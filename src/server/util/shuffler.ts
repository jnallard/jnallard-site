/**
 * Shuffles an array of cards
 * https://stackoverflow.com/a/12646864
 */
export class Shuffler {
    static shuffle(cards: any[]) {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }
}
