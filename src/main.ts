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

import { addIcons } from 'ionicons';
import { 
  star, 
  starHalf, 
  starOutline, 
  heartOutline, 
  createOutline, 
  trashOutline,
  removeCircleOutline,
  addCircleOutline,
  alertCircleOutline
} from 'ionicons/icons';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

/* ✅ REGISTER STAR ICONS HERE */
addIcons({
  star,
  'star-half': starHalf,
  'star-outline': starOutline,
  'heart-outline': heartOutline,
  'create-outline': createOutline,
  'trash-outline': trashOutline,
  'remove-circle-outline': removeCircleOutline,
  'add-circle-outline': addCircleOutline,
  'alert-circle-outline': alertCircleOutline,
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
