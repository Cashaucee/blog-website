<script setup>
	
	import { onBeforeMount } from 'vue';
	import { useGlobalStore } from '../stores/global.js';
	import { useRouter } from 'vue-router';
	import { Notyf } from 'notyf';

	const notyf = new Notyf();
	const { getUserDetails } = useGlobalStore();

	const router = useRouter();

	onBeforeMount(() => {

		localStorage.clear();

		getUserDetails(null);

		notyf.success('Logged out');

		router.push({ path: '/login'});

	});
</script>