/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Category } from '../src/book/schemas/book.schema';
import mongoose from 'mongoose';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeAll(async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI!);
      await mongoose.connection.db.dropDatabase();
    } catch (error) {
      //console.log(error);
    }
  });

  afterAll(async () => await mongoose.disconnect());

  const user = {
    name: 'USER',
    email: 'user@example1.com',
    password: 'password1123',
  };

  const newBook = {
    title: 'Book testing',
    description: 'dtest',
    author: 'authort 3222',
    price: 22,
    category: Category.FANTASY,
  };

  let jwtToken: string = '';
  let bookCreated;

  describe('Auth', () => {
    it('(POST) - Register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(user)
        .expect(201)
        .then((res) => {
          expect(res.body.token).toBeDefined();
        });
    });

    it('(GET) - Login user', () => {
      return request(app.getHttpServer())
        .get('/auth/login')
        .send({ email: user.email, password: user.password })
        .expect(200)
        .then((res) => {
          expect(res.body.token).toBeDefined();
          jwtToken = res.body.token;
        });
    });
  });

  describe('Book', () => {
    it('(POST) - Create new Book', () => {
      return request(app.getHttpServer())
        .post('/book')
        .set('Authorization', 'Bearer ' + jwtToken)
        .send(newBook)
        .expect(201)
        .then((res) => {
          expect(res.body._id).toBeDefined();
          expect(res.body.title).toEqual(newBook.title);
          bookCreated = res.body;
        });
    });

    it('(GET) - get allBooks', () => {
      return request(app.getHttpServer())
        .get('/book')
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBe(1);
        });
    });

    it('(GET) - get a Book by ID', () => {
      return request(app.getHttpServer())
        .get(`/book/${bookCreated?._id}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(bookCreated._id)
        });
    });


    it('(PUT) - Update Book ', () => {
      const bookUpdate = { title: 'update book' };
      return request(app.getHttpServer())
        .put(`/book/${bookCreated?._id}`)
        .set('Authorization', 'Bearer ' + jwtToken)
        .send(bookUpdate)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.title).toEqual(bookUpdate.title)
        });
    });

    it('(DELETE) - DELETE Book by ID ', () => {
      return request(app.getHttpServer())
        .delete(`/book/${bookCreated?._id}`)
        .set('Authorization', 'Bearer ' + jwtToken)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.deleted).toEqual(true)
        });
    });

  });
});
