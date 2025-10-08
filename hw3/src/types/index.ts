export interface Product {
  product_id: number;
  sku: string;
  group_name: string;
  entertainment: string;
  product_name: string;
  category: string;
  price_twd: number;
  currency: string;
  stock: number;
  release_date: string;
  image_url: string;
  thumbnail_url: string;
  description: string;
  official_licensed: boolean;
  limited_edition: boolean;
  preorder: boolean;
  rating: number;
  sold_count: number;
  weight_g: number;
  dimensions: string;
  country_of_origin: string;
  material: string;
  max_purchase_qty: number;
  shipping_days_estimate: number;
  tags: string;
  last_updated: string;
  status: string;
}

export interface FilterOptions {
  entertainment?: string;
  group_name?: string;
  sortBy?: 'newest' | 'price_low' | 'price_high' | 'popular' | 'rating' | 'clicks';
}

export interface NavigationItem {
  label: string;
  value: string;
  children?: NavigationItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
  isSelected: boolean;
}
