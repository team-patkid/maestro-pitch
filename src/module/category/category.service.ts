import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CategoryRepositoryService } from 'src/repository/service/category.repository.service';
import { CategoryListServiceResponse } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepositoryService: CategoryRepositoryService,
  ) {}

  async getCategoryList(): Promise<Array<CategoryListServiceResponse>> {
    const list = await this.categoryRepositoryService.getCategoryList();

    return list.map((item) =>
      plainToClass(CategoryListServiceResponse, {
        id: item.id,
        title: item.title,
        description: item.description,
        video: item.video,
        image: item.image,
        isHot: item.isHot,
        logo: item.logo,
      }),
    );
  }
}
