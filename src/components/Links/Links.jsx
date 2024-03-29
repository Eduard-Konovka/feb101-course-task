import classNames from 'classnames';
import PropTypes from 'prop-types';
import { getTags } from 'functions';
import { TAMPLATES } from 'constants';
import s from './Links.module.css';

export default function Links({ title, styles }) {
  const links = getTags(title, TAMPLATES.links);

  return links.map(link => (
    <a
      title={`Look it up on Google "${link}"`}
      href={`https://www.google.com/search?q=${link}`}
      target="_blank"
      rel="noopener noreferrer"
      className={classNames(s.link, styles)}
      key={link}
    >
      {link}
    </a>
  ));
}

Links.propTypes = {
  title: PropTypes.string.isRequired,
  styles: PropTypes.string,
};
