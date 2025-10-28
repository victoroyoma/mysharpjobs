/**
 * Utility functions to transform API responses between snake_case and camelCase
 */

/**
 * Convert snake_case string to camelCase
 */
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert camelCase string to snake_case
 */
function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Transform object keys from snake_case to camelCase
 */
export function transformKeysToCamel<T = any>(obj: any): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => transformKeysToCamel(item)) as any;
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    const transformed: any = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const camelKey = snakeToCamel(key);
        const value = obj[key];
        
        // Recursively transform nested objects
        transformed[camelKey] = transformKeysToCamel(value);
      }
    }
    
    return transformed;
  }

  return obj;
}

/**
 * Transform object keys from camelCase to snake_case
 */
export function transformKeysToSnake<T = any>(obj: any): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => transformKeysToSnake(item)) as any;
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    const transformed: any = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const snakeKey = camelToSnake(key);
        const value = obj[key];
        
        // Recursively transform nested objects
        transformed[snakeKey] = transformKeysToSnake(value);
      }
    }
    
    return transformed;
  }

  return obj;
}

/**
 * Transform API response user object to match frontend interface
 */
export function transformUser(user: any): any {
  if (!user) return null;
  
  return transformKeysToCamel(user);
}

/**
 * Transform API response data
 */
export function transformApiResponse<T = any>(data: any): T {
  return transformKeysToCamel<T>(data);
}

export default {
  transformKeysToCamel,
  transformKeysToSnake,
  transformUser,
  transformApiResponse,
};
