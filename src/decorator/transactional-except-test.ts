import { applyDecorators } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

export const TransactionalExceptTest = () => {
  if (process.env.NODE_ENV !== 'test') return applyDecorators(Transactional());
  return applyDecorators();
};
