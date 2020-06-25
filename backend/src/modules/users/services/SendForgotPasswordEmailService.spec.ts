import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotEmailPassword: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeMailProvider = new FakeMailProvider();

    sendForgotEmailPassword = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository
    );
  });

  it('should be able to recover password with email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'Dalota Test',
      email: 'dalota@test.com',
      password: '123456',
    });

    await sendForgotEmailPassword.execute({
      email: 'dalota@test.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover of an unexisting user', async () => {
    await expect(
      sendForgotEmailPassword.execute({
        email: 'dalota@test.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to recover password with email', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Dalota Test',
      email: 'dalota@test.com',
      password: '123456',
    });

    await sendForgotEmailPassword.execute({
      email: 'dalota@test.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
