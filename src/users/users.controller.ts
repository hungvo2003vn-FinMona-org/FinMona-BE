import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import UserResponseDTO from './dto/user.response.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiTags, ApiBadRequestResponse, ApiHeader } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @Get()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'successful' })
  @ApiBadRequestResponse({ description: 'Error fetching users' })
  findAllUser(): Promise<Array<UserResponseDTO>> {
    return this.usersService.findAllUsers();
  }

  @Get('/login')
  login(@Body() requestDto: LoginUserDto): Promise<{ token: string }> {
    return this.usersService.signIn(requestDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'successful' })
  @ApiBadRequestResponse({ description: 'Error fetching user' })
  getUserById(@Param('id') id: string): Promise<UserResponseDTO> {
    return this.usersService.findUserById(id);
  }

  @Post()
  @ApiCreatedResponse({ description: 'User created successfully' })
  @ApiBadRequestResponse({ description: 'Error while creating new user' })
  addNewUser(@Body() requestDTO: CreateUserDto): Promise<any> {
    return this.usersService.addUser(requestDTO);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  @ApiCreatedResponse({ description: 'User updated successfully' })
  @ApiBadRequestResponse({ description: 'Error updating user' })
  updateUser(@Param('id') id: string, @Body() requestDTO: UpdateUserDto): Promise<any> {
    return this.usersService.updateUserById(id, requestDTO);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'User deleted' })
  @ApiBadRequestResponse({ description: 'Error deleting user' })
  deleteUser(@Param('id') id:string): Promise<any> {
    return this.usersService.deleteUser(id);
  }
}
