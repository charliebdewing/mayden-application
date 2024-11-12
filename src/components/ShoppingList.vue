<template>
  <div class="shopping-list flex-1-0">
    <v-card class="py-4">
      <v-list>
        <draggable
          :component-data="{ tag: 'list-item' }"
          v-model="list.items"
          :animation="200"
          ghost-class="ghost"
          handle=".handle"
          item-key="index"
        >
          <template #item="{ element, index }">
            <list-item
              @delete="deleteItem(index)"
              v-model:completed="element.completed"
              v-model:name="element.name"
              v-model:price.number="element.price"
            >
            </list-item>
          </template>
        </draggable>
        <add-list-item class="ps-7" @click="addItem"></add-list-item>
      </v-list>

      <TotalCost
        class="me-10"
        :items="list.items"
        v-model:limit.number="list.limit"
      ></TotalCost>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useListsStore } from "@/stores/list";
import draggable from "vuedraggable/dist/vuedraggable.common";

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
