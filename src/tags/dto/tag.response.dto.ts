import { title } from "process";
import { TagDocument } from "../entities/tag.entity";

export class TagResponseDTO {
    constructor(
        public id: string,
        public icon: string,
        public title: string,
        public type: string
    ) {}

    static from = ({
        _id,
        icon,
        title,
        type
    }: TagDocument): TagResponseDTO =>
        new TagResponseDTO(_id.toHexString(), icon, title, type);
}