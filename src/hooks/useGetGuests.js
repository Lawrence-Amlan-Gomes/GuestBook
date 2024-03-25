import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function useGetGuests() {
    const [guestsArr, setGuestsArr] = useState([]);
    const guests = async () => {
        const querySnapshot = await getDocs(collection(db, "Guests"));
        const newGuestArr = [];
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          newGuestArr.push({id: doc.id, ...doc.data()});
          
        });
        setGuestsArr(newGuestArr);
      };
      useEffect(() => {
        guests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      return guestsArr
}

