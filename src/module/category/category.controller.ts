import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseListDto } from 'src/decorator/dto/response.list.dto';
import { ResponseList } from 'src/decorator/response-list.decorator';
import { CategoryService } from './category.service';
import { CategoryListServiceResponse } from './dto/category.dto';

@ApiTags('카테고리')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary: '카테고리 리스트',
    description: '모임에 사용되는 카테고리 리스트를 가져온다.',
  })
  @Get('list')
  @ResponseList(CategoryListServiceResponse)
  async getCategoryList(): Promise<
    ResponseListDto<CategoryListServiceResponse>
  > {
    const list = await this.categoryService.getCategoryList();

    return new ResponseListDto(list);
  }
}
