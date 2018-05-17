export class Club {
    name: string;
    country: string;
    imageName: string;
    fans?: any[];
    id?: string;
    constructor(receivedObj: any) {
        this.name = receivedObj['name'];
        this.country = receivedObj['country'];
        this.imageName = receivedObj['image'];
        this.id = receivedObj['_id'];
        this.fans = receivedObj['fans'];
    }
}