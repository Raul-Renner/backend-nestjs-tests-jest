/* eslint-disable prettier/prettier */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { Model } from "mongoose";
import { AuthService } from "./auth.service";
import { User } from "./schemas/user.schema";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from "@nestjs/common";

describe('AuthService', () => {
    let authService: AuthService;
    let model: Model<User>;
    let jwtService: JwtService;
    let token = 'jwtToken';


      const mockUser = {
        _id: '66b26998a897a815f16a6772',
        name: 'User mock',
        email: 'mockUser@gmail.com',
      };
    
      const mockAuthService = {
        create: jest.fn(),
        findOne: jest.fn(),
      };
    
      beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [
            AuthService,
            JwtService,
            {
              provide: getModelToken(User.name),
              useValue: mockAuthService,
            },
          ],
        }).compile();
    
        authService = module.get<AuthService>(AuthService);
        model = module.get<Model<User>>(getModelToken(User.name));
        jwtService = module.get<JwtService>(JwtService);
      });

      it('should be defined', () => {
        expect(authService).toBeDefined();
      });

      describe('signUp', () => {

        const signUpDto = {
            name: 'User mock',
            email: 'mockUser@gmail.com',
            password: 'passwordMock'
          };

        it('should register the new user', async () => {
            jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
            jest.spyOn(model, 'create').mockImplementationOnce((): Promise<any> => Promise.resolve(mockUser));

            jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');
            const result = await authService.signUp(signUpDto);

            expect(bcrypt.hash).toHaveBeenCalled();
            expect(result).toEqual({ token });
        });

        it('should throw duplicate email in system', async () => {
            jest.spyOn(model, 'create').mockImplementationOnce((): Promise<any> => Promise.reject({ code: 11000 }));

            await expect(authService.signUp(signUpDto)).rejects.toThrow(
                ConflictException,
            );
        });

   
    })

    describe('login', () => {

        const loginDto = {
            email: 'mockUser@gmail.com',
            password: 'passwordMock'
          };

        it('should login user and return token', async () => {
            jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);
            
            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

            jest.spyOn(jwtService, 'sign').mockReturnValue(token);
            
            const result = await authService.login(loginDto);

            expect(bcrypt.compare).toHaveBeenCalled();
            expect(result).toEqual({ token });
        });

        it('should throw UnauthorizedException user with invalid email', async () => {
            jest.spyOn(model, 'findOne').mockResolvedValueOnce(null);

            await expect(authService.login(loginDto)).rejects.toThrow(
                UnauthorizedException,
            );
        });

        it('should throw UnauthorizedException user with invalid password error', async () => {
            jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);
            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

            await expect(authService.login(loginDto)).rejects.toThrow(
                UnauthorizedException,
            );
        });

   
    })

})
