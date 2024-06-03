import { Injectable, BadRequestException } from '@nestjs/common';
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
    return this.userRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async createUser(email: string, password: string, role: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ email, password: hashedPassword, role });

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      // Manejar cualquier error de base de datos aquí
      throw new BadRequestException('Could not create user');
    }
  }

  async updateUserAvatar(id: number, avatarPath: string): Promise<User> {
    const user = await this.findById(id);
  
    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }
  
    user.avatar = avatarPath; // Asignar la ruta del avatar al usuario
  
    try {
      return await this.userRepository.save(user); // Guardar el usuario actualizado en la base de datos
    } catch (error) {
      throw new BadRequestException('Could not update user avatar');
    }
  }
  
  
}
