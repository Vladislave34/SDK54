import {IImageFile} from "@/model/common/IImageFile";

export  default interface IEditProfile {
    email: string;
    firstName: string;
    lastName: string;
    imageFile?: IImageFile | null;
}