import { Injectable } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  tag: string;
  img: string;
  rating: number;
  description: string;
  wishlist: boolean;

  notes?: string[];
  mood?: string;
  scentProfile?: string; // For filtering: Warm, Fresh, Sweet, Bold, etc.
  imgLoaded?: boolean; // For shimmer effect
}
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DeliveryService {
  id: number;
  name: string;
  basePrice: number;
  estimatedTime: string;
  available: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  address: string;
  contact: string;
  items: CartItem[];
  deliveryService: DeliveryService | null;
  total: number;
  status: string;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  products: Product[] = [
    {id: 1,name: 'Bomb Scent',category: 'Fashion',price: 199,tag: 'NEW',img: 'assets/img/bomb.png',rating: 4,description: 'Bold and long-lasting fragrance for everyday confidence.',wishlist: false,notes: ['Citrus', 'Musk', 'Amber'],mood: 'Bold',scentProfile: 'Warm'},
    { id: 2, name: 'Alpha Scent', category: 'Fashion', price: 399, tag: 'HOT', img: 'assets/img/alpha.png', rating: 5, description: 'Strong masculine scent with a premium and modern aroma.', wishlist: false,notes: ['Woody', 'Spicy', 'Leather'], mood: 'Confident', scentProfile: 'Warm' },
    { id: 3, name: 'Bright Scent', category: 'Fashion', price: 99, tag: 'NEW', img: 'assets/img/bright.png', rating: 3, description: 'Light and fresh scent perfect for casual daily use.', wishlist: false,notes: ['Floral', 'Fruity', 'Green'], mood: 'Fresh', scentProfile: 'Fresh' },
    { id: 4, name: 'Chance Scent', category: 'Fashion', price: 199, tag: 'NEW', img: 'assets/img/chance.png', rating: 4, description: 'Sweet and elegant fragrance with a youthful vibe.', wishlist: false, notes: ['Floral', 'Fruity', 'Vanilla'], mood: 'Playful', scentProfile: 'Sweet' },
    { id: 5, name: 'Dolce Scent', category: 'Fashion', price: 499, tag: 'NEW', img: 'assets/img/dolce.png', rating: 5, description: 'Luxurious scent inspired by high-end designer perfumes.', wishlist: false, notes: ['Floral', 'Woody', 'Musk'], mood: 'Elegant', scentProfile: 'Floral' },
    { id: 6, name: 'Happy Scent', category: 'Fashion', price: 199, tag: 'NEW', img: 'assets/img/happy.png', rating: 4, description: 'Fresh and cheerful fragrance that lasts all day.', wishlist: false, notes: ['Citrus', 'Fruity', 'Green'], mood: 'Happy', scentProfile: 'Fresh' },
    { id: 7, name: 'Creamy Scent', category: 'Fashion', price: 249, tag: 'NEW', img: 'assets/img/creamy.png', rating: 4.5, description: 'A smooth and creamy fragrance for a soft touch.', wishlist: false, notes: ['Vanilla', 'Musk', 'Amber'], mood: 'Comforting', scentProfile: 'Sweet' },
    { id: 8, name: 'Cucumber Scent', category: 'Fashion', price: 149, tag: 'NEW', img: 'assets/img/cucumber.png', rating: 3.5, description: 'Crisp and refreshing cucumber scent for daily wear.', wishlist: false, notes: ['Green', 'Fresh', 'Aqua'], mood: 'Refreshing', scentProfile: 'Fresh' },
    { id: 9, name: 'Eclat Scent', category: 'Fashion', price: 599, tag: 'HOT', img: 'assets/img/eclat.png', rating: 5, description: 'A radiant and sophisticated fragrance for special occasions.', wishlist: false, notes: ['Floral', 'Woody', 'Musk'], mood: 'Sophisticated', scentProfile: 'Floral' },
    { id: 10, name: 'Gincham Scent', category: 'Fashion', price: 299, tag: 'NEW', img: 'assets/img/gincham.png', rating: 4, description: 'A classic and elegant scent with floral notes.', wishlist: false, notes: ['Floral', 'Woody', 'Musk'], mood: 'Elegant', scentProfile: 'Floral' },
    { id: 11, name: 'Meow Scent', category: 'Fashion', price: 199, tag: 'NEW', img: 'assets/img/meow.png', rating: 4.5, description: 'A sweet and playful fragrance that charms everyone.', wishlist: false, notes: ['Sweet', 'Playful', 'Floral'], mood: 'Playful', scentProfile: 'Sweet' },
  ];

  deliveryServices: DeliveryService[] = [
    { id: 1, name: 'Scentify Express', basePrice: 50, estimatedTime: '30-45 mins', available: true },
    { id: 2, name: 'Standard Local', basePrice: 30, estimatedTime: '2-3 hours', available: true },
    { id: 3, name: 'Eco Saver', basePrice: 15, estimatedTime: 'Next Day', available: true }
  ];

  orders: Order[] = [];

  constructor() { }

  getProducts() { return this.products; }
  
  addProduct(product: Product) {
    this.products.push(product);
  }

  updateProduct(updatedProduct: Product) {
    const index = this.products.findIndex(p => p.id === updatedProduct.id);
    if (index > -1) {
      this.products[index] = updatedProduct;
    }
  }

  deleteProduct(id: number) {
    const index = this.products.findIndex(p => p.id === id);
    if (index > -1) {
      this.products.splice(index, 1);
    }
  }

  getOrders() { return this.orders; }

  addOrder(order: Order) {
    this.orders.unshift(order);
  }
}