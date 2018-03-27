import { JsonController, Post, Param, Get, Body, Authorized, HttpCode } from 'routing-controllers'
import User from './entity';

@JsonController()
export default class UserController {

  @Post('/users')
    @HttpCode(201)
    async signup(
      @Body() user: User
    ) {
      const {password, ...rest} = user
      const entity = User.create(rest)
      await entity.setPassword(password)
      return entity.save()
    }

  // @Authorized()
  @Get('/users/:id([0-9]+)')
  getUser(
    @Param('id') id: number,
    // @Param('role') role: string
  ) {
    return User.findOneById(id)
  }

  // @Authorized()
  @Get('/users')
  allUsers() {
    return User.find()
  }
}
