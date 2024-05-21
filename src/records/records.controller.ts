import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import RecordResponseDTO from './dto/record.response.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Records')
@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  /*@Post()
  create(@Body() createRecordDto: CreateRecordDto) {
    return this.recordsService.addNewRecord(createRecordDto);
  }*/


  @Post(':id/createRecord')
  @UseGuards(AuthGuard())
  @ApiCreatedResponse({ description: 'Record created successfully' })
  @ApiBadRequestResponse({ description: 'Error while creating record' })
  createNewRecord(@Param('id') id:string, @Body() createRecordDto: CreateRecordDto): Promise<any> {
    return this.recordsService.addNewRecordWithUserInfo(id, createRecordDto);
  }

  @Get()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'successful' })
  @ApiBadRequestResponse({ description: 'Error fetching records' })
  findAllRecords(): Promise<Array<RecordResponseDTO>> {
    return this.recordsService.findAllRecord();
  }

  @Get(':id/getRecord')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'successful' })
  @ApiBadRequestResponse({ description: 'Error fetching record' })
  findAllRecordsByUserId(@Param('id') id: string): Promise<Array<RecordResponseDTO>> {
    return this.recordsService.findAllRecordByUserId(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  @ApiCreatedResponse({ description: 'Record updated successfully' })
  @ApiBadRequestResponse({ description: 'Error updating record' })
  updateRecordById(@Param('id') id: string, @Body() requestDto: UpdateRecordDto): Promise<any> {
    return this.recordsService.updateRecord(id, requestDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Record deleted' })
  @ApiBadRequestResponse({ description: 'Error deleting record' })
  deleteTag(@Param('id') id:string): Promise<any> {
    return this.recordsService.deleteRecord(id);
  }

}
