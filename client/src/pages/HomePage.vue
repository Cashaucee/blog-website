<script setup>
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '../stores/global.js';

const router = useRouter();
const { user } = useGlobalStore();

onBeforeMount(() => {
	if (user.token) router.replace({ name: 'Feed' });
});
</script>

<template>
	<div class="container mt-5">
		<div class="row justify-content-center">
			<div class="col-md-8 text-center">
				<h1 class="display-4 fw-bold mb-3">Welcome to Blooger</h1>
				<p class="lead text-muted mb-4">Share your thoughts, read what others post, and join the conversation.</p>

				<div class="d-flex justify-content-center gap-2">
					<router-link to="/posts" class="btn btn-primary btn-lg">View Feed</router-link>
					<router-link to="/register" class="btn btn-outline-primary btn-lg">Register</router-link>
					<router-link to="/login" class="btn btn-outline-secondary btn-lg">Login</router-link>
				</div>

				<div class="mt-5 text-start">
					<h5>Getting started</h5>
					<ul>
						<li>Register an account or login with the sample accounts in the README.</li>
						<li>Create posts, comment on posts, and delete your own content.</li>
						<li>Admins can delete any post or comment.</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.lead { font-size: 1.15rem; }
.gap-2 > * { margin-right: 0.5rem; }
</style>