<template>
  <div class="share-wrapper">
    <v-dialog v-model="dialog" transition="dialog-bottom-transition" fullscreen>
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          color="secondary"
          icon
          size="large"
          title="Share"
          v-bind="activatorProps"
          ><v-icon icon="mdi-share-variant"></v-icon
        ></v-btn>
      </template>

      <v-card>
        <v-toolbar>
          <v-btn icon="mdi-close" @click="dialog = false"></v-btn>

          <v-toolbar-title>Share with friends</v-toolbar-title>
        </v-toolbar>

        <v-list lines="two" subheader>
          <v-list-subheader>Grant Access</v-list-subheader>
          <v-list-item aria-label="Click to remove user">
            <div>
              <v-text-field
                :loading="loading"
                @keypress.enter="addUser(newUser)"
                v-model="newUser"
                type="email"
                hint="Type in a friend's email to give them access to the list"
                persistent-hint
                ><template #append
                  ><v-btn
                    @click="addUser(newUser)"
                    color="success"
                    :disabled="!newUser"
                    icon="mdi-check"
                  ></v-btn></template
              ></v-text-field>
            </div>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-subheader>Manage Access</v-list-subheader>

          <v-list-item
            aria-label="Click to remove user"
            v-for="(user, i) in listOptions"
          >
            <div class="d-flex align-center pb-3">
              <span class="text-h5">{{ user.email }}</span>
              <v-spacer></v-spacer>
              <v-btn
                color="error"
                class="ms-3"
                title="Remove Access"
                size="small"
                icon
                @click="removeUser(user.email)"
              >
                <v-icon icon="mdi-close"></v-icon>
              </v-btn>
            </div>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/user";
import { useListStore } from "@/stores/list";
import { storeToRefs } from "pinia";
import { addUsersListAccess, removeUsersListAccess } from "@/utils/api";

const dialog = ref(false);
let loading = ref(false);

const newUser = ref("");

const authStore = useAuthStore();
const userEmail = authStore.user.email;

const listsStore = useListStore();

const { list } = storeToRefs(listsStore);

interface UserOption {
  email: string;
}

const listOptions = computed(() => {
  return list.value.access.read
    .filter((user: string) => user !== userEmail)
    .reduce<UserOption[]>((acc: UserOption[], user: string) => {
      acc.push({ email: user });
      return acc;
    }, []);
});

function removeUser(email: string) {
  removeUsersListAccess(list.value.id || "", email);
}

async function addUser(email: string) {
  loading.value = true;
  await addUsersListAccess(list.value.id || "", email);
  newUser.value = "";
  loading.value = false;
}
</script>

<style lang="scss" scoped>
.share-wrapper {
  position: absolute;
  top: 0;
  right: 10px;
  transform: translateY(-50%);
}
</style>
