const { nanoid } = require("nanoid");
const books = require("./books");
const { createResponse } = require("./helper");

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name)
    return createResponse(
      h,
      400,
      "Gagal menambahkan buku. Mohon isi nama buku"
    );

  if (readPage > pageCount)
    return createResponse(
      h,
      400,
      "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
    );

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  books.push({
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  });

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (!isSuccess) return createResponse(h, 500, "Buku gagal ditambahkan");

  return createResponse(h, 201, "Buku berhasil ditambahkan", {
    bookId: id,
  });
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = books;

  if (name) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (reading) {
    filteredBooks = filteredBooks.filter(
      (book) => Number(book.reading) === Number(reading)
    );
  }

  if (finished) {
    filteredBooks = filteredBooks.filter(
      (book) => Number(book.finished) === Number(finished)
    );
  }

  return createResponse(h, 200, null, {
    books: filteredBooks.map((item) => ({
      id: item.id,
      name: item.name,
      publisher: item.publisher,
    })),
  });
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.filter((book) => book.id === id)[0];

  if (!book) return createResponse(h, 404, "Buku tidak ditemukan");

  return createResponse(h, 200, null, { book });
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === id);

  if (!name)
    return createResponse(
      h,
      400,
      "Gagal memperbarui buku. Mohon isi nama buku"
    );

  if (readPage > pageCount)
    return createResponse(
      h,
      400,
      "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
    );

  if (!(index !== -1))
    return createResponse(h, 404, "Gagal memperbarui buku. Id tidak ditemukan");

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
    updatedAt,
  };

  return createResponse(h, 200, "Buku berhasil diperbarui");
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (!(index !== -1))
    return createResponse(h, 404, "Buku gagal dihapus. Id tidak ditemukan");

  books.splice(index, 1);
  return createResponse(h, 200, "Buku berhasil dihapus");
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
