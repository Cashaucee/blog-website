import './assets/main.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';

import 'notyf/notyf.min.css';

import { createApp } from 'vue'
//createPinia is imported from pinia
import { createPinia } from 'pinia';
import App from './App.vue'

import HomePage from './pages/HomePage.vue';
import RegisterPage from './pages/RegisterPage.vue';
import LoginPage from './pages/LoginPage.vue';
import LogoutPage from './pages/LogoutPage.vue';
import ErrorPage from './pages/ErrorPage.vue';
import FeedPage from './pages/FeedPage.vue';
import PostPage from './pages/PostPage.vue';

import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'Home',
			component: HomePage
		},
		{
			path: '/register',
			name: 'Register',
			component: RegisterPage
		},
		{
			path: '/login',
			name: 'Login',
			component: LoginPage
		}, 
		{
			path: '/logout',
			name: 'Logout',
			component: LogoutPage
		},
		{
			path: '/posts',
			name: 'Feed',
			component: FeedPage
		},
		{
			path: '/posts/:postId',
			name: 'Post',
			component: PostPage
		},
		{
		path: '/:catchAll(.*)',
		component: ErrorPage
		}     
	]
})

const app = createApp(App);

//will allow us to use and manage Pinia stores in our application
app.use(createPinia())

app.use(router);

app.mount('#app');