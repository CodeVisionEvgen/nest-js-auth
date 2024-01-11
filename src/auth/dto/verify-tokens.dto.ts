import { IsNotEmpty, IsString } from 'class-validator';
import {
  DATA_IS_MUST_TO_BE_EXISTS,
  DATA_IS_MUST_TO_BE_STRING,
} from '../auth.constants';

export class VerifyTokenDto {
  @IsString({
    message: DATA_IS_MUST_TO_BE_STRING('Токен'),
  })
  @IsNotEmpty({
    message: DATA_IS_MUST_TO_BE_STRING('Токен'),
  })
  refresh: string;

  @IsString({
    message: DATA_IS_MUST_TO_BE_STRING('Токен'),
  })
  @IsNotEmpty({
    message: DATA_IS_MUST_TO_BE_EXISTS('Токен'),
  })
  authorization: string;
}
