import cs from 'date-fns/locale/cs';
import en from 'date-fns/locale/en-GB';
import format from 'date-fns/format';
import parse from 'date-fns/parse';

export const formatDate = (date: Date, locale: string) => {
  return format(date, getDateFormat(locale), {
    locale: getLocaleType(locale),
  });
};

export const parseDate = (date: string, locale: string) => {
  const parsedDate = parse(date, getDateFormat(locale), new Date(), {
    locale: getLocaleType(locale),
  });

  if (
    parsedDate instanceof Date &&
    !isNaN(parsedDate.getTime()) &&
    parsedDate.getFullYear() > 1900
  )
    return parsedDate;
};

const getLocaleType = (localeString: string) => {
  let localeType = cs;
  switch (localeString) {
    case 'cs':
      localeType = cs;
      break;

    case 'en':
      localeType = en;
  }
  return localeType;
};

const getDateFormat = (locale: string) => {
  switch (locale) {
    case 'cs':
      return 'd. M. yyyy';
    case 'en':
      return 'd/M/yyyy';

    default:
      return 'd. M. yyyy';
  }
};
