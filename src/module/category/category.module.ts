import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/repository/repository.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [RepositoryModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
