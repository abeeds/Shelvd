import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DevComponent } from './components/dev/dev.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'dev', component:  DevComponent},
    // { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];
