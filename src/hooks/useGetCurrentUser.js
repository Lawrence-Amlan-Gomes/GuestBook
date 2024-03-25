import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import useGetGuests from "../hooks/useGetGuests";

export default function useGetCurrentUser() {
    const [userInfo, setUserInfo] = useState();
    
    const [user] = useAuthState(auth);
    
    const guestsArr = useGetGuests();

    useEffect(() => {
        guestsArr.map((guest) => {
          if (user.email === guest.email) {
            setUserInfo(guest);
          }
        });
      }, [guestsArr, user.email]);
      
    

    return userInfo

    
    
}