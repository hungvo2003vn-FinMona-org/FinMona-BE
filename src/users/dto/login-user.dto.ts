import { IsNotEmpty } from "class-validator";

export class LoginUserDto {
    @IsNotEmpty({ message: 'Field cannot be empty.' })
    email: string;

    @IsNotEmpty({ message: 'Field cannot be empty'})
    password: string;
}