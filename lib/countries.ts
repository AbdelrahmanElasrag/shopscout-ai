export interface Country {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  platforms: Platform[];
  flag: string;
}

export interface Platform {
  id: string;
  name: string;
  domain: string;
  logo: string;
  category: 'global' | 'regional' | 'local';
  searchUrl: string;
  apiEndpoint?: string;
}

export const countries: Country[] = [
  {
    code: 'EG',
    name: 'Egypt',
    currency: 'EGP',
    currencySymbol: 'ج.م',
    flag: '🇪🇬',
    platforms: [
      {
        id: 'amazon_eg',
        name: 'Amazon Egypt',
        domain: 'amazon.eg',
        logo: '/platforms/amazon.png',
        category: 'regional',
        searchUrl: 'https://amazon.eg/s?k=',
        apiEndpoint: '/api/search/amazon-eg'
      },
      {
        id: 'noon_eg',
        name: 'Noon Egypt',
        domain: 'noon.com/egypt',
        logo: '/platforms/noon.png',
        category: 'regional',
        searchUrl: 'https://noon.com/egypt/search?q=',
        apiEndpoint: '/api/search/noon-eg'
      },
      {
        id: 'jumia_eg',
        name: 'Jumia Egypt',
        domain: 'jumia.com.eg',
        logo: '/platforms/jumia.png',
        category: 'local',
        searchUrl: 'https://jumia.com.eg/catalog/?q=',
        apiEndpoint: '/api/search/jumia-eg'
      }
    ]
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    currency: 'AED',
    currencySymbol: 'د.إ',
    flag: '🇦🇪',
    platforms: [
      {
        id: 'amazon_ae',
        name: 'Amazon UAE',
        domain: 'amazon.ae',
        logo: '/platforms/amazon.png',
        category: 'regional',
        searchUrl: 'https://amazon.ae/s?k=',
        apiEndpoint: '/api/search/amazon-ae'
      },
      {
        id: 'noon_ae',
        name: 'Noon UAE',
        domain: 'noon.com/uae',
        logo: '/platforms/noon.png',
        category: 'regional',
        searchUrl: 'https://noon.com/uae/search?q=',
        apiEndpoint: '/api/search/noon-ae'
      },
      {
        id: 'carrefour_ae',
        name: 'Carrefour UAE',
        domain: 'carrefouruae.com',
        logo: '/platforms/carrefour.png',
        category: 'local',
        searchUrl: 'https://carrefouruae.com/search?q=',
        apiEndpoint: '/api/search/carrefour-ae'
      }
    ]
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    currency: 'SAR',
    currencySymbol: 'ر.س',
    flag: '🇸🇦',
    platforms: [
      {
        id: 'amazon_sa',
        name: 'Amazon Saudi',
        domain: 'amazon.sa',
        logo: '/platforms/amazon.png',
        category: 'regional',
        searchUrl: 'https://amazon.sa/s?k=',
        apiEndpoint: '/api/search/amazon-sa'
      },
      {
        id: 'noon_sa',
        name: 'Noon Saudi',
        domain: 'noon.com/saudi',
        logo: '/platforms/noon.png',
        category: 'regional',
        searchUrl: 'https://noon.com/saudi/search?q=',
        apiEndpoint: '/api/search/noon-sa'
      },
      {
        id: 'extra_sa',
        name: 'eXtra Saudi',
        domain: 'extra.com',
        logo: '/platforms/extra.png',
        category: 'local',
        searchUrl: 'https://extra.com/search?q=',
        apiEndpoint: '/api/search/extra-sa'
      }
    ]
  },
  {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    flag: '🇺🇸',
    platforms: [
      {
        id: 'amazon_us',
        name: 'Amazon US',
        domain: 'amazon.com',
        logo: '/platforms/amazon.png',
        category: 'global',
        searchUrl: 'https://amazon.com/s?k=',
        apiEndpoint: '/api/search/amazon-us'
      },
      {
        id: 'walmart_us',
        name: 'Walmart',
        domain: 'walmart.com',
        logo: '/platforms/walmart.png',
        category: 'local',
        searchUrl: 'https://walmart.com/search?q=',
        apiEndpoint: '/api/search/walmart-us'
      },
      {
        id: 'target_us',
        name: 'Target',
        domain: 'target.com',
        logo: '/platforms/target.png',
        category: 'local',
        searchUrl: 'https://target.com/s?searchTerm=',
        apiEndpoint: '/api/search/target-us'
      }
    ]
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    currency: 'GBP',
    currencySymbol: '£',
    flag: '🇬🇧',
    platforms: [
      {
        id: 'amazon_uk',
        name: 'Amazon UK',
        domain: 'amazon.co.uk',
        logo: '/platforms/amazon.png',
        category: 'regional',
        searchUrl: 'https://amazon.co.uk/s?k=',
        apiEndpoint: '/api/search/amazon-uk'
      },
      {
        id: 'argos_uk',
        name: 'Argos',
        domain: 'argos.co.uk',
        logo: '/platforms/argos.png',
        category: 'local',
        searchUrl: 'https://argos.co.uk/search/',
        apiEndpoint: '/api/search/argos-uk'
      }
    ]
  }
];

export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find(country => country.code === code);
};

export const getPlatformsByCountry = (countryCode: string): Platform[] => {
  const country = getCountryByCode(countryCode);
  return country?.platforms || [];
};

export const getCurrencyByCountry = (countryCode: string): { currency: string; symbol: string } => {
  const country = getCountryByCode(countryCode);
  return {
    currency: country?.currency || 'USD',
    symbol: country?.currencySymbol || '$'
  };
}; 