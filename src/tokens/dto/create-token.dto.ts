import { UserDocument } from "src/users/entities/user.entity";

export class CreateTokenDto {
    token: string;
    expiredAt: Date;
    user: UserDocument;
}
