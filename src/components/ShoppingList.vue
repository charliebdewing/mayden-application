<template>
  <div class="shopping-list flex-1-0">
    <v-card class="py-4">
      <v-list>
        <list-item
          v-for="(item, i) in list.items"
          :editable="editable"
          @delete="deleteItem(index)"
          v-model:completed="item.completed"
          v-model:name="item.name"
          v-model:price.number="item.price"
        >
          {{ item.name }}
        </list-item>
        <add-list-item class="ps-7" @click="addItem"></add-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useListsStore } from "@/stores/list";

const listsStore = useListsStore();
const { list } = storeToRefs(listsStore);

function addItem() {
  const defaultItem = { name: "", completed: false };
  list.value.items.push(defaultItem);
}

function deleteItem(index: number) {
  list.value.items.splice(index, 1);
}
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
