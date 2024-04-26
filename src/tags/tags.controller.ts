import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagResponseDTO } from './dto/tag.response.dto';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @ApiOkResponse({ description: 'successful' })
  @ApiBadRequestResponse({ description: 'Error fetching tags' })
  findAllTags(): Promise<Array<TagResponseDTO>> {
    return this.tagsService.findAllTag();
  }

  @Post()
  @ApiCreatedResponse({ description: 'Tag created successfully' })
  @ApiBadRequestResponse({ description: 'Error while creating new tag' })
  addNewTag(@Body() requestDTO: CreateTagDto): Promise<any> {
    return this.tagsService.addTag(requestDTO);
  }

  @Put(':id')
  @ApiCreatedResponse({ description: 'Tag updated successfully' })
  @ApiBadRequestResponse({ description: 'Error updating Tag' })
  updateTag(@Param('id') id: string, @Body() requestDto: UpdateTagDto): Promise<any> {
    return this.tagsService.updateTagById(id, requestDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Tag deleted' })
  @ApiBadRequestResponse({ description: 'Error deleting tag' })
  deleteTag(@Param('id') id:string): Promise<any> {
    return this.tagsService.deleteTag(id);
  }
}
