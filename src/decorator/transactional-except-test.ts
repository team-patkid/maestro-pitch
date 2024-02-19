import { applyDecorators } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

export const TransactionalExceptTest = () => {
  console.log('process.env.NODE_ENV', process.env.NODE_ENV);
  if (process.env.NODE_ENV !== 'test') return applyDecorators(Transactional());
  return applyDecorators();
};
