import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Dalota User Test',
      email: 'dalota@test.com',
      password: 'test123',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Dalota Updated Test',
      email: 'updated@test.com',
    });

    expect(updatedUser.name).toBe('Dalota Updated Test');
    expect(updatedUser.email).toBe('updated@test.com');
  });

  it('should not be able to update the profile of unexisting user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'any-id',
        name: 'Dalota',
        email: 'dalota@example.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update to an used email', async () => {
    await fakeUsersRepository.create({
      name: 'Dalota User Test',
      email: 'dalota@test.com',
      password: 'test123',
    });

    const user = await fakeUsersRepository.create({
      name: 'Dalota User Test 2',
      email: 'test@test.com',
      password: 'test123',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Dalota Updated Test',
        email: 'dalota@test.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Dalota User Test',
      email: 'dalota@test.com',
      password: 'test123',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Dalota Updated Test',
      email: 'updated@test.com',
      old_password: 'test123',
      password: '123'
    });

    expect(updatedUser.password).toBe('123');
  });

  it('should not be able to update the password without password confirmation', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Dalota User Test',
      email: 'dalota@test.com',
      password: 'test123',
    });

    expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Dalota Updated Test',
        email: 'updated@test.com',
        password: '123'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong password confirmation', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Dalota User Test',
      email: 'dalota@test.com',
      password: 'test123',
    });

    expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Dalota Updated Test',
        email: 'updated@test.com',
        old_password: 'wrong-password',
        password: '123'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

});
