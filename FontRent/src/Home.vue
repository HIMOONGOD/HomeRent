<script setup lang="ts">



import { RouterView } from 'vue-router';
import Nav from './components/Nav.vue';

</script>

<template>
    <div>
        <nav>
            <Nav/>
        </nav>
         <RouterView />
    </div>

</template>
