import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../persistence/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
}
