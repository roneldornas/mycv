import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let mockedUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    mockedUsersService = {
      find: (email: string) => Promise.resolve(users.filter((user) => user.email === email)),
      create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 999999), email, password } as User;

        users.push(user);

        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockedUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('should create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('should creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('bao@a.com', '12345');
    const [salt, hash] = user.password.split('.');

    expect(user.password).not.toEqual('12345');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('should throw an error if user signs up with email that is in use', async () => {
    await service.signup('asdf@asdf.com', 'asdf');
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw an error if signin is called with an unused email', async () => {
    await service.signup('asdsf@asdf.com', 'asdf');
    await expect(service.signin('asdf@asdf.com', 'asdf')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw an error if an invalid password is provided', async () => {
    await service.signup('asdf@asdf.com', 'asdf');
    await expect(
      service.signin('asdf@asdf.com', 'passowrd'),
    ).rejects.toThrow(BadRequestException);
  });

    it('should return a user if correct password is provided', async () => {
      await service.signup('asdf@asdf.com', 'laskdjf');
      const user = await service.signin('asdf@asdf.com', 'laskdjf');

      expect(user).toBeDefined();
    });
});
