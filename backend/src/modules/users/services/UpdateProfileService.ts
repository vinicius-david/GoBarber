import { injectable, inject } from 'tsyringe';

import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';

interface RequestDTO {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ user_id, name, email, password, old_password }: RequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('User not found.');

    const checkUserEmail = await this.usersRepository.findByEmail(email);

    if (checkUserEmail && checkUserEmail.id !== user_id) {
      throw new AppError('Email already in use.')
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new AppError('Inform old password to change your password.');
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!checkOldPassword) throw new AppError('Wrong password.');

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
};

export default UpdateProfileService;
