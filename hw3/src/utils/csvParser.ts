import { Product } from '../types';

export const parseCSV = (csvText: string): Product[] => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  const products: Product[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // 處理 CSV 中可能包含逗號的欄位（用引號包圍的）
    const values = parseCSVLine(line);
    
    if (values.length >= headers.length) {
      const product: Product = {
        product_id: parseInt(values[0]) || 0,
        sku: values[1] || '',
        group_name: values[2] || '',
        entertainment: values[3] || '',
        product_name: values[4] || '',
        category: values[5] || '',
        price_twd: parseInt(values[6]) || 0,
        currency: values[7] || 'TWD',
        stock: parseInt(values[8]) || 0,
        release_date: values[9] || '',
        image_url: values[10] || '',
        thumbnail_url: values[11] || '',
        description: values[12] || '',
        official_licensed: values[13] === 'True',
        limited_edition: values[14] === 'True',
        preorder: values[15] === 'True',
        rating: parseFloat(values[16]) || 0,
        sold_count: parseInt(values[17]) || 0,
        weight_g: parseInt(values[18]) || 0,
        dimensions: values[19] || '',
        country_of_origin: values[20] || '',
        material: values[21] || '',
        max_purchase_qty: parseInt(values[22]) || 0,
        shipping_days_estimate: parseInt(values[23]) || 0,
        tags: values[24] || '',
        last_updated: values[25] || '',
        status: values[26] || 'in_stock'
      };
      
      products.push(product);
    }
  }
  
  return products;
};

// 解析 CSV 行，處理引號內的逗號
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
};

