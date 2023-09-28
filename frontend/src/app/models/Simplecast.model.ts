export class Simplecast {
    title?: string;
    status?: string;
    image_url?: string;
    id?: string;
    episodes?: Episodes;
}
export class Episodes {
    count?: number;
}

export class Data{
    name?: Simplecast["title"];
    status?: Simplecast["status"];
    awCollectionId?:Simplecast["id"];
    showCount?:Simplecast["episodes"];
}