import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Categories } from "./entities/category.entity";
import * as data from '../DATA.json';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoriesRepository.create(createCategoryDto);
    await this.categoriesRepository.save(category);
    return category;
  }
  async addCategories() {
    for (const element of data) {
      const existingCategory = await this.categoriesRepository.findOne({
        where: { name: element.category },
      });
      if (!existingCategory) {
        const newCategory = this.categoriesRepository.create({
          name: element.category,
        });
        await this.categoriesRepository.save(newCategory);
      }
    }
  }

  async findAll() {
    return this.categoriesRepository.find();
  }

  async findOne(id: string) {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!category) {
      throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoriesRepository.preload({
      id,
      ...updateCategoryDto,
    });
    if (!category) {
      throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    }
    return this.categoriesRepository.save(category);
  }

  async remove(id: string) {
    const result = await this.categoriesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    }
  }
}
