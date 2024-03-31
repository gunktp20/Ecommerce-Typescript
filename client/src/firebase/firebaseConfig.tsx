import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
    apiKey: "AIzaSyCBqHa_104RKKFTMoaIt-XwVhLX1Hc59tc",
    authDomain: "ecommerce-6bddd.firebaseapp.com",
    projectId: "ecommerce-6bddd",
    storageBucket: "ecommerce-6bddd.appspot.com",
    messagingSenderId: "142820176403",
    appId: "1:142820176403:web:a5da396dc67844180545e6",
    measurementId: "G-SL972JNV85"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export { auth , provider}