import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product, CartItem } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  // ===== PRODUCTS =====

  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products`);
  }

  addProduct(product: Partial<Product>): Observable<any> {
    return this.http.post(`${this.apiUrl}/products`, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`);
  }

  // ===== CART =====

  getCart(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cart`);
  }

  addToCart(product: Product, quantity: number = 1): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart`, { product, quantity });
  }

  removeFromCart(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cart/${productId}`);
  }

  clearCart(): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/clear`, {});
  }

  private loadCart() {
    this.getCart().subscribe(
      (response: any) => {
        if (response.success) {
          this.cartSubject.next(response.data);
        }
      },
      error => {
        console.error('Error loading cart:', error);
        // Initialize with empty cart if backend is not available
        this.cartSubject.next([]);
      }
    );
  }

  updateCartSubject(cartItems: CartItem[]) {
    this.cartSubject.next(cartItems);
  }

  getCartSubjectValue(): CartItem[] {
    return this.cartSubject.value;
  }

  // ===== ORDERS =====

  getOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders`);
  }

  placeOrder(order: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders`, order);
  }

  updateOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${orderId}`, { status });
  }
}