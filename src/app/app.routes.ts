import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DevComponent } from './components/dev/dev.component';
import { CreateShelfComponent } from './components/create_shelf/create_shelf.components';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'dev', component:  DevComponent},
    {path: 'create_shelf', component: CreateShelfComponent}
    // { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];
