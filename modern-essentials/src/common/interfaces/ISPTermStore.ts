import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';

/**
 * @interface
 * Generic Term Object (abstract interface)
 */
export interface ISPTermObject {
  identity: string;
  isAvailableForTagging: boolean;
  name: string;
  guid: string;
  customSortOrder: string;
  terms: ISPTermObject[];
  localCustomProperties: any;
}

/**
 * @interface
 * Interface for SPTermStoreService configuration
 */
export interface ISPTermStoreServiceConfiguration {
  spHttpClient: SPHttpClient;
  siteAbsoluteUrl: string;
}
