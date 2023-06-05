const { nanoid } = require('nanoid');
const books = require('./books');

const response = (status, { message, data }, statusCode, h) => {
    return h.response({
        status,
        message,
        data,
    }).code(statusCode)
}

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = readPage === pageCount;

    const newBook = {
        name, year, author, summary, publisher, pageCount, readPage, reading, id, insertedAt, updatedAt, finished, 
      };
    if (!name) {
        return response('fail', { message: 'Gagal menambahkan buku. Mohon isi nama buku' }, 400, h);
    } else if (readPage > pageCount) {
        return response('fail', { message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount' }, 400, h);
    } 
    
    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    if (!isSuccess) {
        return response('fail', { message : 'Buku gagal ditambahkan'}, 500, h);
    }else{
        return response('success', { message: 'Buku berhasil ditambahkan', data: { bookId: id } }, 201, h);
    }

    
};

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;
    const newBooks = [];

    if(name){
        const filterName = books.filter((book) => name.toLowerCase().split('').every((n) => `${book.name}`.toLowerCase().includes(n)));
        filterName.forEach(dataBooks => {
            const { id, name, publisher } = dataBooks;
            newBooks.push({ id, name, publisher });
        })
        return response('success', { data : { books : newBooks } }, 200, h);
    }else if(reading){
        const filterReading = books.filter((book) => book.reading === Boolean(Number(reading)));
        filterReading.forEach(dataBooks => {
            const { id, name, publisher } = dataBooks;
            newBooks.push({ id, name, publisher });
        })
        return response('success', { data : { books : newBooks } }, 200, h);
    }else if(finished){
        const filterFinished = books.filter((book) => book.finished === Boolean(Number(finished)));
        filterFinished.forEach(dataBooks => {
            const { id, name, publisher } = dataBooks;
            newBooks.push({ id, name, publisher });
        })
        return response('success', { data : { books : newBooks } }, 200, h);
    }else{
        books.forEach(dataBooks => {
            const { id, name, publisher } = dataBooks;
            newBooks.push({ id, name, publisher });
        })
        return response('success', { data : { books : newBooks } }, 200, h);
    }
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((n) => n.id === bookId)[0];
 
  if (book !== undefined) {
    return response('success', { data : { book : book } }, 200, h);
   }
   return response('fail', { message : 'Buku tidak ditemukan' }, 404, h);
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
 
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);

    if (!name) {
        return response('fail', { message: 'Gagal memperbarui buku. Mohon isi nama buku' }, 400, h);
    }else if (readPage > pageCount) {
        return response('fail', { message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount' }, 400, h);
    }else if (index === -1) {
        return response('fail', { message: 'Gagal memperbarui buku. Id tidak ditemukan'}, 404, h);
    }else{
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt
        };
        return response('success', { message: 'Buku berhasil diperbarui', data: { book: books[index] } }, 200, h);
    }
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
 
  const index = books.findIndex((book) => book.id === bookId);
 
  if (index !== -1) {
    books.splice(index, 1);
    return response('success', { message: 'Buku berhasil dihapus' }, 200, h);
  }
  return response('fail', { message: 'Buku gagal dihapus. Id tidak ditemukan'}, 404, h);
};
 
module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };