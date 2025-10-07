import { Test, TestingModule } from '@nestjs/testing';
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
      signup: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User),
      signin: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User),
    };

    mockedUsersService = {
      findOne: (id: number) => Promise.resolve({ id: 1, email: 'email@test.com', password: '12345' } as User),
      find: (email: string) => Promise.resolve([{ id: 1, email: 'email@test.com', password: '12345' } as User]),
      remove: (id: number) => Promise.resolve({ id: 1, email: 'email@test.com', password: '12345' } as User),
      update: (id: number, attrs: Partial<User>) => Promise.resolve({ id: 1, email: 'email@test.com', password: '12345' } as User),
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
});
