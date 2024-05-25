import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Query } from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import RecordResponseDTO from './dto/record.response.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiBearerAuth('JWT-auth')
  createNewRecord(@Param('id') id:string, @Body() createRecordDto: CreateRecordDto): Promise<any> {
    return this.recordsService.addNewRecordWithUserInfo(id, createRecordDto);
  }

  @Get()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'successful' })
  @ApiBadRequestResponse({ description: 'Error fetching records' })
  @ApiBearerAuth('JWT-auth')
  findAllRecords(): Promise<Array<RecordResponseDTO>> {
    return this.recordsService.findAllRecord();
  }

  @Get(':id/getRecord')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'successful' })
  @ApiBadRequestResponse({ description: 'Error fetching record' })
  @ApiBearerAuth('JWT-auth')
  findAllRecordsByUserId(@Param('id') id: string): Promise<Array<RecordResponseDTO>> {
    return this.recordsService.findAllRecordByUserId(id);
  }

  @Get(':id/getRecordByDate')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'successful' })
  @ApiBadRequestResponse({ description: 'Error fetching record' })
  @ApiBearerAuth('JWT-auth')
  findRecordByDate(@Param('id') id: string, @Query('startDate') startDate: string, @Query('endDate') endDate: string): Promise<Array<RecordResponseDTO>> {
    return this.recordsService.filterRecordsByTime(id, startDate, endDate);
  }

  @Get(':id/getRecordByCategory')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'successful' })
  @ApiBadRequestResponse({ description: 'Error fetching record' })
  @ApiBearerAuth('JWT-auth')
  findRecordByCategory(@Param('id') id: string, @Query('categoryName') categoryName: string): Promise<Array<RecordResponseDTO>> {
    console.log(categoryName);
    return this.recordsService.filterRecordsByCategory(id, categoryName);
  }

  @Get(':id/getRecordByMoneySource')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'successful' })
  @ApiBadRequestResponse({ description: 'Error fetching record' })
  @ApiBearerAuth('JWT-auth')
  findRecordByMoneySource(@Param('id') id: string, @Query('moneySourceName') moneySourceName: string): Promise<Array<RecordResponseDTO>> {
    console.log(moneySourceName);
    return this.recordsService.filterRecordsByMoneySource(id, moneySourceName);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  @ApiCreatedResponse({ description: 'Record updated successfully' })
  @ApiBadRequestResponse({ description: 'Error updating record' })
  @ApiBearerAuth('JWT-auth')
  updateRecordById(@Param('id') id: string, @Body() requestDto: UpdateRecordDto): Promise<any> {
    return this.recordsService.updateRecord(id, requestDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Record deleted' })
  @ApiBadRequestResponse({ description: 'Error deleting record' })
  @ApiBearerAuth('JWT-auth')
  deleteTag(@Param('id') id:string): Promise<any> {
    return this.recordsService.deleteRecord(id);
  }

}
