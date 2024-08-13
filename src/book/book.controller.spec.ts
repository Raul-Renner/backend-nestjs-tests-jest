/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { BookService } from './book.service';
import { Model } from 'mongoose';
import { BookController } from './book.controller';
import { Book, Category } from './schemas/book.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { BookFilterDto } from './dto/filter-book.dto';
import { BookSaveDto } from './dto/create-book.dto';
import { User } from 'src/auth/schemas/user.schema';
import { title } from 'process';
import { BookUpdateDto } from './dto/update-book.dto';

describe('BookController', () => {
  let bookService: BookService;
  let bookController: BookController;
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
    findAll: jest.fn().mockResolvedValue([mockBook]),
    create: jest.fn(),
    findById: jest.fn().mockResolvedValue(mockBook),
    updateById: jest.fn(),
    deleteById: jest.fn().mockResolvedValueOnce({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [BookController],
      providers: [
        BookService,
        {
          provide: BookService,
          useValue: mockBookService,
        },
      ],
    }).compile();

    bookService = module.get<BookService>(BookService);
    bookController = module.get<BookController>(BookController);
    //model = module.get<Model<Book>>(getModelToken(Book.name));
  });

  it('should be defined', () => {
    expect(bookController).toBeDefined();
  });

  describe('findAll', () => {
    const bookDTO = new BookFilterDto();
    const paramsQuery = { page: 1, limit: 1 };
    const bookFilter = { ...bookDTO, title: 'Book testing' };

    it('should find all books', async () => {
      const result = await bookController.findAll(
        bookFilter,
        paramsQuery.page,
        paramsQuery.limit,
      );

      expect(bookService.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockBook]);
    });
  });

  describe('create', () => {
    it('should create a new Book', async () => {
      const newBook = {
        title: 'Book testing',
        description: 'dtest',
        author: 'authort 3222',
        price: 22,
        category: Category.FANTASY,
      };

      mockBookService.create = jest.fn().mockResolvedValueOnce(mockBook);
      const result = await bookController.create(
        newBook as BookSaveDto,
        mockUser as User,
      );

      expect(bookService.create).toHaveBeenCalled();
      expect(result).toEqual(mockBook);
    });
  });

  describe('findById', () => {
    it('should find book by ID', async () => {
      const result = await bookController.findById(mockBook._id);
      expect(bookService.findById).toHaveBeenCalled();

      expect(result).toEqual(mockBook);
    });
  });

  describe('update', () => {
    it('should update Book by ID', async () => {
      const updateBook = { ...mockBook, title: 'update name book' };
      const book = { title: 'update name book' };
      mockBookService.updateById = jest.fn().mockResolvedValueOnce(updateBook);

      const result = await bookController.update(
        mockBook._id,
        book as BookUpdateDto,
      );

      expect(bookService.updateById).toHaveBeenCalled();
      expect(result).toEqual(updateBook);
    });
  });

  describe('deleteById', () => {
    it('should delete Book by ID', async () => {
      const result = await bookController.deleteById(mockBook._id);

      expect(bookService.deleteById).toHaveBeenCalled();
      expect(result).toEqual({ deleted: true });
    });
  });


});
