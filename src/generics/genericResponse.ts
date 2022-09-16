// import { CreateUser } from '../dtos/createUser.dto';

import { CreateUser } from '../dtos/createUser.dto';

// export const responseMap = <T>(
//   data: T,
//   message?: string | '',
// ): { data: T; message: string } => {
//   return {
//     data,
//     message,
//   };
// };

export interface success {
  data: CreateUser;
  message: string;
}

export const responseMap = <T>(data: T, message?: string | '') => {
  return { data, message };
};

// : { data: T; message: string }
