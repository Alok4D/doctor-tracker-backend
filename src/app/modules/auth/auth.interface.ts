import { Model } from 'mongoose';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserModel extends Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  isUserExistsByEmail(email: string): Promise<IUser | null>;
}

export interface ILoginUserResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin';
  };
}

