import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateRecordDto {

    @ApiProperty()
    @IsNotEmpty({ message: 'Field $property cannot be empty.'})
    isIncome: boolean;

    @ApiProperty()
    @IsNotEmpty({ message: 'Field $property cannot be empty.'})
    amount: number;

    @ApiProperty({ type: String })
    @IsNotEmpty({ message: 'Field $property cannot be empty.'})
    category: any;

    @ApiProperty({ type: String })
    @IsNotEmpty({ message: 'Field $property cannot be empty.'})
    moneySource: any;

    @ApiProperty({ required: false })
    @IsOptional()
    description: string;

}
