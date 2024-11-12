<template>
  <div class="login">
    <v-card
      :disabled="loading"
      class="mx-auto py-4 px-8"
      elevation="8"
      max-width="448"
      rounded="lg"
      :loading="loading"
    >
      <div class="text-subtitle-1 text-medium-emphasis">Account</div>

      <v-form @submit.prevent validate-on="input" v-model="valid">
        <v-text-field
          mandatory
          density="compact"
          placeholder="Email address"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          v-model="email"
          :rules="emailRules"
        ></v-text-field>

        <div
          class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
        >
          Password
        </div>

        <v-text-field
          mandatory
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Enter your password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
          v-model="password"
        ></v-text-field>

        <div class="d-flex">
          <v-btn
            class="flex-1-0 me-2"
            color="blue"
            size="large"
            variant="tonal"
            @click="login"
          >
            Log In
          </v-btn>

          <v-btn
            class="flex-1-0 ms-2"
            color="success"
            size="large"
            variant="tonal"
            @click="createAccount"
          >
            Create
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/user";

const authStore = useAuthStore();

let valid = ref(false);

let loading = ref(false);

let email = ref("");

const emailRules = [
  (v: string | null) =>
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v || "") ||
    "E-mail must be valid",
];

let password = ref("");

let visible = ref(false);

async function login() {
  loading.value = true;
  await authStore.loginWithEmail(email.value, password.value);
  loading.value = false;
}

async function createAccount() {
  loading.value = true;
  await authStore.createUserWithEmail(email.value, password.value);
  loading.value = false;
}
</script>

<style>
.login {
  width: 100%;
}
</style>
