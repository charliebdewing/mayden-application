import { defineStore } from 'pinia'
import { ShoppingList } from '@/types'
import { Nullable } from '@/types/base'
import { Unsubscribe } from 'firebase/firestore';
import { setListData, subscribeToList } from "@/utils/api";


export const useListStore = defineStore('list', () => {
  const listStore = ref<Nullable<ShoppingList>>(null)
  let listSub = ref<Nullable<Unsubscribe>>(null)


  async function setListStore(list: Nullable<ShoppingList>) {
    // return early if it's a reset
    if (list === null) {
      listStore.value = null
      return
    }

    listStore.value = list

    await setListData(list)

    return listStore
  }

  function unsubscribeFromList() {
    if (listSub.value) {
      listSub.value()
    } else {
      console.log('No subscriptions')
    }
  }

  function listWatcher(listId: string): Promise<boolean> {
    return new Promise((res) => {
      listSub.value = subscribeToList(
        listId,
        (data: ShoppingList) => {
          setListStore(data)
          res(!!data)
        }
      )
    })
  }

  return {
    list: listStore,
    setListStore,
    listWatcher,
    unsubscribeFromList
  }
})
