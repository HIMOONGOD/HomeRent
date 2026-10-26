<script setup lang="ts">



import { RouterView, useRoute } from 'vue-router';
import Nav from './components/Nav.vue';

const route = useRoute();

</script>

<template>
    <div>
        <nav>
            <Nav v-if="route.name !== 'login' && route.name !== 'register' && route.name !== 'admin'" />
        </nav>
         <RouterView />
    </div>

</template>
