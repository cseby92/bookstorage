'use stict'
const MongoClient = require('mongodb').MongoClient;

class BookStorage {
    constructor(connectionString){
        this.connectionString = connectionString || 'mongodb://localhost:27017/books';
    }

    async init(){
        this.db = await MongoClient.connect(this.connectionString);
    }

    async getBooks(){
        const cursor = this.db.collection('Books').find({});
        const books = [];
        for (let book = await cursor.next(); book != null; book = await cursor.next()) {
            books.push({
                'name': book.name,
                'author': book.author,
                'quantity': book.quantity
            });
        }
        return books;
    }

    async insertBook(book){
        const bookToInsert = Object.assign({},book);
        const bookFromDb = await this.db.collection('Books').findOne(book);

        if(!bookFromDb){
            bookToInsert.quantity = 1;
            await this.db.collection('Books').insertOne(bookToInsert);
        }else{
            bookFromDb.quantity++;
            await this.db.collection('Books').updateOne(bookToInsert,bookFromDb);
        }
    }

    async removeBook(bookToRemove){
        const bookFromDb = await this.db.collection('Books').findOne(bookToRemove);
        if(!bookFromDb){
            return;
        }
        if(bookFromDb.quantity === 1){
            await this.db.collection('Books').deleteOne(bookToRemove);
        }else{
            await this.db.collection('Books')
                .updateOne(bookToRemove, { $set: { "quantity" : bookFromDb.quantity-1 } });
        }


    }
    //for tests
    async clearCollection(){
        await this.db.collection('Books').removeMany({});
    }
}

module.exports = BookStorage;