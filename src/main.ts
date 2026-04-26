import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular
} from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';

import { addIcons } from 'ionicons';
import {
  star,
  starHalf,
  starOutline,
  heartOutline,
  heart,
  createOutline,
  trashOutline,
  removeCircleOutline,
  addCircleOutline,
  alertCircleOutline,
  addOutline,
  cashOutline,
  cartOutline,
  checkmarkCircleOutline,
  bagOutline,         // ← new
  bagAddOutline,      // ← new
  settingsOutline,    // ← new
  logOutOutline,      // ← new
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  checkmark,
  shieldCheckmarkOutline,
  personOutline,
  locationOutline,    // ← new
  refreshOutline,     // ← new
  searchOutline,      // ← new
  closeOutline,       // ← new
} from 'ionicons/icons';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

addIcons({
  star,
  'star-half': starHalf,
  'star-outline': starOutline,
  'heart-outline': heartOutline,
  heart,
  'create-outline': createOutline,
  'trash-outline': trashOutline,
  'remove-circle-outline': removeCircleOutline,
  'add-circle-outline': addCircleOutline,
  'alert-circle-outline': alertCircleOutline,
  'add-outline': addOutline,
  'cash-outline': cashOutline,
  'cart-outline': cartOutline,
  'checkmark-circle-outline': checkmarkCircleOutline,
  'bag-outline': bagOutline,          // ← new
  'bag-add-outline': bagAddOutline,   // ← new
  'settings-outline': settingsOutline, // ← new
  'log-out-outline': logOutOutline,   // ← new
  'mail-outline': mailOutline,
  'lock-closed-outline': lockClosedOutline,
  'eye-outline': eyeOutline,
  'eye-off-outline': eyeOffOutline,
  checkmark,
  'shield-checkmark-outline': shieldCheckmarkOutline,
  'person-outline': personOutline,
  'location-outline': locationOutline, // ← new
  'refresh-outline': refreshOutline,  // ← new
  'search-outline': searchOutline,    // ← new
  'close-outline': closeOutline,      // ← new
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
  ],
});