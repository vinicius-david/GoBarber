import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';

interface RequestDTO {
  user_id: string;
}

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: RequestDTO): Promise<User[]> {
    const users = await this.usersRepository.findAllProviders({
      except_id: user_id
    });

    return users;
  }
};

export default ListProvidersService;
