<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../api.js';
import { Notyf } from 'notyf';
import CommentCard from '../components/CommentCard.vue';
import { useGlobalStore } from '../stores/global.js';

const route = useRoute();
const router = useRouter();
const post = ref(null);
const comments = ref([]);
const comment = ref('');
const isLoading = ref(false);
const notyf = new Notyf();
const { user, isOwnerOf, isAdmin } = useGlobalStore();

const isEditing = ref(false);
const editTitle = ref('');
const editContent = ref('');
const isSaving = ref(false);

// instead of normal date, will do the yt or more modern style
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

function goBack(){
	router.back();
}

// 
function startEdit(){
	if(!post.value) return;
	const author = post.value.author;
	const authorId = author?._id || author;
	if(!isOwnerOf(authorId)) return notyf.error('You are not allowed to edit this post');
	editTitle.value = post.value.title || '';
	editContent.value = post.value.content || '';
	isEditing.value = true;
}

function cancelEdit(){
	isEditing.value = false;
	editTitle.value = '';
	editContent.value = '';
}

async function loadPost() {
	try {
		const id = route.params.postId;
		const res = await api.get(`/posts/${id}`);
		post.value = res.data;
		await loadComments();
	} catch (e) {
		const status = e?.response?.status;
		if (status === 404) {
			notyf.error('Post not found');
			return;
		}
		console.error(e);
		notyf.error('Failed to load post');
        router.replace({ path: '/posts' });
	}
}

async function loadComments() {
	isLoading.value = true;
	try {
		const id = route.params.postId;
		const res = await api.get(`/comments/post/${id}`);
		comments.value = Array.isArray(res.data) ? res.data : [];
	} catch (e) {
		console.error(e);
		notyf.error('Failed to load comments');
	} finally {
		isLoading.value = false;
	}
}

async function createComment() {
	if (!user.token) return notyf.error('You must be logged in to comment');
	if (!comment.value || !comment.value.trim()) return notyf.error('Comment cannot be empty');
	try {
		const id = route.params.postId;
		const res = await api.post('/comments/create', { post: id, content: comment.value });
		notyf.success('Comment posted');
		comment.value = '';
		await loadComments();
	} catch (e) {
		console.error(e);
		notyf.error(e?.response?.data?.message || 'Failed to create comment');
	}
}

async function savePost(){
	if(!user.token) return notyf.error('You must be logged in to edit');
	if(!editTitle.value || !editTitle.value.trim()) return notyf.error('Title cannot be empty');
	if(!editContent.value || !editContent.value.trim()) return notyf.error('Content cannot be empty');
	try{
		isSaving.value = true;
		const id = route.params.postId;
		const res = await api.patch(`/posts/update/${id}`, { title: editTitle.value, content: editContent.value });
		post.value = res.data;
		notyf.success('Post updated');
		isEditing.value = false;
	} catch(e){
		console.error(e);
		notyf.error(e?.response?.data?.message || 'Failed to update post');
	} finally{
		isSaving.value = false;
	}
}

onMounted(loadPost);
</script>

<template>
	<div class="container mt-4">
		<div class="row">
			<div class="col-md-8 mx-auto">
				<button class="btn btn-secondary mb-3" @click="goBack">Back</button>
				<button v-if="post && (isOwnerOf(post.author?._id || post.author))" class="btn btn-outline-secondary mb-3 ms-2" @click="startEdit">Edit</button>
				<div v-if="!post">Loading...</div>
				<div v-else class="card">
					<div class="card-body">
						<h2 v-if="!isEditing">{{ post.title }}</h2>
						<div v-else>
							<input v-model="editTitle" class="form-control mb-2" />
						</div>
						<h6 class="text-muted">by {{ post.authorName || post.author?.username }}</h6>
						<p class="text-muted">{{ formatRelative(post.createdAt) }}</p>
						<div class="mt-3">
							<div v-if="isEditing">
								<textarea v-model="editContent" class="form-control" rows="8"></textarea>
								<div class="mt-2 d-flex justify-content-end">
									<button class="btn btn-secondary me-2" @click="cancelEdit" :disabled="isSaving">Cancel</button>
									<button class="btn btn-primary" @click="savePost" :disabled="isSaving">{{ isSaving ? 'Saving...' : 'Save' }}</button>
								</div>
							</div>
							<div v-else>{{ post.content }}</div>
						</div>
					</div>
				</div>
                <div  class="card mb-4 mt-2">
                    <div class="card-body">
                        <h5 class="card-title">Comments</h5>
							<div class="mb-2">
								<div v-if="user.token">
									<div class="input-group">
										<input v-model="comment" class="form-control" placeholder="Write a comment.." @keyup.enter="createComment" />
										<button class="btn btn-primary" @click="createComment" :disabled="!comment">Post</button>
									</div>
								</div>
								<div v-else class="alert alert-secondary d-flex justify-content-between align-items-center p-2">
									<div>You need to be logged in to comment.</div>
									<div>
										<button class="btn btn-sm btn-outline-primary me-2" @click="router.push('/login')">Sign In</button>
										<button class="btn btn-sm btn-outline-secondary" @click="router.push('/register')">Register</button>
									</div>
								</div>
							</div>
                        <div v-if="isLoading">Loading comments...</div>
                <div v-else>
                    <CommentCard v-for="c in comments" :key="c._id" :comment="c" @deleted="loadComments" />
                </div>
                    </div>
                </div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.card { border-radius: 12px; }
</style>

