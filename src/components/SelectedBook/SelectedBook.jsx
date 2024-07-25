import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { CountForm, Button } from 'components';
import { GLOBAL } from 'constants';
import defaultImage from 'assets/notFound.png';
import s from './SelectedBook.module.css';

export default function SelectedBook({
  selectedBook,
  changeSelectCount,
  onDeleteBook,
}) {
  const { _id, image, title, price, count } = selectedBook;

  return (
    <article className={s.card}>
      <div className={s.thumb}>
        <Link to={`/books/${_id}`} title={`Go to the book "${title}"`}>
          <img
            src={image && image !== '' ? image : defaultImage}
            alt={title}
            className={s.cover}
          />
        </Link>

        <h3 className={s.title}>
          {title.length < GLOBAL.titleLength
            ? title
            : title.slice(0, GLOBAL.titleLength) + '...'}
        </h3>
      </div>

      <div className={s.controls}>
        <p className={s.price}>
          <span className={s.priceTitle}>Price: </span>
          <span className={s.priceValue}>${price}</span>
        </p>

        <CountForm
          value={count}
          price={price}
          min={GLOBAL.bookCount.min}
          max={GLOBAL.bookCount.max}
          styles={{
            formStyle: s.countForm,
            labelStyle: s.countLabel,
            inputStyle: s.countInput,
            totalPriceStyle: s.totalPrice,
            totalPriceTitleStyle: s.totalPriceTitle,
            totalPriceValueStyle: s.totalPriceValue,
          }}
          setCount={count => changeSelectCount({ count, _id })}
        />

        <Button
          title="Remove book from cart"
          type="button"
          styles={s.btn}
          onClick={onDeleteBook}
        >
          Delete
        </Button>
      </div>
    </article>
  );
}

SelectedBook.propTypes = {
  selectedBook: PropTypes.object.isRequired,
  changeSelectCount: PropTypes.func.isRequired,
  onDeleteBook: PropTypes.func.isRequired,
};
