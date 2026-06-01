<script setup>
import { useRouter } from 'vue-router';
import { Notyf } from 'notyf';
import api from '../api.js';
import { useGlobalStore } from '../stores/global.js';

const props = defineProps({
	post: { type: Object, required: true }
});
const emit = defineEmits(['deleted']);
const router = useRouter();
const notyf = new Notyf();
const { user, isOwnerOf, isAdmin } = useGlobalStore();

function viewPost(e) {
	e?.stopPropagation();
	router.push(`/posts/${props.post._id}`);
}

function formatRelative(dateInput) {
	if (!dateInput) return '';
	const date = new Date(dateInput);
	const now = new Date();
	const diffMs = now - date;
	const diffSec = Math.floor(diffMs / 1000);
	const diffMin = Math.floor(diffSec / 60);
	const diffHours = Math.floor(diffMin / 60);
	const diffDays = Math.floor(diffHours / 24);
	const diffMonths = Math.floor(diffDays / 30);
	const diffYears = Math.floor(diffDays / 365);

	if (diffSec < 60) return 'just now';
	if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
	if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
	if (diffDays < 30) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
	if (diffMonths < 12) return `${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`;
	return `${diffYears} year${diffYears === 1 ? '' : 's'} ago`;
}

async function deletePost(e) {
	e?.stopPropagation();
	if (!confirm('Delete this post?')) return;
	try {
		await api.delete(`/posts/delete/${props.post._id}`);
			notyf.success('Post deleted');
		emit('deleted');
	} catch (err) {
			notyf.error(err?.response?.data?.message || 'Failed to delete post');
	}
}

function isOwner() {
	const author = props.post.author;
	const authorId = author?._id || author;
	return isOwnerOf(authorId);
}
</script>

<template>
	<div class="card mb-3">
		<div class="card-body">
			<h5 class="card-title">{{ post.title }}</h5>
			<h6 class="card-subtitle mb-2 text-muted">by {{ post.authorName || post.author?.username || 'Unknown' }}</h6>
			<p class="card-text text-truncate">{{ post.content }}</p>
			<small class="text-muted">{{ formatRelative(post.createdAt) }}</small>

			<div class="mt-3 d-flex justify-content-end">
				<button class="btn btn-sm btn-outline-primary me-2" @click="viewPost">View</button>
				<button v-if="isOwner() || isAdmin()" class="btn btn-sm btn-danger" @click="deletePost">Delete</button>
			</div>
		</div>
	</div>
</template>
