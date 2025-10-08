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
        currency: 'TWD',
        stock: parseInt(values[7]) || 0,
        release_date: '',
        image_url: '',
        thumbnail_url: '',
        description: values[8] || '',
        official_licensed: true,
        limited_edition: values[9] === 'TRUE',
        preorder: values[10] === 'TRUE',
        rating: parseFloat(values[11]) || 0,
        sold_count: parseInt(values[12]) || 0,
        weight_g: 0,
        dimensions: '',
        country_of_origin: '',
        material: '',
        max_purchase_qty: parseInt(values[13]) || 0,
        shipping_days_estimate: parseInt(values[14]) || 0,
        tags: '',
        last_updated: '',
        status: 'in_stock'
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

