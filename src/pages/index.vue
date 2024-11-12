<template>
  <Toolbar v-if="isAuthenticated"></Toolbar>
  <v-container
    class="main-container fill-height d-flex flex-column align-center justify-center"
    max-width="900"
    width="100%"
  >
    <template v-if="!isAuthenticated">
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

      <Login />
    </template>
    <template v-else>
      <div class="text-center mb-8 d-flex align-center">
        <v-img
          class="mb-4 me-4"
          height="80"
          width="80"
          src="@/assets/logo.svg"
        />
        <h1 class="text-h2 font-weight-bold">
          body<span :style="{ color: '#d64405' }">IO</span>
        </h1>
      </div>

      <Shopping-List />
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/user";

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
</script>
