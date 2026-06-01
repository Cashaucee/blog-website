<script setup>
  
  import { onBeforeMount } from 'vue';
  import { useRoute } from 'vue-router';
  import { useGlobalStore } from '../stores/global.js';
  import { storeToRefs } from 'pinia';

  const route = useRoute();

  const global = useGlobalStore();
  const { user } = storeToRefs(global);


</script>


<template>
  <nav class="navbar navbar-expand-lg navbar-dark shadow-sm">
    <div class="container">

      <router-link :to="user.email ? { name: 'Feed' } : { name: 'Home' }" class="navbar-brand d-inline-flex align-items-center custom-brand">
        <span class="brand-text">Blooger</span>
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav ms-auto">
          <router-link :to="{ name: 'Feed' }" class="nav-link">Feed</router-link>
          <router-link :to="{ name: 'Register' }" class="nav-link" v-if="!user.email">Register</router-link>
          <router-link :to="{ name: 'Login' }" class="nav-link" v-if="!user.email">Login</router-link>
          <router-link :to="{ name: 'Logout' }" class="nav-link" v-else>Logout</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<style>
  /* Base styles for the brand link container */
  .custom-brand {
    transition: all 0.3s ease-in-out;
    cursor: pointer;
  }

  /* Base styles for the logo image */
  .brand-logo {
    height: 40px; /* Adjust size as needed */
    width: auto;
    transition: transform 0.3s ease-in-out, filter 0.3s ease-in-out;
  }

  /* Base styles for the text */
  .brand-text {
    transition: color 0.3s ease-in-out, text-shadow 0.3s ease-in-out;
  }

  /* Hover Effects (Triggers when hovering anywhere on the link) */
  .custom-brand:hover .brand-logo {
    transform: scale(1.1); /* Gently enlarges the logo */
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6)); /* Gives the logo a soft gold/white glow */
  }

  .custom-brand:hover .brand-text {
    color: #fff; /* Ensures text stays bright or changes color */
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5); /* Gives the text a subtle glow matching the image */
  }

  .nav-link{
    font-weight: 700;
  }
</style>