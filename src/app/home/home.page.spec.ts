import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import { DataService, Product, Order } from './data.service';

class MockDataService {
  products: Product[] = [];
  deliveryServices: any[] = [];
  orders: Order[] = [];

  getProducts() { return this.products; }
  getOrders() { return this.orders; }
  addProduct(product: Product) { this.products.push(product); }
  updateProduct(product: Product) {}
  deleteProduct(id: number) {}
  addOrder(order: Order) { this.orders.push(order); }
}

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage, RouterTestingModule, IonicModule.forRoot()],
      providers: [{ provide: DataService, useClass: MockDataService }]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
