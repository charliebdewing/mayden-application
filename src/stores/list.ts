import { defineStore } from 'pinia'
import { ShoppingList } from '@/types'
import { Nullable } from '@/types/base'

export const useListsStore = defineStore('lists', () => {
  const listStore = ref<Nullable<ShoppingList>>({
    id: 'test',
    items: [
      { name: 'test' }
    ]
  })

  function setListStore(list: Nullable<ShoppingList>) {
    // return early if it's a reset
    if (list === null) {
      listStore.value = null
      return
    }

    listStore.value = list

    return listStore
  }

  return {
    list: listStore,
    setListStore
  }
})
