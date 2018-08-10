export class StoredData {
  constructor (private dataName: string) {}

  private getData() {
    const data = localStorage.getItem(this.dataName);
    return data ? JSON.parse(atob(data)) : {};
  }

  private setData(data: any) {
    localStorage.setItem(this.dataName, btoa(JSON.stringify(data)));
  }

  public get(field: string) {
    const data = this.getData();
    return data[field];
  }

  public set(field: string, value: any) {
    const data = this.getData();
    data[field] = value;
    this.setData(data);
  }
}
