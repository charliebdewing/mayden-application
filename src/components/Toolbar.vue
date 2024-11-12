<template>
  <v-toolbar floating class="">
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-avatar
          aria-label="User Actions"
          size="large"
          class="user-avatar ms-auto me-2"
          color="rgb(214, 68, 5)"
          v-bind="props"
        >
          <span class="text-h5">{{ initials }}</span>
        </v-avatar>
      </template>
      <v-list>
        <v-list-item @click="logout">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/user";

const authStore = useAuthStore();

const { user } = storeToRefs(authStore);

// TODO: I'll add proper support for initals later when I add google login
const initials = computed(() => {
  return user.value.email.charAt(0).toUpperCase();
});

function logout() {
  authStore.logout();
}
</script>

<style lang="scss" scoped>
.v-toolbar {
  background-color: transparent;
}

.user-avatar {
  cursor: pointer;
}
</style>
