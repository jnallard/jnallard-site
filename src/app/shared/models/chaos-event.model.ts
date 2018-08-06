export class ChaosEvent {
  public name: string;
  public description: string;
  public startDate: Date;
  public endDate: Date;
  public linkUrl: string;
  public imageUrl: string;
  public old: boolean;

  constructor(data: any) {
    this.name = data.name;
    this.description = data.description;
    this.startDate = new Date(data.startDate);
    this.endDate = this.startDate;
    if (data.endDate) {
      this.endDate = new Date(data.endDate);
    }
    this.linkUrl = data.linkUrl;
    this.imageUrl = data.imageUrl;

    this.old = this.endDate < new Date();
  }

  public getDateString() {
    const start = this.startDate.toLocaleDateString('en-US');
    const end = this.endDate.toLocaleDateString('en-US');
    if (start !== end) {
      return `${start} - ${end}`;
    }
    return start;
  }
}
