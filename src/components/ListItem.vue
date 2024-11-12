<template>
  <v-list-item
    class="mb-2 list-item flex px-md-4 px-2 rounded-pill"
    :class="{ 'item-completed': completed }"
  >
    <v-row dense class="align-center overflow-x-auto flex-1-0">
      <v-col v-if="editable" cols="auto" class="d-flex align-center">
        <v-icon class="handle" aria-label="Drag item">mdi-drag</v-icon>
      </v-col>
      <v-col dense cols="auto" class="d-flex align-center">
        <v-checkbox-btn
          :disabled="!editable"
          aria-label="Check off item"
          class="mx-n2"
          v-model="completed"
        ></v-checkbox-btn>
      </v-col>
      <v-col cols="auto" class="flex-1-1 col-name">
        <v-textarea
          class="name dense"
          autofocus
          variant="underlined"
          :auto-grow="true"
          :rows="1"
          hide-details="auto"
          v-model="name"
          :readonly="!editable"
          placeholder="Item name"
        ></v-textarea>
      </v-col>
      <v-col v-if="editable || price" cols="auto" class="flex col-price">
        <v-text-field
          :readonly="!editable"
          title="Price"
          hide-spin-buttons
          aria-label="Price"
          class="price"
          variant="underlined"
          hide-details="auto"
          v-model.number="price"
          placeholder=""
          type="number"
        >
          <template v-slot:prepend-inner>£</template>
        </v-text-field>
      </v-col>
      <v-col v-if="editable" cols="auto">
        <v-icon
          @click="$emit('delete')"
          class="close-button"
          icon="mdi-close"
          large
          aria-label="Delete item"
        ></v-icon>
      </v-col>
    </v-row>
  </v-list-item>
</template>

<script lang="ts" setup>
import { defineModel, defineEmits } from "vue";

const name = defineModel("name");
const price = defineModel("price");
const completed = defineModel("completed");

const emit = defineEmits(["delete"]);

const { editable } = defineProps({ editable: Boolean });
</script>

<style lang="scss" scoped>
.v-input__details {
  display: none;
}

.list-item {
  transition: opacity 0.2s;

  & .close-button {
    transition: opacity 0.2s;
    opacity: 0;
  }

  &:hover .close-button,
  &:focus-within .close-button {
    opacity: 1;
  }
}

.handle {
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}

.item-completed {
  & .name {
    text-decoration: line-through;
  }

  &:not(:hover) {
    opacity: 0.5;
  }
}

.col-name {
  width: min-content;
}

.col-price .price {
  width: 75px;
}
</style>
