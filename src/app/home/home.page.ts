import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataService, Product, CartItem, Order } from './data.service';
import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})

export class HomePage {
  appTitle = 'Scentify'; // dynamic app title
  customerSegment: 'shop' | 'cart' = 'shop';
  showServices = false;

  constructor(public dataService: DataService, private toastCtrl: ToastController) {}

  // --- Customer State ---
  cart: CartItem[] = [];
  checkoutData = {
    name: '',
    address: '',
    contact: '',
    selectedServiceId: null as number | null
  };

  get items() {
    return this.dataService.products;
  }

  get deliveryServices() {
    return this.dataService.deliveryServices.filter(s => s.available);
  }

  toggleWishlist(item: Product) {
    item.wishlist = !item.wishlist;
  }

  isModalOpen = false;
  selectedProduct: Product | null = null;
  detailQty = 1;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  openProductDetail(product: Product) {
    this.selectedProduct = product;
    this.detailQty = 1;
    this.setOpen(true);
  }

  decreaseDetailQty() {
    if (this.detailQty > 1) {
      this.detailQty--;
    }
  }

  increaseDetailQty() {
    this.detailQty++;
  }

  addToCartFromDetail() {
    if (!this.selectedProduct) return;

    const existing = this.cart.find(i => i.product.id === this.selectedProduct!.id);
    if (existing) {
      existing.quantity += this.detailQty;
    } else {
      this.cart.push({ product: this.selectedProduct, quantity: this.detailQty });
    }
    this.showToast(`${this.selectedProduct.name} added to cart`);
    this.setOpen(false);
  }

  // --- Customer Logic ---
  buyProduct(item: Product) {
    const existing = this.cart.find(i => i.product.id === item.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.cart.push({ product: item, quantity: 1 });
    }
    this.showToast(`${item.name} added to cart`);
  }

  async showToast(message: string) {
  const toast = await this.toastCtrl.create({
    message,
    duration: 1500,
    position: 'bottom',
    icon: 'checkmark-circle-outline'
  });
  toast.present();
}

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
  }

  increaseQty(index: number) {
    this.cart[index].quantity++;
  }

  decreaseQty(index: number) {
    if (this.cart[index].quantity > 1) {
      this.cart[index].quantity--;
    } else {
      this.cart.splice(index, 1); // remove item if qty reaches 0
    }
  }

  get cartTotal() {
    const itemsTotal = this.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const service = this.deliveryServices.find(s => s.id === this.checkoutData.selectedServiceId);
    const deliveryPrice = service ? service.basePrice : 0;
    return itemsTotal + deliveryPrice;
  }

  findServices() {
    if (!this.checkoutData.address) {
      window.alert('Please enter your delivery address first to find nearby services.');
      return;
    }
    // In a real app, this would query based on location. Here we simulate it.
    this.showServices = true;
  }

  placeOrder() {
    if (!this.checkoutData.name || !this.checkoutData.address || !this.checkoutData.selectedServiceId) {
      window.alert('Please fill in all details and select a delivery service.');
      return;
    }

    const service = this.deliveryServices.find(s => s.id === this.checkoutData.selectedServiceId) || null;

    const newOrder: Order = {
      id: 'ORD-' + Math.floor(Math.random() * 10000),
      customerName: this.checkoutData.name,
      address: this.checkoutData.address,
      contact: this.checkoutData.contact,
      items: [...this.cart],
      deliveryService: service,
      total: this.cartTotal,
      status: 'Pending',
      date: new Date()
    };

    this.dataService.addOrder(newOrder);
    this.cart = [];
    this.checkoutData = { name: '', address: '', contact: '', selectedServiceId: null };
    window.alert('Order placed successfully! Track it in the Admin panel.');
    this.showServices = false;
    this.customerSegment = 'shop';
  }
}
