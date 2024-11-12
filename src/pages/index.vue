<template>
  <Toolbar v-if="isAuthenticated"></Toolbar>

  <v-container
    class="main-container fill-height d-flex flex-column align-center justify-center"
    max-width="900"
    width="100%"
  >
    <v-img
      class="mb-4 flex-1-1"
      max-height="150"
      height="150"
      width="200px"
      src="@/assets/logo.svg"
    />

    <div class="text-center mb-8">
      <h1 class="text-h2 font-weight-bold">
        body<span :style="{ color: '#d64405' }">IO</span>
      </h1>
    </div>

    <Login v-if="!isAuthenticated" />
    <Shopping-List v-else />
  </v-container>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/user";

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);

console.log(isAuthenticated.value);
</script>
