import { defineStore } from 'pinia';
import { reactive } from 'vue';

import api from '../api';
import { Notyf } from 'notyf';

const notyf = new Notyf();
//defineStore() creates a store. It has 2 arguments, the unique id of the store and the function that defines and returns the states and actions of the store.
export const useGlobalStore = defineStore('global', () => {

	let user = reactive({
		token: localStorage.getItem('token'),
		id: null,
		email: null,
		role: null,
		isAdmin: false
	})

	async function getUserDetails(token) {
		console.log("getUserDetails called with token:", token);
		
		if(!token) {
			user.token = null;
			user.id = null;
			user.email = null;
			return
		}
		
		try{
			let { data } = await api.get('/users/details', {
			headers: {
				Authorization: `Bearer ${token}`
			}
			});
			console.log('getUserDetails response:', data);

			user.token = token;
			const payload = data.user ? data.user : data;
			user.id = payload._id || payload.id || null;
			user.email = payload.email || null;
			// Try to populate a role field and isAdmin flag if provided by the API
			user.role = payload.role || (payload.isAdmin ? 'admin' : (payload.isAdmin === false ? 'user' : null)) || payload.roleName || null;
			user.isAdmin = !!payload.isAdmin || user.role === 'admin';
			console.log('user state set to:', user);

		} catch (error) {
			// Notify user that fetching profile failed and clear local state
			notyf.error(error?.response?.data?.message || 'Failed to fetch user details');
			getUserDetails(null);
		}

	}


	function isOwnerOf(authorId) {
		if (!authorId) return false;
		return String(user.id) === String(authorId);
	}

	function isAdmin() {
		return !!user.isAdmin || user.role === 'admin';
	}

	return {
		user,
		getUserDetails,
		isOwnerOf,
		isAdmin
	}
});