<script setup>
    import { watch, ref, onBeforeMount } from 'vue';
    import { Notyf } from 'notyf';
    import { useRouter } from 'vue-router';
    import { useGlobalStore } from '../stores/global.js';
    import api from '../api.js';

	const username = ref("");
	const email = ref("");
	const password = ref("");
	const confirmPassword = ref("");
    
    const isEnabled = ref(false);
    const isLoading = ref(false);
    

    const notyf = new Notyf();

    const router = useRouter()

    const { user } = useGlobalStore();

    // watch([email, password, confirmPassword], (currentValue, oldValue) => {
    //     if(currentValue.every(input => input !== "") && currentValue[1] === currentValue[2]){
    //         isEnabled.value = true
    //     } else {
    //         isEnabled.value = false
    //     }
    // });

    watch([username, email, password, confirmPassword], (currentValue) => {

    	const userVal = username.value;
    	const emailVal = email.value;
    	const passVal = password.value;
    	const confirmVal = confirmPassword.value;


    	if(userVal !== "" && emailVal !== "" && passVal !== "" && confirmVal !== "") {

 			isEnabled.value = true;

    	} else {

 			isEnabled.value = false;

    	}


	});




    async function handleSubmit(){
    	isLoading.value = true;
        try {


        	if(password.value !== confirmPassword.value) {
        		return notyf.error("Password do not match");
        	}

        	if(!email.value.includes("@")) {
        		return notyf.error("Invalid email address. It must contain '@' symbol ")
        	}

			let response = await api.post('/users/register', {
				username: username.value,
				email: email.value,
				password: password.value
			});

            if(response.status === 201) {

                notyf.success(response.data.message);

				username.value = "";
				email.value = "";
				password.value = "";
				confirmPassword.value = "";

                router.push({path: '/login'}) 
            }

        } catch (e) {
            console.error(e);
            notyf.error("Registration Failed. Please contact administrator.");
        } finally {
        	isLoading.value = false;
        }
    }

    onBeforeMount(() => {
        if(user.token){
            router.push({path: '/'})
        }
    })
</script>

<template>	
	<div class="container-fluid mt-5">
		<div class="row d-flex justify-content-center">
			<div class="col-md-3 mx-auto register-card">
			<form @submit.prevent="handleSubmit">
				<h1 class="my-1 mb-4 text-center greeting">
					Register
				</h1>

				<div class="mb-3">
					<label class="form-label" for="username">Username</label>
					<input id="username" type="text" class="form-control" v-model="username" placeholder="Choose a username">
				</div>

				<div class="mb-3">
					<label class="form-label" for="email">Email Address</label>
					<input id="email" type="text" class="form-control" v-model="email" placeholder="Enter your email address"> 	
				</div>

				<div class="mb-3">
					<label class="form-label" for="password">Password</label>
					<input id="password" type="password" class="form-control" v-model="password" placeholder="**********">	
				</div>

				<div class="mb-3">
					<label class="form-label" for="confirmPassword">Confirm Password</label>
					<input id="confirmPassword" type="password" class="form-control" v-model="confirmPassword" placeholder="**********">	
				</div>

				<div class="d-grid mt-5">

					<button type="submit" class="btn btn-primary btn-block signup-btn" v-if="isEnabled">Sign Up</button>

					<button type="submit" class="btn btn-danger btn-block signup-btn" disabled v-else>Sign Up</button>
				</div>

				<div class="text-center mt-3">
					<p class="account-text">
						Already a user? <span class="fw-bold signin-text" @click="router.push('/login')" >Sign In</span>
					</p>
					
				</div>
			</form>
			</div>
		</div>
	</div>

</template>



<style>
	.register-card {
	  background: #ACCEE8;
	  padding: 25px;
	  border-radius: 30px;
	  color: black;
	  font-weight: 700;
	  margin-bottom: 0 !important;
	}

	.signup-btn {
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

	.signin-text {
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