import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import authConfig from '@config/auth';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

interface RequestDTO {
  email: string;
  password: string;
}

interface ResponseDTO {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: RequestDTO): Promise<ResponseDTO> {

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('The email and password combination is wrong.');
    };

    const comparePassword = await this.hashProvider.compareHash(
      password, user.password
    );

    if (!comparePassword) {
      throw new AppError('The email and password combination is wrong.');
    };

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn
    })

    return { user, token };
  }
}

export default AuthenticateUserService;
