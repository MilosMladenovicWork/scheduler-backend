import { IsUUID } from 'class-validator';

export class GetUserParamDto {
  @IsUUID()
  userId: string;
}
