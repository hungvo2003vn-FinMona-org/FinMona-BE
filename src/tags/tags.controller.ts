import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagResponseDTO } from './dto/tag.response.dto';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'successful' })
  @ApiBadRequestResponse({ description: 'Error fetching tags' })
  @ApiBearerAuth('JWT-auth')
  findAllTags(): Promise<Array<TagResponseDTO>> {
    return this.tagsService.findAllTag();
  }

  @Get('/default')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'successful' })
  @ApiBadRequestResponse({ description: 'Error fetching tags' })
  @ApiBearerAuth('JWT-auth')
  getDefaultTags(): Promise<Array<TagResponseDTO>> {
    return this.tagsService.findDefaultTag();
  }

  @Get('/userTag/:id')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'successful' })
  @ApiBadRequestResponse({ description: 'Error fetching tags' })
  @ApiBearerAuth('JWT-auth')
  getUserTags(@Param('id') id: string): Promise<any> {
    return this.tagsService.findUserTag(id);
  }

  @Post('/userTag/:id')
  @UseGuards(AuthGuard())
  @ApiCreatedResponse({ description: 'Tag created successfully' })
  @ApiBadRequestResponse({ description: 'Error while creating new tag' })
  @ApiBearerAuth('JWT-auth')
  createDefaultTag(@Param('id') id: string, @Body() requestDTO: CreateTagDto): Promise<any> {
    return this.tagsService.addUserTag(id, requestDTO);
  }

  @Post('/createDefaultTag')
  @UseGuards(AuthGuard())
  @ApiCreatedResponse({ description: 'Tag created successfully' })
  @ApiBadRequestResponse({ description: 'Error while creating new tag' })
  @ApiBearerAuth('JWT-auth')
  addNewDefaultTag(@Body() requestDTO: CreateTagDto): Promise<any> {
    return this.tagsService.addDefaultTag(requestDTO);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  @ApiCreatedResponse({ description: 'Tag updated successfully' })
  @ApiBadRequestResponse({ description: 'Error updating Tag' })
  @ApiBearerAuth('JWT-auth')
  updateTag(@Param('id') id: string, @Body() requestDto: UpdateTagDto): Promise<any> {
    return this.tagsService.updateTagById(id, requestDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Tag deleted' })
  @ApiBadRequestResponse({ description: 'Error deleting tag' })
  @ApiBearerAuth('JWT-auth')
  deleteTag(@Param('id') id:string): Promise<any> {
    return this.tagsService.deleteTag(id);
  }
}
