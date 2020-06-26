import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import ListProvidersService from '../services/ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'Dalota User Test',
      email: 'dalota@test.com',
      password: 'test123',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Dalota User 2',
      email: 'dalota2@test.com',
      password: 'test123',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'Dalota Logged User',
      email: 'dalota3@test.com',
      password: 'test123',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([
      user1,
      user2,
    ]);
  });

});
