'use stict'
const port = process.env.PORT || 30000;
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const koaBody = require('koa-body');
const BookStorage = require('./bookstorage');

const books = new BookStorage();
const router = new Router();

//TODO HIBAKEZELÉS ÉS TESZTELÉSE!!

async function initBooks() {
    await books.init();
}
try{
    initBooks();
}catch(ex) {
    console.log(ex);
}
app.use(koaBody());


router
    .get('/books',async (ctx) => {
        try{
            ctx.body = await books.getBooks();
        }catch(ex) {
            console.log(ex);
        }
    })
    .post('/books', async(ctx) => {
        try{
            await books.insertBook(ctx.request.body);
            ctx.body = await books.getBooks();
        }catch(ex){
            console.log(ex);
        }
    })
    .delete('/books', async(ctx) => {
        book = {
            'name': ctx.query.name,
            'author': ctx.query.author
        }
        try{
            await books.removeBook(book);
            ctx.body = await books.getBooks();
        }catch(ex){
            console.log(ex);
        }
    });

app
    .use(router.routes())
    .use(router.allowedMethods());

if (!module.parent){    //if not testing
    module.exports = app.listen(3000);
}else{                  //if testing
    module.exports = {app, books}
}
console.log('Sevrer is listening on port: ' + port)
