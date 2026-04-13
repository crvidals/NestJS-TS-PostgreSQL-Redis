import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    Req,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { AuthService } from './auth.service';
  import { AuthDto } from './dto/auth.dto';
  import { ApiTags, ApiOperation } from '@nestjs/swagger';

  @ApiTags('auth')
  @Controller('auth')


  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'Registrar usuario' })
    @Post('register')
    register(@Body() dto: AuthDto) {
      return this.authService.register(dto);
    }
    
    @ApiOperation({ summary: 'Login usuario' })
    @Post('login')
    login(@Body() dto: AuthDto) {
      return this.authService.login(dto);
    }
  
    // Endpoint protegido
    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getMe(@Req() req) {
      return req.user;
    }
  }