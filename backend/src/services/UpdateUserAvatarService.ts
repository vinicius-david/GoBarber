import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import User from '../models/User';
import uploadConfig from '../config/upload';

interface RequestDTO {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: RequestDTO): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new Error('User is not authenticated.');
    };

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const checkAvatarExists = await fs.promises.stat(userAvatarFilePath);

      if (checkAvatarExists) {
        await fs.promises.unlink(userAvatarFilePath)
      };
    };

    user.avatar = avatarFilename;

    usersRepository.save(user);

    return user;
  }
};

export default UpdateUserAvatarService;
