import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateTagDto {

    @ApiProperty()
    @IsNotEmpty({ message: 'Field $property cannot be empty.' })
    icon: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Field $property cannot be empty.' })
    title: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Field $property cannot be empty.' })
    type: string;

}
