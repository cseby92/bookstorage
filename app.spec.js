'use stict'
const {app, books} = require('./app');
const request = require('supertest').agent(app.listen());
const expect = require('chai').expect;
const sinon = require('sinon');


//TODO modify IT statements

describe('Hello World', function() {
    const getBookSpy = sinon.spy(books, 'getBooks');
    const insertBookSpy = sinon.spy(books, 'insertBook');
    const removeBookSpy = sinon.spy(books, 'removeBook');


    describe('/books GET', function () {
        it('should return an empty array of books', function(done) {
            request
                .get('/books')
                .expect(200)
                .end(done);
            expect(getBookSpy.calledOnce);
        });
    });

    describe('/books POST', function () {
        it('should return add a book to the array of books', function(done) {
            const reqBody = {'name' : 'Harry Potter', 'author' : 'JK Rowling'};
            request
                .post('/books')
                .send(reqBody)
                .expect(200)
                .end(done);
            expect(getBookSpy.calledOnce);
            expect(insertBookSpy
                        .withArgs(reqBody)
                        .calledOnce);
        });
    });

    describe('/books POST', function () {
        it('should return add a book to the array of books', function(done) {
            const reqBody = {'name' : 'Harry Potter', 'author' : 'JK Rowling'};
            request
                .post('/books')
                .send(reqBody)
                .expect(200)
                .end(done);
            expect(getBookSpy.calledOnce);
            expect(insertBookSpy
                .withArgs(reqBody)
                .calledOnce);
        });
    });

    describe('/books DELETE', function () {
        it('should return a book', function(done) {
            const book = {
                'name': 'Harry Potter',
                'author': 'JK Rowling'
            };
            const reqBody = {'name' : 'Harry Potter', 'author' : 'JK Rowling'};
            request
                .delete('/books')
                .query(book)
                .expect(200)
                .end(done);

            expect(getBookSpy
                .withArgs(book)
                .calledOnce);
            expect(removeBookSpy.calledOnce);

        });
    });
});