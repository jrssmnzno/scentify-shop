import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DataService, Product, Order } from './data.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin/admin.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AdminPage {
  adminSegment = 'products';
  
  newProduct: Product = {
    id: 0,
    name: '',
    category: 'Fashion',
    price: 0,
    tag: 'NEW',
    img: 'assets/img/bomb.png',
    rating: 5,
    description: '',
    wishlist: false
  };

  editingProduct: Product | null = null;

  constructor(public dataService: DataService) {}

  get products() {
    return this.dataService.products;
  }

  get services() {
    return this.dataService.deliveryServices;
  }

  get orders() {
    return this.dataService.orders;
  }

  addNewProduct() {
    if (!this.newProduct.name || !this.newProduct.price) return;
    
    const productToAdd: Product = {
      ...this.newProduct,
      id: Math.floor(Math.random() * 10000)
    };
    
    this.dataService.addProduct(productToAdd);
    // Reset form
    this.newProduct.name = '';
    this.newProduct.price = 0;
    this.newProduct.description = '';
  }

  editProduct(p: Product) {
    this.editingProduct = { ...p };
  }

  cancelEdit() {
    this.editingProduct = null;
  }

  saveProductUpdate() {
    if (this.editingProduct) {
      this.dataService.updateProduct(this.editingProduct);
      this.editingProduct = null;
    }
  }

  deleteProduct(id: number) {
    this.dataService.deleteProduct(id);
  }

  updateOrderStatus(order: Order, status: string) {
    order.status = status;
  }
}