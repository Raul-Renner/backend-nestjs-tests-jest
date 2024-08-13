/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';

describe('BookController', () => {
  let authService: AuthService;
  let authController: AuthController;
  let model: Model<User>;

  const mockUser = {
    _id: '66b26998a897a815f16a6772',
    name: 'User mock',
    email: 'mockUser@gmail.com',
  };

  let jwtToken = "jwtToken";

  const mockAuthService = {
    signUp: jest.fn().mockResolvedValueOnce(jwtToken),
    login: jest.fn().mockResolvedValueOnce(jwtToken),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);
    //model = module.get<Model<Book>>(getModelToken(Book.name));
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signUp', () => {
    it('should register new user', async () => {
        const signUpDto = {
            name: 'User mock',
            email: 'mockUser@gmail.com',
            password: 'passwordMock'
          };
        
        const result = await authController.signUp(signUpDto);
        expect(authService.signUp).toHaveBeenCalled();
        expect(result).toEqual(jwtToken);
    });
  });

  describe('login', () => {
    it('should login user', async () => {
        const loginDto = {
            email: 'mockUser@gmail.com',
            password: 'passwordMock'
        };
        
        const result = await authController.login(loginDto);
        expect(authService.login).toHaveBeenCalled();
        expect(result).toEqual(jwtToken);
    });
  });

});
