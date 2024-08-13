/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schemas/book.schema';
import mongoose from 'mongoose';
import { BookFilterDto } from './dto/filter-book.dto';
import { User } from '../auth/schemas/user.schema';
@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: mongoose.Model<Book>,
  ) {}

  async findAll(filter: BookFilterDto, page: number, limit: number): Promise<Book[]> {
    // const responsePerPage = 2;
    // const currentPage = Number(filter.page) || 1;
    // const skip = responsePerPage * (currentPage - 1);

    const books = await this.bookModel.find({
        title: new RegExp(filter.title, 'i'),
    }).limit(limit).skip((page - 1) * limit);
    return books;
  }

  async create(book: Book, user: User): Promise<Book> {

    const data = Object.assign(book, { user: user._id })

    const response = await this.bookModel.create(data);
    return response;
  }

  async findById(id: string): Promise<Book> {

    const isValid = mongoose.isValidObjectId(id);

    if (!isValid) {
      throw new BadRequestException('Please, enter correct id.');
    }

    const response = await this.bookModel.findById(id);

    if (!response) {
      throw new NotFoundException('Book not found.');
    }

    return response;
  }

  async updateById(id: string, book: Book): Promise<Book> {
    return await this.bookModel.findByIdAndUpdate(id, book, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: string): Promise<{ deleted: true }> {
     await this.bookModel.findByIdAndDelete(id);

     return { deleted: true }
  }
}
