<script setup>
import { ref, onMounted } from 'vue';
import api from '../api.js';
import PostCard from '../components/PostCard.vue';
import { Notyf } from 'notyf';

const posts = ref([]);
const isLoading = ref(false);
const isLoggedIn = ref(false);
const title = ref('');
const content = ref('');

const notyf = new Notyf();

async function loadPosts() {
	isLoading.value = true;
	try {
	const res = await api.get('/posts');
	posts.value = Array.isArray(res.data) ? res.data : [];
	} catch (e) {
		console.error(e);
		notyf.error('Failed to load posts');
	} finally {
		isLoading.value = false;
	}
}

async function checkLogin() {
	const token = localStorage.getItem('token');
	if (!token) return isLoggedIn.value = false;
	try {
		await api.get('/users/details');
		isLoggedIn.value = true;
	} catch (e) {
		isLoggedIn.value = false;
	}
}

async function createPost() {
	if (!title.value || !content.value) return notyf.error('Title and content required');
	try {
		const res = await api.post('/posts/create', { title: title.value, content: content.value });
		notyf.success('Post created');
		title.value = '';
		content.value = '';
		await loadPosts();
	} catch (e) {
		console.error(e);
		notyf.error('Failed to create post');
	}
}

onMounted(async () => {
	await checkLogin();
	await loadPosts();
});
</script>

<template>
	<div class="container mt-4">
		<div class="row">
			<div class="col-md-8 mx-auto">

				<div v-if="isLoggedIn" class="card mb-4">
					<div class="card-body">
						<h5 class="card-title">Create Post</h5>
						<div class="mb-2">
							<input v-model="title" class="form-control" placeholder="Title" />
						</div>
						<div class="mb-2">
							<textarea v-model="content" class="form-control" rows="4" placeholder="What's on your mind?"></textarea>
						</div>
						<div class="d-flex justify-content-end">
							<button class="btn btn-primary" @click="createPost" :disabled="!title || !content">Post</button>
						</div>
					</div>
				</div>

				<div v-if="isLoading">Loading posts...</div>
				<div v-else>
					<PostCard v-for="p in posts" :key="p._id" :post="p" @deleted="loadPosts" />
				</div>

			</div>
		</div>
	</div>
</template>

<style scoped>
.card { border-radius: 12px; }
</style>

