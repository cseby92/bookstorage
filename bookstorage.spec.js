'use strict'

const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;
const BookStorage = require('./bookstorage');
const testDbConnectionString = 'mongodb://localhost:27017/test'

describe('Testing BookStorage class with test db', function () {
    let books = new BookStorage(testDbConnectionString);

    before(async function(){
        await books.init();
    });
    beforeEach(async function() {
        await books.clearCollection();
    });

    it('should return an empty array', async function () {
        expect(await books.getBooks()).to.eql([]);
    });

    it('should return the added books', async function () {
        const book = {'name': 'Harry Potter', 'author': 'JK Rowling'};
        const retBook = {'name': 'Harry Potter', 'author': 'JK Rowling', 'quantity': 1};
        await books.insertBook(book);
        expect(await books.getBooks()).to.eql([retBook]);
        await books.insertBook(book);
        retBook.quantity++;
        expect(await books.getBooks()).to.eql([retBook]);
    });

    it('should reduce the quantity of the book by 1', async function () {
        const book = {'name': 'Harry Potter', 'author': 'JK Rowling'};
        const expected = {'name': 'Harry Potter', 'author': 'JK Rowling', 'quantity': 1};

        await books.insertBook(book);
        await books.insertBook(book);
        await books.removeBook(book);
        expect(await books.getBooks()).to.eql([expected]); //átír containsre
    });

    it('should rmove the book if quantity is 1', async function () {
        const book1 = {'name': 'Harry Potter', 'author': 'JK Rowling'};
        const book2 = {'name': 'asd', 'author': 'asd'};
        await books.insertBook(book1);
        await books.insertBook(book2);
        await books.removeBook(book1);
        book2.quantity = 1;
        expect(await books.getBooks()).to.eql([book2]);
        expect(await books.getBooks()).not.to.contains(book1); //átír containsre
    });

});