// Amazon Product Advertising API 5.0 Integration
import { Country } from './countries';
import aws4 from 'aws4';

// Amazon PA-API Configuration for different regions
export const AMAZON_MARKETPLACES = {
  'Egypt': {
    marketplace: 'www.amazon.eg',
    region: 'eu-west-1',
    language: 'en_AE',
    currency: 'EGP',
    host: 'webservices.amazon.eg',
    endpoint: 'https://webservices.amazon.eg/paapi5/searchitems'
  },
  'UAE': {
    marketplace: 'www.amazon.ae',
    region: 'eu-west-1', 
    language: 'en_AE',
    currency: 'AED',
    host: 'webservices.amazon.ae',
    endpoint: 'https://webservices.amazon.ae/paapi5/searchitems'
  },
  'Saudi Arabia': {
    marketplace: 'www.amazon.sa',
    region: 'eu-west-1',
    language: 'en_AE', 
    currency: 'SAR',
    host: 'webservices.amazon.sa',
    endpoint: 'https://webservices.amazon.sa/paapi5/searchitems'
  },
  'United States': {
    marketplace: 'www.amazon.com',
    region: 'us-east-1',
    language: 'en_US',
    currency: 'USD',
    host: 'webservices.amazon.com',
    endpoint: 'https://webservices.amazon.com/paapi5/searchitems'
  },
  'United Kingdom': {
    marketplace: 'www.amazon.co.uk',
    region: 'eu-west-1',
    language: 'en_GB',
    currency: 'GBP',
    host: 'webservices.amazon.co.uk',
    endpoint: 'https://webservices.amazon.co.uk/paapi5/searchitems'
  }
};

export interface AmazonProduct {
  ASIN: string;
  DetailPageURL: string;
  Images?: {
    Primary?: {
      Large?: { URL: string; Height: number; Width: number };
      Medium?: { URL: string; Height: number; Width: number };
    };
    Variants?: Array<{
      Large?: { URL: string; Height: number; Width: number };
      Medium?: { URL: string; Height: number; Width: number };
    }>;
  };
  ItemInfo?: {
    Title?: { DisplayValue: string };
    ByLineInfo?: {
      Brand?: { DisplayValue: string };
      Manufacturer?: { DisplayValue: string };
    };
    Features?: { DisplayValues: string[] };
    Classifications?: {
      ProductGroup?: { DisplayValue: string };
      Binding?: { DisplayValue: string };
    };
  };
  Offers?: {
    Listings?: Array<{
      Price?: {
        Amount: number;
        Currency: string;
        DisplayAmount: string;
      };
      SavingBasis?: {
        Amount: number;
        Currency: string;
        DisplayAmount: string;
      };
      Availability?: { Message: string; Type: string };
      DeliveryInfo?: {
        IsAmazonFulfilled: boolean;
        IsFreeShippingEligible: boolean;
        IsPrimeEligible: boolean;
      };
    }>;
    Summaries?: Array<{
      HighestPrice?: {
        Amount: number;
        Currency: string;
        DisplayAmount: string;
      };
      LowestPrice?: {
        Amount: number;
        Currency: string;
        DisplayAmount: string;
      };
      OfferCount: number;
    }>;
  };
  CustomerReviews?: {
    Count: number;
    StarRating?: {
      Value: number;
    };
  };
  BrowseNodeInfo?: {
    BrowseNodes?: Array<{
      DisplayName: string;
      Id: string;
    }>;
  };
}

export interface AmazonSearchResponse {
  SearchResult?: {
    Items?: AmazonProduct[];
    TotalResultCount?: number;
    SearchURL?: string;
  };
  Errors?: Array<{
    Code: string;
    Message: string;
  }>;
}

export interface AmazonCredentials {
  accessKey: string;
  secretKey: string;
  partnerTag: string;
}

export class AmazonPAAPI {
  private credentials: AmazonCredentials;
  private country: Country;

  constructor(country: Country, credentials: AmazonCredentials) {
    this.country = country;
    this.credentials = credentials;
  }

