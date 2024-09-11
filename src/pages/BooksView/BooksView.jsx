import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useBooks, useMainHeight } from 'context';
import { fetchBooks } from 'api';
import { Spinner, Blank, Button, OptionList, BookList } from 'components';
import { GLOBAL } from 'constants';
import { ReactComponent as SearchIcon } from 'assets/search.svg';
import imageBlank from 'assets/shop.jpg';
import s from './BooksView.module.css';

export default function BooksView({ booksByTag, setBooks }) {
  const books = useBooks();
  const mainHeight = useMainHeight();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [booksByName, setBooksByName] = useState([]);
  const [booksByPrice, setBooksByPrice] = useState([]);
  const [visibleBooks, setVisibleBooks] = useState([]);
  const [searchByName, setSearchByName] = useState('');
  const [optionList, setOptionList] = useState(true);

  useEffect(() => {
    if (books.length === 0) {
      setLoading(true);

      fetchBooks()
        .then(books => {
          books.sort((firstBook, secondBook) => firstBook.id - secondBook.id);
          setBooks(books);
          setBooksByName(books);
          setBooksByPrice(books);
        })
        .catch(error => setError(error))
        .finally(() => setLoading(false));
    } else if (booksByTag.length !== 0) {
      setBooksByName(booksByTag);
      setBooksByPrice(books);
    } else {
      setBooksByName(books);
      setBooksByPrice(books);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const difference = booksByName.filter(book => booksByPrice.includes(book));
    setVisibleBooks(difference);
  }, [booksByName, booksByPrice]);

  useEffect(() => {
    setOptionList(true);
  }, [optionList]);

  function handleKeyPress(event) {
    if (event.charCode === GLOBAL.keyСodes.enter) {
      event.preventDefault();
    }
  }

  function handleChange(event) {
    setSearchByName(event.target.value);
  }

  function handleNameClick() {
    const visibleBooksToLowerCase = books.map(book => ({
      ...book,
      title: book.title.toLowerCase(),
    }));

    const queryArr = searchByName
      .toLowerCase()
      .split(' ')
      .filter(word => word !== '');

    const targetBooksToLowerCase = visibleBooksToLowerCase.filter(book => {
      let result = !book;

      for (let i = 0; i < queryArr.length; i++) {
        if (book.title.includes(queryArr[i])) {
          result = book;
        }
      }

      return result;
    });

    const bookIds = targetBooksToLowerCase.map(
      bookToLowerCase => bookToLowerCase._id,
    );

    const targetBooks = books.filter(book => bookIds.includes(book._id));

    if (!searchByName) {
      setBooksByName(books);
    } else if (targetBooks.length > 0) {
      setBooksByName(targetBooks);
    } else {
      toast.error('Please enter the correct book title!');
      setBooksByName([]);
    }
  }

  function handlePriceChange(event) {
    switch (event.target.value) {
      case 'allPrices':
        setBooksByPrice(books);
        break;

      case `${GLOBAL.pricesBreakPoint.min}>`:
        setBooksByPrice(
          books.filter(
            book =>
              book.price > GLOBAL.pricesBreakPoint.min &&
              book.price <= GLOBAL.pricesBreakPoint.first,
          ),
        );
        break;

      case `${GLOBAL.pricesBreakPoint.first}>`:
        setBooksByPrice(
          books.filter(
            book =>
              book.price > GLOBAL.pricesBreakPoint.first &&
              book.price <= GLOBAL.pricesBreakPoint.second,
          ),
        );
        break;

      case `${GLOBAL.pricesBreakPoint.second}>`:
        setBooksByPrice(
          books.filter(book => book.price > GLOBAL.pricesBreakPoint.second),
        );
        break;

      default:
        setBooksByPrice(
          books.filter(book => book.price === Number(event.target.value)),
        );
        break;
    }
  }

  function handleSort(event) {
    const value = event.target.value;

    const ascendingCode = [...visibleBooks].sort(
      (firstBook, secondBook) => firstBook.id - secondBook.id,
    );
    const descendingCode = [...visibleBooks].sort(
      (firstBook, secondBook) => secondBook.id - firstBook.id,
    );
    const ascendingPrice = [...visibleBooks].sort(
      (firstBook, secondBook) => firstBook.price - secondBook.price,
    );
    const descendingPrice = [...visibleBooks].sort(
      (firstBook, secondBook) => secondBook.price - firstBook.price,
    );

    switch (value) {
      case 'ascendingCode':
        setVisibleBooks(ascendingCode);
        break;

      case 'descendingCode':
        setVisibleBooks(descendingCode);
        break;

      case 'ascendingPrice':
        setVisibleBooks(ascendingPrice);
        break;

      case 'descendingPrice':
        setVisibleBooks(descendingPrice);
        break;

      default:
        setVisibleBooks(ascendingCode);
        break;
    }
  }

  function reset() {
    setSearchByName('');
    setOptionList(false);
    setBooksByName(books);
    setBooksByPrice(books);
  }

  return (
    <main className={s.page} style={{ minHeight: mainHeight }}>
      {loading && <Spinner size={70} color="blue" />}

      {error && (
        <p className={s.error}>Whoops, something went wrong: {error.message}</p>
      )}

      {!loading && !error && books.length === 0 && (
        <Blank
          title="There are currently no books for sale in the store"
          image={imageBlank}
          alt="Open shop"
        />
      )}

      {books.length > 0 && (
        <>
          <section className={s.bars}>
            <form className={s.searchBar}>
              <div className={s.searchByName}>
                <input
                  name="searchByName"
                  type="text"
                  placeholder="Search by book name"
                  value={searchByName}
                  className={s.inputByName}
                  onKeyPress={handleKeyPress}
                  onChange={handleChange}
                />

                <Button
                  title="Search by book name"
                  type="button"
                  typeForm="icon"
                  aria-label="Search by book name"
                  styles={s.iconButton}
                  onClick={handleNameClick}
                >
                  <SearchIcon />
                </Button>
              </div>

              <select
                id="inputByPrice"
                name="inputByPrice"
                className={s.inputByPrice}
                onChange={handlePriceChange}
              >
                {optionList && <OptionList books={books} />}
              </select>

              <Button
                title="Reset all filters"
                type="button"
                styles={s.btn}
                onClick={reset}
              >
                Reset filters
              </Button>
            </form>

            <form className={s.sortBar}>
              <label htmlFor="inputBySort" className={s.sortLabel}>
                Sort by
              </label>

              <select
                id="inputBySort"
                name="inputBySort"
                className={s.inputBySort}
                onChange={handleSort}
              >
                <option value={'ascendingCode'}>Ascending SKU</option>
                <option value={'descendingCode'}>Descending SKU</option>
                <option value={'ascendingPrice'}>
                  From cheap to expensive
                </option>
                <option value={'descendingPrice'}>
                  From expensive to cheap
                </option>
              </select>
            </form>
          </section>

          <section className={s.bookList}>
            <BookList books={visibleBooks} />
          </section>
        </>
      )}
    </main>
  );
}

BooksView.propTypes = {
  booksByTag: PropTypes.array.isRequired,
  setBooks: PropTypes.func.isRequired,
};
