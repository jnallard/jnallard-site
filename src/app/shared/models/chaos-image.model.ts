export class ChaosImage {
  public title: string;
  public description: string;
  public imageUrl: string;

  constructor(data: any) {
    this.title = data.title;
    this.description = data.description;
    this.imageUrl = data.imageUrl;
  }
}
