export class Place {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public imageUrl: string,
    public price: number,
    public avilableFrom: Date,
    public avilableTo: Date,
    public userId: string
  ) {}
}
