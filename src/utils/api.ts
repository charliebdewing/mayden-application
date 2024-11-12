import { IUser, ShoppingList } from '@/types'
import { Unsubscribe } from 'firebase/auth'
import { collection, doc, getDoc, getFirestore, setDoc, getCountFromServer, query, documentId, where, onSnapshot } from 'firebase/firestore'

let db = getFirestore()

// User
export async function checkUserDataExists(uid: string): Promise<boolean> {
  const snap = await getCountFromServer(query(
    collection(db, 'users'), where(documentId(), '==', uid)
  ))
  return !!snap.data().count
}

export async function createUserData(user: IUser): Promise<void> {
  const userDocRef = doc(collection(db, 'users'), user.uid)
  await setDoc(userDocRef, user)
}

export async function setUserData(user: IUser) {
  const userDocRef = doc(collection(db, 'users'), user.uid)
  await setDoc(userDocRef, user, { merge: true })
}

export async function getUserData(uid: string): Promise<IUser> {
  const userDocRef = doc(collection(db, 'users'), uid)

  try {
    const snapshot = await getDoc(userDocRef)
    const data = snapshot.data() as IUser
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}

// List
export async function createListData(user: IUser): Promise<void> {
  const db = getFirestore()
  const userDocRef = doc(collection(db, 'users'), user.uid)

  const defaultList: ShoppingList = {
    createdBy: user.uid,
    created: new Date(),
    items: [{
      name: '',
      completed: false
    }],
    access: {
      read: [user.email || user.uid],
      write: [user.email || user.uid]
    }
  }

  // Create an empty ref to get the id
  const listDocRef = await doc(collection(db, 'lists'))

  defaultList.id = listDocRef.id

  // Creates a list ref
  await setDoc(listDocRef, defaultList)

  // Adds ref to users list Array
  user.lists = [listDocRef]

  // Sets value on that list ref
  return await setDoc(userDocRef, user, { merge: true })
}

export async function setListData(list: ShoppingList): Promise<void> {
  const db = getFirestore()
  const docRef = doc(collection(db, 'lists'), list.id)
  try {
    return await setDoc(docRef, list)
  } catch (error) {
    console.error(error)
    throw error
  }
}

export function subscribeToList(listId: string, callback: Function, errorCallback: Function): Unsubscribe {
  return onSnapshot(doc(collection(db, 'lists'), listId),
    (doc) => callback(doc.data()),
    (error) => errorCallback(error)
  );
}
