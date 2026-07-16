import { QIKINK_ERRORS } from './constants';

/**
 * NOTE: The official Qikink Custom API does NOT expose any product catalog, 
 * search, categories, or variant details endpoints. All products, variations, 
 * and print files are created manually in your seller dashboard (dashboard.qikink.com), 
 * and synced with your code using the generated custom SKUs.
 * 
 * As per the instructions, these unsupported operations throw descriptive 
 * errors instead of returning fake mock data.
 */

export async function fetchAllProducts(): Promise<never> {
  throw new Error(`${QIKINK_ERRORS.UNSUPPORTED} Qikink Custom API does not support fetching products. Products are managed in the seller dashboard.`);
}

export async function fetchProductById(id: string): Promise<never> {
  throw new Error(`${QIKINK_ERRORS.UNSUPPORTED} Qikink Custom API does not support querying individual product details.`);
}

export async function fetchProductVariants(productId: string): Promise<never> {
  throw new Error(`${QIKINK_ERRORS.UNSUPPORTED} Qikink Custom API does not support querying product variants.`);
}

export async function fetchCategories(): Promise<never> {
  throw new Error(`${QIKINK_ERRORS.UNSUPPORTED} Qikink Custom API does not support fetching category configurations.`);
}

export async function searchProducts(query: string): Promise<never> {
  throw new Error(`${QIKINK_ERRORS.UNSUPPORTED} Qikink Custom API does not support product search.`);
}
