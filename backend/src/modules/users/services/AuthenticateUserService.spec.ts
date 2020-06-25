import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashPovider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashPovider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashPovider);
    authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashPovider);
  });

  it('should be able to authenticate an user', async () => {
    const user = await createUser.execute({
      name: 'Dalota Test',
      email: 'dalota@example.com',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'dalota@example.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate an unexisting user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'dalota@example.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await createUser.execute({
      name: 'Dalota Test',
      email: 'dalota@example.com',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: 'dalota@example.com',
        password: 'wrongPassword',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
})
