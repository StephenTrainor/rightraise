import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { db } from "../../../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  events: {
    async signIn(message) {
      const newUserProfile = message.profile
      const newUserEmailAddress = newUserProfile.email;
      const querySnapshot = await getDocs(collection(db, "users"));

      var userIsNotNew = false;

      querySnapshot.forEach((doc) => {
        if (doc.data().emailAddress === newUserEmailAddress) {
          userIsNotNew = true;
        }
      })

      if (!userIsNotNew) {
        try {
          const docRef = await addDoc(collection(db, "users"), {
            emailAddress: newUserProfile.email,
            fullName: newUserProfile.name,
            projectsJoined: [],
            projectsOwned: [],
          });
          // console.log(docRef.id);
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
}

export default NextAuth(authOptions);