  async searchProducts(
    keywords: string,
    searchIndex: string = 'All',
    itemCount: number = 20,
    itemPage: number = 1
  ): Promise<AmazonSearchResponse> {
    const marketplace = AMAZON_MARKETPLACES[this.country.name as keyof typeof AMAZON_MARKETPLACES];
    
    if (!marketplace) {
      throw new Error(`Amazon marketplace not supported for ${this.country.name}`);
    }

    const requestBody = {
      Keywords: keywords,
      SearchIndex: searchIndex,
      ItemCount: Math.min(itemCount, 50), // PA-API limit is 50
      ItemPage: itemPage,
      Marketplace: marketplace.marketplace,
      PartnerTag: this.credentials.partnerTag,
      PartnerType: 'Associates',
      Resources: [
        'Images.Primary.Large',
        'Images.Primary.Medium', 
        'Images.Variants.Large',
        'Images.Variants.Medium',
        'ItemInfo.Title',
        'ItemInfo.ByLineInfo',
        'ItemInfo.Features',
        'ItemInfo.Classifications',
        'Offers.Listings.Price',
        'Offers.Listings.SavingBasis',
        'Offers.Listings.Availability',
        'Offers.Listings.DeliveryInfo',
        'Offers.Summaries.HighestPrice',
        'Offers.Summaries.LowestPrice',
        'Offers.Summaries.OfferCount',
        'CustomerReviews.Count',
        'CustomerReviews.StarRating',
        'BrowseNodeInfo.BrowseNodes'
      ],
      LanguageOfPreference: marketplace.language,
      CurrencyOfPreference: marketplace.currency
    };

    try {
      // Generate AWS4 signature
      const signedRequest = this.signRequest(marketplace, requestBody, 'SearchItems');
      
      const response = await fetch(marketplace.endpoint, {
        method: 'POST',
        headers: signedRequest.headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Amazon PA-API request failed: ${response.status} ${response.statusText}`);
      }

      const data: AmazonSearchResponse = await response.json();
      
      if (data.Errors && data.Errors.length > 0) {
        console.error('Amazon PA-API errors:', data.Errors);
        throw new Error(`Amazon PA-API error: ${data.Errors[0].Message}`);
      }

      return data;
    } catch (error) {
      console.error('Amazon PA-API search failed:', error);
      throw error;
    }
  }

  private signRequest(marketplace: any, requestBody: any, operation: string = 'SearchItems') {
    const url = new URL(marketplace.endpoint);
    
    // Prepare the request for AWS4 signing
    const requestOptions = {
      host: marketplace.host,
      method: 'POST',
      path: url.pathname,
      service: 'ProductAdvertisingAPI',
      region: marketplace.region,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Amz-Target': `com.amazon.paapi5.v1.ProductAdvertisingAPIv1.${operation}`
      },
      body: JSON.stringify(requestBody)
    };

    // Sign the request using AWS4
    const signedRequest = aws4.sign(requestOptions, {
      accessKeyId: this.credentials.accessKey,
      secretAccessKey: this.credentials.secretKey
    });

    return signedRequest;
  }

  async getProductDetails(asin: string): Promise<AmazonProduct | null> {
    const marketplace = AMAZON_MARKETPLACES[this.country.name as keyof typeof AMAZON_MARKETPLACES];
    
    if (!marketplace) {
      throw new Error(`Amazon marketplace not supported for ${this.country.name}`);
    }

    const requestBody = {
      ItemIds: [asin],
      ItemIdType: 'ASIN',
      Marketplace: marketplace.marketplace,
      PartnerTag: this.credentials.partnerTag,
      PartnerType: 'Associates',
      Resources: [
        'Images.Primary.Large',
        'Images.Variants.Large',
        'ItemInfo.Title',
        'ItemInfo.ByLineInfo',
        'ItemInfo.Features',
        'ItemInfo.Classifications',
        'Offers.Listings.Price',
        'Offers.Listings.Availability',
        'Offers.Listings.DeliveryInfo',
        'CustomerReviews.Count',
        'CustomerReviews.StarRating'
      ],
      LanguageOfPreference: marketplace.language,
      CurrencyOfPreference: marketplace.currency
    };

    try {
      const getItemsEndpoint = marketplace.endpoint.replace('searchitems', 'getitems');
      const signedRequest = this.signRequest(
        { ...marketplace, endpoint: getItemsEndpoint }, 
        requestBody, 
        'GetItems'
      );
      
      const response = await fetch(getItemsEndpoint, {
        method: 'POST',
        headers: signedRequest.headers || {},
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Amazon PA-API GetItems failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.ItemsResult?.Items && data.ItemsResult.Items.length > 0) {
        return data.ItemsResult.Items[0];
      }
      
      return null;
    } catch (error) {
      console.error('Amazon PA-API GetItems failed:', error);
      return null;
    }
  }

  // Convert Amazon product to our internal format
  convertToProduct(amazonProduct: AmazonProduct, platform: any): any {
    const listing = amazonProduct.Offers?.Listings?.[0];
    const summary = amazonProduct.Offers?.Summaries?.[0];
    
    const price = listing?.Price?.Amount || summary?.LowestPrice?.Amount || 0;
    const originalPrice = listing?.SavingBasis?.Amount || summary?.HighestPrice?.Amount;
    
    let discount = '';
    if (originalPrice && originalPrice > price) {
      const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
      discount = `-${discountPercent}%`;
    }

    const images = [];
    if (amazonProduct.Images?.Primary?.Large?.URL) {
      images.push(amazonProduct.Images.Primary.Large.URL);
    }
    if (amazonProduct.Images?.Variants) {
      amazonProduct.Images.Variants.forEach(variant => {
        if (variant.Large?.URL) {
          images.push(variant.Large.URL);
        }
      });
    }

    const availability = this.parseAvailability(listing?.Availability?.Type || 'Unknown');
    
    return {
      id: amazonProduct.ASIN,
      title: amazonProduct.ItemInfo?.Title?.DisplayValue || 'Product',
      price: price / 100, // Convert from cents to main currency unit
      originalPrice: originalPrice ? originalPrice / 100 : undefined,
      discount,
      rating: amazonProduct.CustomerReviews?.StarRating?.Value || 4.0,
      reviewCount: amazonProduct.CustomerReviews?.Count || 0,
      image: images[0] || 'https://via.placeholder.com/400x400?text=No+Image',
      images,
      description: amazonProduct.ItemInfo?.Features?.DisplayValues?.join('. ') || '',
      brand: amazonProduct.ItemInfo?.ByLineInfo?.Brand?.DisplayValue || 
             amazonProduct.ItemInfo?.ByLineInfo?.Manufacturer?.DisplayValue || 'Unknown',
      category: amazonProduct.ItemInfo?.Classifications?.ProductGroup?.DisplayValue || 'General',
      platform: {
        id: 'amazon-' + this.country.code.toLowerCase(),
        name: `Amazon ${this.country.name}`,
        domain: AMAZON_MARKETPLACES[this.country.name as keyof typeof AMAZON_MARKETPLACES]?.marketplace || 'amazon.com',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'
      },
      url: amazonProduct.DetailPageURL,
      availability,
      shipping: {
        free: listing?.DeliveryInfo?.IsFreeShippingEligible || false,
        estimatedDays: listing?.DeliveryInfo?.IsPrimeEligible ? '1-2 days' : '3-7 days'
      },
      currency: this.country.currency,
      currencySymbol: this.country.currencySymbol,
      lastUpdated: new Date().toISOString()
    };
  }

  private parseAvailability(type: string): 'in_stock' | 'out_of_stock' | 'limited_stock' {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('in stock') || lowerType.includes('available')) {
      return 'in_stock';
    } else if (lowerType.includes('out of stock') || lowerType.includes('unavailable')) {
      return 'out_of_stock';
    } else {
      return 'limited_stock';
    }
  }

  // Get search suggestions based on Amazon's browse nodes
  async getSearchSuggestions(query: string): Promise<string[]> {
    // This would typically use Amazon's GetBrowseNodes operation
    // For now, return some relevant suggestions
    const suggestions = [
      query + ' deals',
      query + ' best seller',
      query + ' reviews',
      'popular ' + query,
      'cheap ' + query,
      query + ' 2024',
      'best ' + query
    ];
    
    return suggestions.slice(0, 5);
  }
} 