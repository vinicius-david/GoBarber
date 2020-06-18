import { hash } from 'bcryptjs';
import { injectable, inject } from 'tsyringe';

import IUsersRepository from '../repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';

interface RequestDTO {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({ name, email, password }: RequestDTO): Promise<User> {

    const checkIfEmailExists = await this.usersRepository.findByEmail(email);

    if (checkIfEmailExists) {
      throw new AppError('This email is already being used.');
    };

    const hashedPassword = await hash(password, 8);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword
    });

    return user;
  }
}

export default CreateUserService;
