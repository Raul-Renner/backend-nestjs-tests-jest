/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { BookSaveDto } from './dto/create-book.dto';
import { BookUpdateDto } from './dto/update-book.dto';
import { BookFilterDto } from './dto/filter-book.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  async findAll(
    @Query() filter: BookFilterDto,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Book[]> {
    return await this.bookService.findAll(filter, page, limit);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() book: BookSaveDto, @Req() request): Promise<Book> {
    const response = await this.bookService.create(book, request.user);
    return response;
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Book> {
    return await this.bookService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() book: BookUpdateDto,
  ): Promise<Book> {
    const response = await this.bookService.updateById(id, book);
    return response;
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string): Promise<Book> {
    const response = await this.bookService.deleteById(id);
    return response;
  }
}
