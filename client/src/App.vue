<script>
  // import BannerComponent from './components/BannerComponent.vue';
  import NavbarComponent from './components/NavbarComponent.vue';
  import { useGlobalStore } from './stores/global.js';
  import { onBeforeMount } from 'vue';


  export default {
    components: {
      //BannerComponent,
      NavbarComponent
    },
    setup() {

      const { getUserDetails} = useGlobalStore();

      onBeforeMount(() => getUserDetails(localStorage.getItem("token")));
    }
  }
</script>

<template>
  
  <NavbarComponent />
  <router-view />

</template>

<style>
  
</style>