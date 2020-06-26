import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Dalota User Test',
      email: 'dalota@test.com',
      password: 'test123',
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('Dalota User Test');
    expect(profile.email).toBe('dalota@test.com');
  });

  it('should not be able to show the profile of unexisting user', async () => {
    await expect(
      showProfile.execute({
        user_id: 'any-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

});
