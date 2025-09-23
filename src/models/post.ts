import { makeAutoObservable } from "mobx";

export class Post
{
    public title: string = "";
    public content: string = "";
    public userName: string = "Username";

    // To be implemented. Take from swagger docs.
    constructor(){
        makeAutoObservable(this);
    }
}
