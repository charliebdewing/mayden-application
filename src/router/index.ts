/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'
import { useAuthStore } from '@/stores/user'
import { useListStore } from '@/stores/list'
import { ShoppingList } from '@/types'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  await authStore.authWatcher()
  const user = authStore.user

  const listsStore = useListStore()
  await listsStore.unsubscribeFromList()

  if (user) {
    // This can be updated in the future to allow for the user to have multiple lists
    let listId = to.query.list || user.lists[0].id

    try {
      await listsStore.listWatcher(listId)
      const listData: ShoppingList = await listsStore.list

      if (!listData?.id) {
        throw Error('No Id found')
      }
    } catch (error) {
      console.error(error)
      alert('You do not have access to this list.')
      next({ name: to.name, params: to.params, query: {} })
      return
    }

    if (!to.query.list) {
      const query = { ...to.query, list: listId }

      next({ name: to.name, params: to.params, query })
      return
    }
  }

  next()
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
