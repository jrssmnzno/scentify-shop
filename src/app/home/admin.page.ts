import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService, Product, Order } from './data.service';
import { ApiService } from './api.service';
import { AuthService } from '../auth/auth';

@Component({
  selector: 'app-admin',
  templateUrl: './admin/admin.page.html',
  styleUrls: ['./admin/admin.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class AdminPage implements OnInit {
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
  isDragging = false;
  uploadedImageUrl = '';
  addingProduct = false;
  savingProduct = false;
  showLogoutModal = false;

  constructor(
    public dataService: DataService,
    private apiService: ApiService,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchProductsFromAPI();
    this.fetchOrdersFromAPI();
  }

  fetchProductsFromAPI() {
    this.apiService.getProducts().subscribe(
      (response: any) => {
        if (response.success) {
          this.dataService.products = response.data;
        }
      },
      error => console.error('Error fetching products:', error)
    );
  }

  fetchOrdersFromAPI() {
    this.apiService.getOrders().subscribe(
      (response: any) => {
        if (response.success) {
          this.dataService.orders = response.data;
        }
      },
      error => console.error('Error fetching orders:', error)
    );
  }

  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'top',
      color,
      icon: color === 'success' ? 'checkmark-circle-outline' : 'alert-circle-outline'
    });
    toast.present();
  }

  logout() {
    this.showLogoutModal = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get totalSales() {
    return this.orders.reduce((sum, order) => sum + order.total, 0);
  }

  get activeOrders() {
    return this.orders.filter(o => o.status !== 'Delivered').length;
  }

  get lowStockCount() {
    return Math.floor(this.products.length * 0.15);
  }

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
    if (!this.newProduct.name || !this.newProduct.price) {
      this.showToast('Please fill in product name and price', 'danger');
      return;
    }

    this.addingProduct = true;

    const productToAdd: Partial<Product> = {
      name: this.newProduct.name,
      category: this.newProduct.category,
      price: this.newProduct.price,
      tag: this.newProduct.tag,
      img: this.newProduct.img,
      description: this.newProduct.description,
      rating: this.newProduct.rating
    };

    this.apiService.addProduct(productToAdd).subscribe(
      (response: any) => {
        if (response.success) {
          this.dataService.addProduct(response.data);
          this.showToast('✨ Product added successfully!');

          this.newProduct = {
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
          this.uploadedImageUrl = '';
        }
        this.addingProduct = false;
      },
      error => {
        console.error('Error adding product:', error);
        this.showToast('Failed to add product', 'danger');
        this.addingProduct = false;
      }
    );
  }

  editProduct(p: Product) {
    this.editingProduct = { ...p };
  }

  cancelEdit() {
    this.editingProduct = null;
  }

  saveProductUpdate() {
    if (!this.editingProduct) return;

    this.savingProduct = true;

    this.apiService.updateProduct(this.editingProduct.id, this.editingProduct).subscribe(
      (response: any) => {
        if (response.success) {
          this.dataService.updateProduct(response.data);
          this.showToast('✨ Product updated successfully!');
          this.editingProduct = null;
        }
        this.savingProduct = false;
      },
      error => {
        console.error('Error updating product:', error);
        this.showToast('Failed to update product', 'danger');
        this.savingProduct = false;
      }
    );
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.apiService.deleteProduct(id).subscribe(
        (response: any) => {
          if (response.success) {
            this.dataService.deleteProduct(id);
            this.showToast('Product deleted successfully');
          }
        },
        error => {
          console.error('Error deleting product:', error);
          this.showToast('Failed to delete product', 'danger');
        }
      );
    }
  }

  updateOrderStatus(order: Order, status: string) {
    const previousStatus = order.status;
    order.status = status; // optimistic update

    this.apiService.updateOrderStatus(order.id, status).subscribe(
      (response: any) => {
        if (response.success) {
          order.status = response.data.status;
          this.showToast('Order status updated to: ' + status);
        }
      },
      error => {
        console.error('Error updating order status:', error);
        order.status = previousStatus; // revert on error
        this.showToast('Failed to update order status', 'danger');
      }
    );
  }

  // Drag and Drop Handlers
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.uploadedImageUrl = e.target?.result as string;
      this.newProduct.img = this.uploadedImageUrl;
    };
    reader.readAsDataURL(file);
  }
}