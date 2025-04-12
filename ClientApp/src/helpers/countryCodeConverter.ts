import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(en);

export const getIsoCountryCode = (input?: string) => {
  if (!input) return 'MYS';

  const upper = input.toUpperCase();

  const allIso3 = Object.keys(countries.getAlpha3Codes());
  if (allIso3.includes(upper)) {
    return upper;
  }

  const iso3 = countries.getAlpha3Code(input, 'en');
  return iso3 || 'MYS';
};
