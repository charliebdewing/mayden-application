<template>
  <div class="shopping-list flex-1-0">
    <v-card class="py-4">
      <v-list>
        <draggable
          :disabled="!editable"
          :component-data="{ tag: 'list-item' }"
          v-model="list.items"
          :animation="200"
          ghost-class="ghost"
          handle=".handle"
          item-key="index"
        >
          <template #item="{ element, index }">
            <list-item
              :editable="editable"
              @delete="deleteItem(index)"
              v-model:completed="element.completed"
              v-model:name="element.name"
              v-model:price.number="element.price"
            >
            </list-item>
          </template>
        </draggable>
        <add-list-item
          v-if="editable"
          class="ps-7"
          @click="addItem"
        ></add-list-item>
      </v-list>

      <TotalCost
        class="me-10"
        :editable="editable"
        :items="list.items"
        v-model:limit.number="list.limit"
      ></TotalCost>

      <Share v-if="editable"></Share>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/user";
import { useListStore } from "@/stores/list";
import draggable from "vuedraggable/dist/vuedraggable.common";
import { ShoppingList } from "@/types/index";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const listStore = useListStore();
const { list } = storeToRefs(listStore);

const editable = list.value.access.write.includes(user.value.email);

function addItem() {
  const defaultItem = { name: "", completed: false };
  list.value.items.push(defaultItem);
}

function deleteItem(index: number) {
  list.value.items.splice(index, 1);
}

watch(
  list,
  async (newList: ShoppingList) => {
    await listStore.setListStore(newList);
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.shopping-list {
  width: 100%;

  & > .v-card {
    position: relative;
    overflow: visible;
  }
}

.ghost {
  opacity: 0.75;
}
</style>
