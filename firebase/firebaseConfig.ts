// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBeSWDzN9gwEmHsf4SJ86HqryinkqeqOxs",
    authDomain: "hg-events-app.firebaseapp.com",
    projectId: "hg-events-app",
    storageBucket: "hg-events-app.appspot.com",
    messagingSenderId: "247924985582",
    appId: "1:247924985582:web:e9cfa8827d804b2ee32dff",
    measurementId: "G-DB28WRM646"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);