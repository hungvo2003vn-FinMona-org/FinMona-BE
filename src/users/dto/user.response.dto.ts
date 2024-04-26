import { UserDocument } from "../entities/user.entity"

export default class UserResponseDTO {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public avatar?: string
    ) {}

    static from = ({
        _id,
        name,
        email,
        avatar,
    }: UserDocument): UserResponseDTO =>
        new UserResponseDTO(_id.toHexString(), name, email, avatar);
}