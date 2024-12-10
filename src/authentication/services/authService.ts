import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../user/models/userModel';
import {config} from 'dotenv';
import { CreateUserDTO } from '../../user/dto/user.dto';

config();

const SECRET_KEY = process.env.JWT_SECRET || 'secret_key';

class AuthService {
  static async register(user: CreateUserDTO) {
    user.password = await bcrypt.hash(user.password, 10);
    return await User.create(user);
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Invalid password');

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: '1h',
    });
    return { token, user };
  }
}

export default AuthService;