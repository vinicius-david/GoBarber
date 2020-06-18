import path from 'path';
import fs from 'fs';
import { injectable, inject } from 'tsyringe';

import IUsersRepository from '../repositories/IUsersRepository';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';

interface RequestDTO {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({ user_id, avatarFilename }: RequestDTO): Promise<User> {

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User is not authenticated.', 401);
    };

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const checkAvatarExists = await fs.promises.stat(userAvatarFilePath);

      if (checkAvatarExists) {
        await fs.promises.unlink(userAvatarFilePath)
      };
    };

    user.avatar = avatarFilename;

    await this.usersRepository.save(user);

    return user;
  }
};

export default UpdateUserAvatarService;
