import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Field $property cannot be empty.' })
    name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Field $property cannot be empty.' })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Field $property cannot be empty.' })
    password: string;

    @ApiProperty({ required: false })
    @IsOptional()
    avatar: string;
}
