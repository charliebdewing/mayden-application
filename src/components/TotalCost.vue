<template>
  <div class="cost-wrapper mb-2 d-flex flex-column">
    <div class="d-flex align-end">
      <v-spacer></v-spacer>
      <span class="currency-symbol">£</span>
      <span class="text-total" aria-label="Total cost">
        {{ total }}
      </span>
      <span class="slash-divider" aria-hidden>/</span>
      <v-text-field
        density="compact"
        aria-label="Cost limit"
        class="limit"
        variant="underlined"
        hide-details="auto"
        v-model.number="limit"
        hide-spin-buttons
        type="number"
        placeholder="Limit"
        :error="overLimit"
      >
      </v-text-field>
    </div>
    <div>
      <span :style="{ color: '#d64405' }" v-show="overLimit">
        {{ overLimitMessage }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ListItem } from "@/types";
import { defineModel, defineEmits, defineProps, useTemplateRef } from "vue";

const { items = [] } = defineProps({
  items: Array<ListItem>,
});

const limit = defineModel<number>("limit");

const total = computed<number>(() => {
  const total = items.reduce(
    (acc: number, { price = 0 }) => (acc += Number(price)),
    0
  );
  return parseFloat(total.toFixed(2));
});

const overLimit = computed(() => {
  // If a limit is not set then return early
  if (!limit.value) {
    return false;
  }

  return Number(limit.value) < total.value;
});

const overLimitMessage = computed(() => {
  if (!overLimit.value) {
    return "";
  }

  return "You are over your limit!";
});
</script>

<style lang="scss" scoped>
.cost-wrapper {
  align-items: flex-end;
  margin-left: auto;
  flex: 0 1 auto;
}

.limit {
  flex: 0 1 auto;
}

.limit {
  /* for the input text */
  &:deep(.v-field__input),
  &:deep(.v-field__input::placeholder) {
    font-size: 34px;
    line-height: 1;
  }

  &:deep(.v-field__input::placeholder) {
    // font-size: 45px;
    font-size: 34px;
  }

  &:deep(.v-input__prepend) {
    margin-right: 0;
    align-items: flex-end;
  }

  &:deep(.v-field--disabled) {
    opacity: 1;
  }
}

.text-total {
  font-size: 34px;
  line-height: 1;
}

.currency-symbol {
  font-size: 14px;
}

.slash-divider {
  font-size: 34px;
  line-height: 1;
  font-weight: 100;
}
</style>
