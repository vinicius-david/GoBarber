import { injectable, inject } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUsersTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface RequestDTO {
  password: string;
  token: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ password, token }: RequestDTO): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) throw new AppError('Invalid token.');

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) throw new AppError('This user does not exists.');

    const timeToCompare = addHours(userToken.created_at, 2);

    if (isAfter(Date.now(), timeToCompare)) throw new AppError('Token expired.');

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
