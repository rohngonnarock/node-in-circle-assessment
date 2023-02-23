import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user/user.service';
import { User as UserModel } from '@prisma/client';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Post('getAllUsers')
  async getAllUsers() {
    return this.userService.users({ take: 10 });
  }

  @Post('getUserbyId/:id')
  async getUser(@Param('id') id: string): Promise<UserModel> {
    return this.userService.user({ id: Number(id) });
  }


  @Post('creatUser')
  async signupUser(
    @Body() userData: { firstName: string; lastName: string; email: string, hash: string },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Delete('deleteUser/:id')
  async deletePost(@Param('id') id: string): Promise<UserModel> {
    return this.userService.deleteUser({ id: Number(id) });
  }

  @Put('update/:id')
  async publishPost(@Param('id') id: string, @Body() userData: { firstName: string; lastName: string; }): Promise<UserModel> {
    return this.userService.updateUser({
      where: { id: Number(id) },
      data: { firstName: userData.firstName, lastName: userData.lastName },
    });
  }

  @Get('searchUser/:searchString')
  async getFilteredPosts(
    @Param('searchString') searchString: string,
  ): Promise<UserModel[]> {
    return this.userService.users({
      where: {
        OR: [
          {
            email: { contains: searchString },
          },
          {
            firstName: { contains: searchString },
          },
          {
            lastName: { contains: searchString },
          },
        ],
      },
    });
  }
}
