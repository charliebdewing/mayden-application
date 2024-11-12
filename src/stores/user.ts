import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { Nullable } from '@/types/base'
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { IUser } from '@/types'

import { getUserData, setUserData, createUserData, createListData } from "@/utils/api";

import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const userStore = ref<Nullable<IUser>>(null)

  const isAuthenticated = computed<boolean>(() => userStore.value !== null)

  function setUserStore(user: Nullable<IUser>) {
    // return early if it's a reset
    if (user === null) {
      userStore.value = null
      return
    }

    userStore.value = user

    return userStore
  }

  async function createUserWithEmail(email: string, password: string) {
    const auth = getAuth()

    try {
      return await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error(error)
      alert(error)
      // location.reload()
    }
  }

  async function loginWithEmail(email: string, password: string) {
    const auth = getAuth()

    try {
      return await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error(error)
      alert(error)
    } finally {
      // Reloading is an easy way to keep the same flow in the router
      location.reload()
    }
  }

  async function logout() {
    await getAuth().signOut()
    setUserStore(null)

    // Return to home and wipe any queries
    router.push({ query: {} })
  }

  function authWatcher(): Promise<boolean> {
    return new Promise((res) => {
      const auth = getAuth()

      onAuthStateChanged(auth, async (user) => {
        if (!user?.uid) {
          setUserStore(null)
        } else {
          const authUser = user

          let userState: IUser = {
            uid: authUser.uid,
            name: authUser.displayName,
            image: authUser.photoURL,
            email: authUser.email
          }

          let userDataFromDB = await getUserData(userState.uid)

          if (userDataFromDB) {
            userState = {
              ...userState,
              ...userDataFromDB
            }
          } else {
            // Creates user account
            await createUserData(userState)

            // Reload because otherwise it's a whole load of flow control
            location.reload()
          }

          await setUserData(userState)

          setUserStore(userState)
        }


        res(!!user)
      })
    })
  }

  return {
    user: userStore,
    isAuthenticated,
    setUserStore,
    createUserWithEmail,
    loginWithEmail,
    logout,
    authWatcher
  }
})
