import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entity/category.entity';
import { TypeMaestroCategoryStatus } from '../enum/category.enum';

@Injectable()
export class CategoryRepositoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async getCategoryList(): Promise<Array<CategoryEntity>> {
    return this.categoryRepository.find({
      where: {
        status: TypeMaestroCategoryStatus.NORMAL,
      },
      order: {
        sort: 'ASC',
      },
    });
  }
}
