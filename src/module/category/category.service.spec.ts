import sinon, { SinonStubbedInstance } from 'sinon';
import { CategoryEntity } from 'src/repository/entity/category.entity';
import { TypeMaestroCategoryStatus } from 'src/repository/enum/category.repository.enum';
import { CategoryRepositoryService } from 'src/repository/service/category.repository.service';
import { v4 as uuidV4 } from 'uuid';
import { CategoryService } from './category.service';
import { CategoryListServiceResponse } from './dto/category.dto';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let categoryRepositoryService: SinonStubbedInstance<CategoryRepositoryService>;

  beforeEach(async () => {
    categoryRepositoryService = sinon.createStubInstance(
      CategoryRepositoryService,
    );
    categoryService = new CategoryService(categoryRepositoryService);
  });

  const createCategoryEntity = (ctx: {
    id?: number;
    title?: string;
    description?: string;
    video?: string;
    image?: string;
    isHot?: boolean;
    logo?: string;
    sort?: number;
    status?: TypeMaestroCategoryStatus;
    inputDate?: Date;
    updateDate?: Date;
  }): CategoryEntity => {
    const entity = new CategoryEntity();

    entity.id = ctx.id ?? 1;
    entity.title = ctx.title ?? uuidV4();
    entity.description = ctx.description ?? uuidV4();
    entity.video = ctx.video ?? uuidV4();
    entity.image = ctx.image ?? uuidV4();
    entity.isHot = ctx.isHot ?? true;
    entity.logo = ctx.logo ?? uuidV4();
    entity.sort = ctx.sort ?? 1;
    entity.status = ctx.status ?? TypeMaestroCategoryStatus.NORMAL;
    entity.inputDate = ctx.inputDate ?? new Date();
    entity.updateDate = ctx.updateDate ?? new Date();

    return entity;
  };

  const createCategoryListServiceResponse = (ctx: {
    id?: number;
    title?: string;
    description?: string;
    video?: string;
    image?: string;
    isHot?: boolean;
    logo?: string;
  }): CategoryListServiceResponse => {
    const entity = new CategoryListServiceResponse();

    entity.id = ctx.id ?? 1;
    entity.title = ctx.title ?? uuidV4();
    entity.description = ctx.description ?? uuidV4();
    entity.video = ctx.video ?? uuidV4();
    entity.image = ctx.image ?? uuidV4();
    entity.isHot = ctx.isHot ?? true;
    entity.logo = ctx.logo ?? uuidV4();

    return entity;
  };

  it('should be defined', () => {
    expect(categoryService).toBeDefined();
  });

  describe('getCategoryList', () => {
    it('should return an array of CategoryListServiceResponse', async () => {
      const list = [1, 2, 3].map((id) => createCategoryEntity({ id }));

      const expected = list.map((entity) =>
        createCategoryListServiceResponse({
          id: entity.id,
          title: entity.title,
          description: entity.description,
          video: entity.video,
          image: entity.image,
          isHot: entity.isHot,
          logo: entity.logo,
        }),
      );

      categoryRepositoryService.getCategoryList.resolves(list);

      const result = await categoryService.getCategoryList();

      expect(result).toEqual(expected);
    });
  });
});
