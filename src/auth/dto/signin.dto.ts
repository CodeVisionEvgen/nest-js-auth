import { IsNotEmpty, IsString } from 'class-validator';
import {
  DATA_IS_MUST_TO_BE_EXISTS,
  DATA_IS_MUST_TO_BE_STRING,
} from '../auth.constants';

export class SigninAuthDto {
  @IsString({
    message: DATA_IS_MUST_TO_BE_STRING('Нік'),
  })
  @IsNotEmpty({
    message: DATA_IS_MUST_TO_BE_EXISTS('Нік'),
  })
  nick: string;

  @IsString({
    message: DATA_IS_MUST_TO_BE_STRING('Пароль'),
  })
  @IsNotEmpty({
    message: DATA_IS_MUST_TO_BE_EXISTS('Пароль'),
  })
  password: string;
}
