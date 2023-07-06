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
} from 'firebase/firestore'
import {transformUser} from '@/utils/transformer'

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

export const getListOrder = async () => {
  const collectionRef = collection(db, 'orders')
  const docsSnap = await getDocs(collectionRef)

  if (docsSnap.size > 0) {
    const orderList = docsSnap.docs.map(doc => {
      const data = doc.data()
      return {id: doc.id, ...data}
    })
    return orderList
  } else {
  }
}

export const createOrder = async (orderData: any) => {
  const data = {
    customerEmail: 'johndo@example.com',
    customerName: 'John Doe',
    items: [
      {
        itemId: 'item id 5',
        itemName: 'product b',
        itemOptions: [],
        itemPrice: 10.99,
        itemQuantity: 1,
      },
    ],
    paymentMethod: 'credit card',
    shippingAddress: {
      zipCode: '37221',
      city: 'Nashville',
      state: 'TN',
      street: '123 main st',
      country: 'USA',
    },
    status: 'pending',
    timestamp: `${new Date().getTime()}`,
    totalAmount: 50,
  }
  try {
    const collectionRef = collection(db, 'orders')
    const newOrderRef = await addDoc(collectionRef, data)
  } catch (error) {}
}
