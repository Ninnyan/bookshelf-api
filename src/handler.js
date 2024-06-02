const { nanoid } = require('nanoid');
const bookShelf = require('./bookShelf');

const addBooksHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  let finished = false;
  if (pageCount === readPage) {
    finished = true;
  }

  if (name === undefined || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  const newBook = {
    // eslint-disable-next-line max-len
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
  };

  bookShelf.push(newBook);

  const isSuccess = bookShelf.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name !== undefined) {
    // eslint-disable-next-line max-len
    const findBookName = bookShelf.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));

    const books = findBookName.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    return {
      status: 'success',
      data: {
        books,
      },
    };
  }

  if (reading !== undefined) {
    // eslint-disable-next-line eqeqeq
    const isReading = bookShelf.filter((book) => book.reading == reading);
    const books = isReading.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    return {
      status: 'success',
      data: {
        books,
      },
    };
  }
  if (finished !== undefined) {
    // eslint-disable-next-line eqeqeq
    const isFinished = bookShelf.filter((book) => book.finished == finished);
    const books = isFinished.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    return {
      status: 'success',
      data: {
        books,
      },
    };
  }

  const books = bookShelf.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return {
    status: 'success',
    data: {
      books,
    },
  };

  // eslint-disable-next-line array-callback-return
};

const getBookDetailHandler = (request, h) => {
  const { bookId } = request.params;

  const book = bookShelf.filter((books) => books.id === bookId)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();

  if (name === undefined || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = bookShelf.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    bookShelf[index] = {
      ...bookShelf[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deletebookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = bookShelf.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    bookShelf.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  // eslint-disable-next-line max-len
  addBooksHandler, getAllBooksHandler, getBookDetailHandler, editBookByIdHandler, deletebookByIdHandler,
};
