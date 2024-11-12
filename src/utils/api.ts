import { IUser } from '@/types'
import { collection, doc, getDoc, getFirestore, setDoc, getCountFromServer, query, documentId, where } from 'firebase/firestore'

let db = getFirestore()

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
