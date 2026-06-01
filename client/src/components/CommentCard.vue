<script setup>
import { useRouter } from 'vue-router';
import { Notyf } from 'notyf';
import api from '../api.js';
import { useGlobalStore } from '../stores/global.js';

const props = defineProps({
	comment: { type: Object, required: true }
});
const emit = defineEmits(['deleted']);
const router = useRouter();
const notyf = new Notyf();
const { user, isOwnerOf, isAdmin } = useGlobalStore();

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

function viewPost(e) {
	e?.stopPropagation();
	router.push(`/posts/${props.comment.post}`);
}

async function deleteComment(e) {
	e?.stopPropagation();
	if (!confirm('Delete this comment?')) return;
	try {
		await api.delete(`/comments/delete/${props.comment._id}`);
			notyf.success('Comment deleted');
		emit('deleted');
	} catch (err) {
			notyf.error(err?.response?.data?.message || 'Failed to delete comment');
	}
}

function isOwner() {
	const author = props.comment.author;
	const authorId = author?._id || author;
	return isOwnerOf(authorId);
}
</script>

<template>
	<div class="card mb-3">
		<div class="card-body">
			<div class="d-flex justify-content-between align-items-start mb-2">
				<div>
					<strong>{{ comment.authorName || comment.author?.username || 'Unknown' }}</strong>
					<div class="text-muted small">@{{ comment.author?.username || (comment.authorName || '').toLowerCase() }}</div>
				</div>
				<div class="text-muted small">{{ formatRelative(comment.createdAt) }}</div>
			</div>
			<p class="card-text mb-1">{{ comment.content }}</p>

			<div class="mt-3 d-flex justify-content-end">
				<button v-if="isOwner() || isAdmin()" class="btn btn-sm btn-danger" @click="deleteComment">Delete</button>
			</div>
		</div>
	</div>
</template>
