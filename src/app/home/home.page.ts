import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { DataService, Product, CartItem, Order } from './data.service';
import { ApiService } from './api.service';
import { GeolocationService, UserLocation } from './geolocation.service';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../auth/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})

export class HomePage implements OnInit {
  appTitle = 'Scentify';
  private _customerSegment: 'shop' | 'cart' | 'orders' = (localStorage.getItem('scentify_segment') as any) || 'shop';

  get customerSegment() { return this._customerSegment; }
  set customerSegment(val: 'shop' | 'cart' | 'orders') {
    this._customerSegment = val;
    localStorage.setItem('scentify_segment', val);
  }
  showLogoutModal = false;
  showMobileMenu = false;
  showSuccessModal = false;
  lastOrderId = '';
  showBagModal = false;
  lastAddedProduct: any = null;
  showServices = false;
  selectedScentFilter: string | null = null;
  scentFilters = ['All', 'Warm', 'Fresh', 'Sweet', 'Floral'];
  loadingProducts = true;

  userLocation: UserLocation | null = null;
  locationError: string | null = null;
  loadingLocation = false;

  private statusOrder = ['Pending', 'Processing', 'Out for Delivery', 'Delivered'];
  private statusAliases: {[key: string]: string} = { 'Preparing': 'Processing' };

  constructor(
    public dataService: DataService,
    private apiService: ApiService,
    private geolocationService: GeolocationService,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.showLogoutModal = false;
    this.fetchProductsFromAPI();
    this.fetchCartFromAPI();
    this.fetchOrdersFromAPI();
    this.getCurrentUserLocation();
  }

  async getCurrentUserLocation() {
    this.loadingLocation = true;
    this.locationError = null;
    try {
      this.userLocation = await this.geolocationService.getCurrentLocation();
      this.showToast('📍 Location detected successfully');
    } catch (error) {
      this.locationError = 'Unable to get location.';
    } finally {
      this.loadingLocation = false;
    }
  }

  fetchProductsFromAPI() {
    this.loadingProducts = true;
    this.apiService.getProducts().subscribe(
      (response: any) => {
        if (response.success) { this.dataService.products = response.data; this.loadingProducts = false; }
      },
      error => { console.error('Error fetching products:', error); this.loadingProducts = false; }
    );
  }

  fetchCartFromAPI() {
    this.apiService.getCart().subscribe(
      (response: any) => { if (response.success) this.cart = response.data; },
      error => console.error('Error fetching cart:', error)
    );
  }

  fetchOrdersFromAPI() {
    this.apiService.getOrders().subscribe(
      (response: any) => { if (response.success) this.dataService.orders = response.data; },
      error => console.error('Error fetching orders:', error)
    );
  }

