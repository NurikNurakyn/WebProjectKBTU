import { Routes } from '@angular/router';
import { About } from './pages/about/about';
import { Catalog } from './pages/catalog/catalog';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { MountainDetail } from './pages/mountain-detail/mountain-detail';
import { Profile } from './pages/profile/profile';
import { Register } from './pages/register/register';
import { Rankings } from './pages/rankings/rankings';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'landing' },
	{ path: 'landing', component: Landing },
	{ path: 'catalog', component: Catalog },
	{ path: 'mountains/:id', component: MountainDetail },
	{ path: 'leaderboard', component: Rankings },
	{ path: 'rankings', pathMatch: 'full', redirectTo: 'leaderboard' },
	{ path: 'profile', component: Profile },
	{ path: 'about', component: About },
	{ path: 'login', component: Login },
	{ path: 'register', component: Register },
	{ path: '**', redirectTo: 'landing' },
];
