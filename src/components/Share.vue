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
                :rules="emailRules"
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
                title="Email Link"
                color="primary"
                icon
                size="small"
                :href="user.link"
              >
                <v-icon class="" icon="mdi-email-arrow-right-outline"></v-icon>
              </v-btn>
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
import { emailRules } from "@/utils/validation";

const dialog = ref(false);
let loading = ref(false);

const newUser = ref("");

const authStore = useAuthStore();
const userEmail = authStore.user.email;

const listsStore = useListStore();

const { list } = storeToRefs(listsStore);

interface UserOption {
  email: string;
  link: string;
}

const listOptions = computed(() => {
  return list.value.access.read
    .filter((user: string) => user !== userEmail)
    .reduce<UserOption[]>((acc: UserOption[], user: string) => {
      acc.push({ email: user, link: linkGenerator(user) });
      return acc;
    }, []);
});

function linkGenerator(email: string): string {
  const subject = `Here's my shopping list`;

  const link = `${window.location.origin}?list=${list.value.id}`;

  let incomplete = "";
  let completed = "";

  let total = 0;

  // I would have prefered to do this with a reduce but good lord does typescript make it verbose
  for (let i = 0; i < list.value.items.length; i++) {
    const item = list.value.items[i];
    let parsed = `${item.name}${item.price ? `: £${item.price}` : ""}`;
    if (item.completed) completed += `\n- ${parsed}`;
    else incomplete += `\n- ${parsed}`;

    if (item.price) {
      total += item.price;
      parsed += `: £${item.price}`;
    }
  }

  let listItemsToText = "";

  if (incomplete) {
    incomplete = `Need to buy: ${incomplete}`;
    listItemsToText += incomplete;
  }

  if (completed) {
    completed = `Already bought: ${completed}`;
    listItemsToText += incomplete ? "\n\n" : "" + completed;
  }

  const body = `Hey bud!\n\nHere's a link to my shopping list: ${link}${
    listItemsToText ? `\n\n${listItemsToText}` : ""
  }\n\n${total ? `Total: £${total}` : ""}${
    list.value.limit ? `\nLimit: £${list.value.limit}` : ""
  }\n\nLots of love xoxoxo`;

  const mailto = `mailto:${email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  return mailto;
}

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
