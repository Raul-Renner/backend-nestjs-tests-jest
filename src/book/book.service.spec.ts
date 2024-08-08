/* eslint-disable prettier/prettier */

import mongoose, { Model } from 'mongoose';
import { BookService } from './book.service';
import { Book, Category } from './schemas/book.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BookFilterDto } from './dto/filter-book.dto';
import { BookSaveDto } from './dto/create-book.dto';
import { User } from '../auth/schemas/user.schema';

describe('BookService', () => {
  let bookService: BookService;
  let model: Model<Book>;

  const mockBook = {
    title: 'Book testing',
    description: 'dtest',
    author: 'authort 3222',
    price: 22,
    category: Category.FANTASY,
    user: '66b26998a897a815f16a6772',
    _id: '66b26998a897a815f16a6772',
  };

  const mockUser = {
    _id: '66b26998a897a815f16a6772',
    name: 'User mock',
    email: 'mockUser@gmail.com',
  };

  const mockBookService = {
    find: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken(Book.name),
          useValue: mockBookService,
        },
      ],
    }).compile();

    bookService = module.get<BookService>(BookService);
    model = module.get<Model<Book>>(getModelToken(Book.name));
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const paramsQuery = { page: 1, limit: 1 };

      jest.spyOn(model, 'find').mockImplementation(
        () =>
          ({
            limit: () => ({
              skip: jest.fn().mockReturnValue([mockBook]),
            }),
          }) as any,
      );
      const bookDTO = new BookFilterDto();
      const bookFilter = { ...bookDTO, title: 'Book testing' };
      const result = await bookService.findAll(
        bookFilter,
        paramsQuery.page,
        paramsQuery.limit,
      );

      expect(model.find).toHaveBeenCalledWith({
        title: new RegExp('Book testing', 'i'),
      });

      expect(result).toEqual([mockBook]);
    });
  });

  describe('create', () => {
    it('should create and return a book', async () => {
      const newBook = {
        title: 'Book testing',
        description: 'dtest',
        author: 'authort 3222',
        price: 22,
        category: Category.FANTASY,
      };

      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(
          (): Promise<any> => Promise.resolve( mockBook ),
        );

      const result = await bookService.create(
        newBook as BookSaveDto,
        mockUser as User,
      );

      expect(result).toEqual(mockBook);
    });
  });

  describe('findById', () => {
    it('should find and return a book by: ID', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(mockBook);

      const result = await bookService.findById(mockBook._id);

      expect(model.findById).toHaveBeenCalledWith(mockBook._id);

      expect(result).toEqual(mockBook);
    });

    it('should throw BadRequestException if invalid ID is provided', async () => {
      const id = 'invalid-id';

      const isValidObjectIDMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(false);

      await expect(bookService.findById(id)).rejects.toThrow(
        BadRequestException,
      );

      expect(isValidObjectIDMock).toHaveBeenCalledWith(id);
      isValidObjectIDMock.mockRestore();
    });

    it('should throw not NotFoundException if book is not found: ID', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(bookService.findById(mockBook._id)).rejects.toThrow(
        NotFoundException,
      );

      expect(model.findById).toHaveBeenCalledWith(mockBook._id);
    });
  });

  describe('updateById', () => {
    it('should update book and return a book', async () => {
      const updateBook = { ...mockBook, title: 'Update title' };
      const book = { title: 'Update title' };

      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updateBook);

      const result = await bookService.updateById(mockBook._id, book as Book);

      expect(model.findByIdAndUpdate).toHaveBeenLastCalledWith(
        mockBook._id,
        book,
        {
          new: true,
          runValidators: true,
        },
      );

      expect(result.title).toEqual(book.title);
    });
  });

  describe('deleteById', () => {
    it('should delete and return a book', async () => {

      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockBook);

      const result = await bookService.deleteById(mockBook._id);

      expect(model.findByIdAndDelete).toHaveBeenLastCalledWith(mockBook._id);

      expect(result).toEqual(mockBook);
    });
  });
});
