import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { User } from './auth.model';
import { ILoginUserResponse } from './auth.interface';

const loginUser = async (payload: {
  email: string;
  password: string;
}): Promise<ILoginUserResponse> => {
  const user = await User.isUserExistsByEmail(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exist with this email');
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password as string,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Incorrect password');
  }

  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: (config.jwt_access_expires_in || '1d') as any,
  });

  return {
    accessToken,
    user: {
      id: user._id as string,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

export const AuthService = {
  loginUser,
  getMe,
};
