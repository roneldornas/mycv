import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let mockedAuthService: Partial<AuthService>;
  let mockedUsersService: Partial<UsersService>;

  beforeEach(async () => {
    mockedAuthService = {
      signup: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
      signin: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    mockedUsersService = {
      findOne: (id: number) =>
        Promise.resolve({
          id: 1,
          email: 'email@test.com',
          password: '12345',
        } as User),
      find: (email: string) =>
        Promise.resolve([
          { id: 1, email: 'email@test.com', password: '12345' } as User,
        ]),
      remove: (id: number) =>
        Promise.resolve({
          id: 1,
          email: 'email@test.com',
          password: '12345',
        } as User),
      update: (id: number, attrs: Partial<User>) =>
        Promise.resolve({
          id: 1,
          email: 'email@test.com',
          password: '12345',
        } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AuthService,
          useValue: mockedAuthService,
        },

        {
          provide: UsersService,
          useValue: mockedUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('email@test.com');

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('email@test.com');
  });

  it('should findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');

    expect(user).toBeDefined();
  });

  it('should findUser throws an error if user with given id is not found', async () => {
    mockedUsersService.findOne = () => null;

    await expect(controller.findUser('2')).rejects.toThrow(NotFoundException);
  });

  it('should signin updates session object and returns user', async () => {
    const session = { userId: null };
    const user = await controller.signin(
      { email: 'email@test.com', password: '12345' },
      session,
    );

    expect(session.userId).toEqual(1);
    expect(user.id).toEqual(1);
  });

  it('should signout updates session object and returns user', async () => {
    const session = { userId: 1 };
    controller.signout(session);

    expect(session.userId).toEqual(null);
  });
});
