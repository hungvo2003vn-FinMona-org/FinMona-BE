import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginUserDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Field cannot be empty.' })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Field cannot be empty'})
    password: string;
}