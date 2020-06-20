import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
  it('should be able to authenticate an user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashPovider = new FakeHashProvider();

    const createUser = new CreateUserService(fakeUsersRepository, fakeHashPovider);
    const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashPovider);

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
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashPovider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashPovider);

    expect(
      authenticateUser.execute({
        email: 'dalota@example.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to authenticate with wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashPovider = new FakeHashProvider();

    const createUser = new CreateUserService(fakeUsersRepository, fakeHashPovider);
    const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashPovider);

    await createUser.execute({
      name: 'Dalota Test',
      email: 'dalota@example.com',
      password: '123456',
    });

    expect(
      authenticateUser.execute({
        email: 'dalota@example.com',
        password: 'wrongPassword',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
})
