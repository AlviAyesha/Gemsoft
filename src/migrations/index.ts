import * as migration_20261007_230411_initial from './20261007_230411_initial';
import * as migration_20261008_183116_text_pages from './20261008_183116_text_pages';

export const migrations = [
  {
    up: migration_20261007_230411_initial.up,
    down: migration_20261007_230411_initial.down,
    name: '20261007_230411_initial',
  },
  {
    up: migration_20261008_183116_text_pages.up,
    down: migration_20261008_183116_text_pages.down,
    name: '20261008_183116_text_pages'
  },
];
