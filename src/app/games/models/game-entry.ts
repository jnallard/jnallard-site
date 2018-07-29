export class GameEntry {
  public constructor(
    public name: string,
    public path: string,
    public description: string,
    public imagePath: string,
    public componentName: any
  ) {
    this.path = `games/${path}`;
    this.imagePath = `/assets/images/games/${imagePath}`;
  }
}
