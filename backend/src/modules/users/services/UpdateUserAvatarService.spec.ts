import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);
  });

  it('should be able to update users avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Dalota Test',
      email: 'dalota@example.com',
      password: '123456',
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'filename.png',
    });

    expect(user.avatar).toBe('filename.png');
  });

  it('should not be able to update non existing users avatar', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'testId',
        avatarFilename: 'filename.png',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete old users avatar', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'Dalota Test',
      email: 'dalota@example.com',
      password: '123456',
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'filename.png',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'filename2.png',
    });

    expect(deleteFile).toBeCalledWith('filename.png');
    expect(user.avatar).toBe('filename2.png');
  });
});
