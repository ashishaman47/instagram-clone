import firebase from 'firebase';

//initializing the app
const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyAYT904sAdK8t-ihZ_t2JOGxban0l8WIK8',
  authDomain: 'instagram-clone-45f4b.firebaseapp.com',
  databaseURL: 'https://instagram-clone-45f4b.firebaseio.com',
  projectId: 'instagram-clone-45f4b',
  storageBucket: 'instagram-clone-45f4b.appspot.com',
  messagingSenderId: '736125979504',
  appId: '1:736125979504:web:134f3c819e2c4b46179db5',
  measurementId: 'G-712LGL8169',
});

//access to db
const db = firebase.firestore();
//access to authentication --> login,logout,create user
const auth = firebase.auth();
//how can we upload bunch of pictures to firebase and store in DB
const storage = firebase.storage();

export { db, auth, storage };
