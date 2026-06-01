<template>
	<div class="container text-center py-5">
		<div class="p-4 rounded bg-light">
			<h1 class="display-5">Oops — something went wrong</h1>
			<p class="lead text-muted">We couldn't find that page or an unexpected error occurred.</p>
			<div class="mt-3">
				<button class="btn btn-primary me-2" @click="goHome">Go to Home</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

function goHome(){
	router.push({ name: 'Home' });
}

function reload(){
	window.location.reload();
}
</script>

<style scoped>
.bg-light { background: linear-gradient(180deg,#ffffff,#f8f9fa); }
</style>