  logout() {
    this.showLogoutModal = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isStepDone(currentStatus: string, step: string): boolean {
    const normalized = this.statusAliases[currentStatus] || currentStatus;
    const currentIdx = this.statusOrder.indexOf(normalized);
    const stepIdx = this.statusOrder.indexOf(step);
    return currentIdx >= stepIdx;
  }

  isStepActive(currentStatus: string, step: string): boolean {
    const normalized = this.statusAliases[currentStatus] || currentStatus;
    return normalized === step;
  }

  cart: CartItem[] = [];
  checkoutData = { name: '', address: '', contact: '', selectedServiceId: null as number | null };
  contactError = '';

  get items() {
    if (!this.selectedScentFilter || this.selectedScentFilter === 'All') return this.dataService.products;
    return this.dataService.products.filter(p => p.scentProfile === this.selectedScentFilter);
  }

  selectScentFilter(filter: string) {
    this.selectedScentFilter = filter === 'All' ? null : filter;
  }

  get deliveryServices() {
    return this.dataService.deliveryServices.filter(s => s.available);
  }

  toggleWishlist(item: Product) { item.wishlist = !item.wishlist; }

  isModalOpen = false;
  selectedProduct: Product | null = null;
  detailQty = 1;
  addingToCart = false;

  setOpen(isOpen: boolean) { this.isModalOpen = isOpen; }

  openProductDetail(product: Product) {
    this.selectedProduct = product;
    this.detailQty = 1;
    this.setOpen(true);
  }

  decreaseDetailQty() { if (this.detailQty > 1) this.detailQty--; }
  increaseDetailQty() { this.detailQty++; }

  async addToCartFromDetail() {
    if (!this.selectedProduct) return;
    this.addingToCart = true;
    this.apiService.addToCart(this.selectedProduct, this.detailQty).subscribe(
      (response: any) => {
        if (response.success) {
          this.cart = response.data;
          this.apiService.updateCartSubject(response.data);
          this.lastAddedProduct = this.selectedProduct;
          this.setOpen(false);
          this.showBagModal = true;
          this.showToast(`✅ Added ${this.detailQty}x ${this.selectedProduct?.name} to bag`);
          // Auto-navigate to cart after 2 seconds
          setTimeout(() => {
            this.customerSegment = 'cart';
            this.showBagModal = false;
          }, 2000);
        } else {
          this.showToast('❌ Failed to add item to bag');
        }
        this.addingToCart = false;
      },
      error => {
        console.error('Error adding to cart:', error);
        this.showToast('❌ Backend error. See CONFIG.md for setup instructions.');
        this.addingToCart = false;
      }
    );
  }

  buyProduct(item: Product) {
    this.addingToCart = true;
    this.apiService.addToCart(item, 1).subscribe(
      (response: any) => {
        if (response.success) {
          this.cart = response.data;
          this.apiService.updateCartSubject(response.data);
          this.lastAddedProduct = item;
          this.showBagModal = true;
          this.showToast(`✅ Added ${item.name} to bag`);
          // Auto-navigate to cart after 2 seconds
          setTimeout(() => {
            this.customerSegment = 'cart';
            this.showBagModal = false;
          }, 2000);
        } else {
          this.showToast('❌ Failed to add item to bag');
        }
        this.addingToCart = false;
      },
      error => {
        console.error('Error adding to cart:', error);
        this.showToast('❌ Backend error. See CONFIG.md for setup instructions.');
        this.addingToCart = false;
      }
    );
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message, duration: 3000, position: 'top',
      icon: 'checkmark-circle-outline', color: 'success', cssClass: 'custom-toast'
    });
    toast.present();
  }

  removeFromCart(index: number) {
    const productId = this.cart[index].product.id;
    const productName = this.cart[index].product.name;
    this.apiService.removeFromCart(productId).subscribe(
      (response: any) => {
        if (response.success) {
          this.cart = response.data;
          this.apiService.updateCartSubject(response.data);
          this.showToast(`✅ ${productName} removed from bag`);
        } else {
          this.showToast('❌ Failed to remove item');
        }
      },
      error => {
        console.error('Error removing from cart:', error);
        this.showToast('❌ Error removing item');
      }
    );
  }

  increaseQty(index: number) { this.cart[index].quantity++; }
  decreaseQty(index: number) {
    if (this.cart[index].quantity > 1) { this.cart[index].quantity--; } else { this.cart.splice(index, 1); }
  }

  get cartItemCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  get cartSubtotal() {
    return this.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  get selectedDeliveryPrice() {
    const service = this.deliveryServices.find(s => s.id === this.checkoutData.selectedServiceId);
    return service ? service.basePrice : 0;
  }

  get cartTotal() {
    const itemsTotal = this.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const service = this.deliveryServices.find(s => s.id === this.checkoutData.selectedServiceId);
    return itemsTotal + (service ? service.basePrice : 0);
  }

  findServices() {
    if (!this.checkoutData.address) { window.alert('Please enter your delivery address first.'); return; }
    this.showServices = true;
  }

  validateContact() {
    const contact = this.checkoutData.contact;
    if (!contact) { this.contactError = ''; return; }
    const digits = contact.replace(/\D/g, '');
    if (digits.length !== 11) { this.contactError = 'Contact number must be exactly 11 digits'; }
    else if (!digits.startsWith('09')) { this.contactError = 'Contact number must start with 09'; }
    else { this.contactError = ''; }
  }

  placeOrder() {
    this.validateContact();
    if (!this.checkoutData.name || !this.checkoutData.address || !this.checkoutData.selectedServiceId) {
      window.alert('Please fill in all details and select a delivery service.'); return;
    }
    if (this.contactError) { window.alert('Please fix the contact number error.'); return; }

    const service = this.deliveryServices.find(s => s.id === this.checkoutData.selectedServiceId) || null;
    const orderPayload = {
      customerName: this.checkoutData.name, address: this.checkoutData.address,
      contact: this.checkoutData.contact, items: [...this.cart],
      deliveryService: service, total: this.cartTotal, status: 'Pending', date: new Date()
    };

    this.apiService.placeOrder(orderPayload).subscribe(
      (response: any) => { if (response.success) this.dataService.addOrder(response.data); },
      error => console.error('Error placing order:', error)
    );

    this.apiService.clearCart().subscribe(
      (response: any) => { if (response.success) { this.cart = []; this.apiService.updateCartSubject([]); } },
      error => console.error('Error clearing cart:', error)
    );

    this.checkoutData = { name: '', address: '', contact: '', selectedServiceId: null };
    this.showServices = false;
    this.showSuccessModal = true;
  }
}