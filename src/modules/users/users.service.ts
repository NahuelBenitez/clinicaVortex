import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({where:{id}});
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async createUser(email: string, password: string, role: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash de la contraseña
    const user = this.userRepository.create({ email, password: hashedPassword ,role});
    return this.userRepository.save(user);
  }
}
