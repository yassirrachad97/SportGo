import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login-user.dto';
import { use } from 'passport';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService
  ){}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string}>{

    try{
        const {username, email, password} = signUpDto;
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
          throw new Error('User with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 8);
        const user = await this.userModel.create({
            username,
            email,
            password: hashedPassword
        });
        const token = this.jwtService.sign({ id: user._id }  ) ;
        return {token}
    }catch (error){
        throw new Error(`Error signing up: ${error.message}`);

    } 
  }

  async login(loginDto: LoginDto): Promise<{ token: string}>{
  
        const { email, password} = loginDto;
        const user = await this.userModel.findOne({email});
        if(!user){
            throw new UnauthorizedException('Invalide cordonnées!')
        }

        const isMatchedPassword =await bcrypt.compare(password, user.password);
        if(!isMatchedPassword){
            throw new UnauthorizedException('invalide password!')
        }
        const token = this.jwtService.sign({ id: user._id } ) ;
        return {token}
  
  }
}
