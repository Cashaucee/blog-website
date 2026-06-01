<script setup>
    import { watch, ref, onBeforeMount } from 'vue';
    import { Notyf } from 'notyf';
    import { useRouter } from 'vue-router';
    import { useGlobalStore } from '../stores/global';
    import api from '../api';

    const notyf = new Notyf();

  	const router = useRouter()

	const { getUserDetails, user } = useGlobalStore();

	const identifier = ref("");
    const password = ref("");
    const isEnabled = ref(false);
    const isLoading = ref(false);

	watch([identifier,password], (currentValue) => {
		if(currentValue.every(input => input !== "")){
			isEnabled.value = true
		} else {
			isEnabled.value = false
		}
	});

    async function handleSubmit(){
    	isLoading.value = true
        try {

			const payload = {};
			if (identifier.value.includes('@')) payload.email = identifier.value;
			else payload.username = identifier.value;
			payload.password = password.value;

			let res = await api.post('/users/login', payload);


            if(res.data.access){
                
                notyf.success("Login Successful");

				localStorage.setItem("token",res.data.access);

				getUserDetails(res.data.access);

				identifier.value = "";
		        password.value = "";

		        router.push({path: '/posts'})
			} 

			// console.log("LOGIN RESPONSE:", res.data);

		} catch(e) {

			const status = e?.response?.status;
			if (status === 401) {
				notyf.error("Wrong credentials. Please try again.");
			} else if (status) {
				const msg = e.response.data?.message || 'Login failed';
				notyf.error(msg);
			} else {
				console.error(e);
				notyf.error("Login Failed. Please contact administrator.");
			}

		} finally {
        	isLoading.value = false

        }
    }

    onBeforeMount(() => {
        if(user.token){
            router.push({path: '/posts'})
        }
    })

    
</script>

<template>
	
	<div class="container-fluid mt-5">
		<div class="row d-flex justify-content-center">
			<div class="col-md-3 mx-auto login-card">
			<form @submit.prevent="handleSubmit">
				<h1 class="mt-2 mb-3 text-center greeting">
					Login
				</h1>
				
				<div class="mb-3">
					<label class="form-label" for="identifier">Email or Username</label>
					<input id="identifier" type="text" class="form-control" v-model="identifier" placeholder="Enter your email or username">    
				</div>

				<div class="mb-3">
					<label class="form-label" for="password">Password</label>
					<input id="password" type="password" class="form-control" v-model="password" placeholder="**********">	
				</div>

				


				<div class="d-grid mt-5">
					<button type="submit" class="btn btn-primary btn-block signin-btn" v-if="isEnabled">Sign In</button>
					<button type="submit" class="btn btn-danger btn-block signin-btn" disabled v-else>Sign In</button>
				</div>

				<div class="text-center mt-3">
					<p class="account-text">
						Don't have an account yet? <span class="signup-text" @click="router.push('/register')">Sign Up</span>
					</p>
					
				</div>
			</form>
			</div>
		</div>
	</div>

</template>

<style>
	.login-card {
	  background: #ACCEE8;
	  padding: 25px;
	  border-radius: 30px;
	  color: black;
	  font-weight: 700;
	  margin-bottom: 0 !important;
	}

	.signin-btn {
		padding: 15px;
		font-weight: 500;
		width: 100%;
		border-radius: 30px;
	}

	.logo-img {
	  width: 6rem;
	  height: 6rem;
	  border-radius: 50%;
	  border: 1px solid white;
	}

	.greeting {
		color: #3D75D9;
		font-size: 50px;
		font-weight: bold;
	}

	.account-text {
		color: dimgray;
		font-weight: 500;
	}

	.signup-text {
		color: black;
		font-weight: bold;
		cursor: pointer;
	}

	.form-control {
		padding: 14px;
		border-radius: 30px;
	}

	.logo-name{
		color: rgb(29, 72, 105);
		font-size: 20px;
		margin-top: -5px;
	}


</style>