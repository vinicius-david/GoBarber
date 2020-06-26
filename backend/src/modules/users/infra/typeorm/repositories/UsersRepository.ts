import { getRepository, Repository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

import User from '../entities/User'

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { email } });

    return user;
  }

  public async findAllProviders({ except_id }: IFindAllProvidersDTO): Promise<User[]> {
    let users = await this.ormRepository.find();

    if (except_id) {
      users = users.filter(user => user.id !== except_id);
    };

    return users;
  }

  public async create({ name, email, password }: ICreateUserDTO): Promise<User> {
    const User = this.ormRepository.create({ name, email, password });

    await this.ormRepository.save(User);

    return User;
  }

  public async save(user: User): Promise<User> {
    return await this.ormRepository.save(user);
  }
}

export default UsersRepository;
