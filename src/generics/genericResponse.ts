// import { CreateUser } from '../dtos/createUser.dto';
export interface success<T> {
  data: T;
  message: string;
}

export const responseMap = <T>(
  data: T,
  message?: string | '',
): { data: T; message: string } => {
  return { data, message: message || '' };
};

// : { data: T; message: string }
export type record = Record<string, unknown> | Array<unknown>;

export type global = Promise<success<record>>;

// export function responseMap<T>(data:T,message?:string){
//   return {data,message}
// }
