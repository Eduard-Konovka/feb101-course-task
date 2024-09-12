import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useMainHeight } from 'context';
import { Button } from 'components';
import { GLOBAL } from 'constants';
import avatar from 'assets/avatar.png';
import s from './SignInView.module.css';

export default function SignInView({ setUser }) {
  const mainHeight = useMainHeight();

  const [name, setName] = useState('');

  const handleChange = event => {
    const value = event.target.value.trim();
    setName(value);
  };

  return (
    <main className={s.page} style={{ minHeight: mainHeight }}>
      <section className={s.thumb}>
        <img src={avatar} alt="avatar" className={s.avatar} />

        <form className={s.form}>
          <label htmlFor="username" className={s.label}>
            Username:
          </label>

          <input
            id="username"
            name="username"
            type="text"
            title="The length of the name must not be less than 4 and more than 16 characters. The name can only consist of letters, apostrophe, dash and spaces. For example Adrian, Jacob Mercer, Charles de Batz de Castelmore d'Artagnan, etc."
            pattern="^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$"
            placeholder="Enter your name..."
            autoComplete="given-name family-name"
            minLength={GLOBAL.signInViewInput.minLength}
            maxLength={GLOBAL.signInViewInput.maxLength}
            className={s.input}
            onChange={handleChange}
          />

          <Button
            title="Sign in to your account"
            type="button"
            typeForm="signin"
            disabled={
              name.length < GLOBAL.signInViewInput.minLength ||
              name.length > GLOBAL.signInViewInput.maxLength
            }
            onClick={() => setUser({ name })}
          >
            {name.length >= GLOBAL.signInViewInput.minLength &&
            name.length <= GLOBAL.signInViewInput.maxLength ? (
              <Link to="/books" className={s.btnLink}>
                Sign in
              </Link>
            ) : (
              <p className={s.btnLink}>Sign in</p>
            )}
          </Button>
        </form>
      </section>
    </main>
  );
}

SignInView.propTypes = {
  setUser: PropTypes.func.isRequired,
};
