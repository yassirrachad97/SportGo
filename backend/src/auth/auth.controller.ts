import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login-user.dto';


@Controller('auth')
export class AuthController {
constructor( private readonly authService: AuthService){}


@Post('/signup')
register(@Body() signUpDto: SignUpDto): Promise<{token: string}>{
    return this.authService.signUp(signUpDto);
} 

@Post('/login')

signin(@Body() loginDto: LoginDto): Promise<{ token: string}>{
    return this.authService.login(loginDto);
}

}
