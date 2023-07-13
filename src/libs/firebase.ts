import {initializeApp} from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  getDoc,
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  updateDoc,
  query,
  orderBy,
  limit,
  deleteDoc,
  setDoc,
} from 'firebase/firestore'
import {transformUser} from '@/utils/transformer'
import {TOrderPayload} from './types'

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

/*********************************************
   users collection
**********************************************/
export const getUserProfile = async (userId: string) => {
  const docRef = doc(db, 'users', userId)
  const userSnap = await getDoc(docRef)

  if (userSnap.exists()) {
    return userSnap.data()
  } else {
    return undefined
  }
}
export const updateUserProfile = async (userId: string, profile: any) => {
  try {
    const docRef = doc(db, 'users', userId)
    await updateDoc(docRef, profile)
    return true
  } catch (error) {
    return false
  }
}

/*********************************************
   AUTH
**********************************************/
export const loginWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    )
    const user = userCredential.user
    user.getIdToken()
    const profile = await getUserProfile(user.uid)
    return transformUser(user, profile)
  } catch (error) {
    console.log('error login => ', error)
    return null
  }
}

export const SignupWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    )
    const user = userCredential.user
    return user
  } catch (error) {
    return null
  }
}

export const Logout = async () => {
  return await signOut(auth)
    .then(() => {
      return true
    })
    .catch(error => {
      return false
    })
}

/*********************************************
   orders collection
**********************************************/
export const getOrder = async (orderId: string, onGetData: any) => {
  const docRef = doc(db, 'orders', orderId)

  const unsubscribe = onSnapshot(docRef, docSnap => {
    if (docSnap.exists()) {
      onGetData(docSnap.data())
      console.log('Document data:', docSnap.data())
    } else {
      console.log('No such document!')
    }
  })

  return unsubscribe
}

export const getListOrder = async ({queryKey}: any) => {
  const [_key, {order: queryOrder, orderBy: queryOrderBy}] = queryKey
  const collectionRef = collection(db, 'orders')
  const formatQueryOrderBy = (name: string | undefined) => {
    if (name === 'customer') {
      return 'customerName'
    } else if (name === 'order') {
      return 'Document ID'
    } else if (name === 'date') {
      return 'timestamp'
    } else if (name === 'quantity') {
      return 'totalQuantity'
    } else if (name === 'total') {
      return 'totalAmount'
    } else if (name === 'status') {
      return 'status'
    } else {
      return 'customerName'
    }
  }
  const q = query(
    collectionRef,
    orderBy(formatQueryOrderBy(queryOrderBy), queryOrder),
    limit(100),
  )

  const orderList: any[] = []
  try {
    // Execute the query
    const querySnapshot = await getDocs(q)

    // Process the query results
    querySnapshot.forEach(doc => {
      const data = doc.data()
      orderList.push({id: doc.id, ...data})
    })
    return orderList
  } catch (error) {
    console.log('Error getting documents:', error)
    return orderList
  }
}

export const createOrder = async (orderData: TOrderPayload) => {
  if (!orderData) return

  try {
    const collectionRef = collection(db, 'orders')
    const newOrderRef = await addDoc(collectionRef, orderData)
    return newOrderRef.id
  } catch (error) {
    return null
  }
}
export const deleteOrder = async (orderId: string) => {
  try {
    const collectionRef = collection(db, 'orders')
    const documentRef = doc(collectionRef, orderId)
    await deleteDoc(documentRef)
    return true
  } catch (error) {
    return false
  }
}
export const updateOrder = async (orderId: string, fields: any) => {
  try {
    const collectionRef = collection(db, 'orders')
    const documentRef = doc(collectionRef, orderId)
    const result = await setDoc(documentRef, fields, {merge: true})
    console.log('updateOrder => ', result)
    return true
  } catch (error) {
    return false
  }
}
