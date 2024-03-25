// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { storage } from "../firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import { signOut } from "firebase/auth";
import useGetCurrentUser from "../hooks/useGetCurrentUser";
import icon from "../assets/editIcon.png";
import doneIcon from "../assets/doneIcon.png";
import deleteIcon from "../assets/deleteIcon.png";
import upload from "../assets/upload.png";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { v4 } from "uuid";

const Home = () => {
  const navigate = useNavigate();
  const [bio, setBio] = useState("");
  const [imgFile, setImgFile] = useState("");
  const [currentImg, setCurrentImg] = useState("");
  const [imageRef, setImageRef] = useState("");
  const inputRef = useRef(null);
  const [bioEditing, setBioEditing] = useState(false);
  const [massage, setMassage] = useState({ state: 0, massage: "" });
  // eslint-disable-next-line no-unused-vars
  const [user, loading, error] = useAuthState(auth);
  const userInfo = useGetCurrentUser();

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleImageChange = (e) => {
    if (e.target.value) {
      setImgFile(e.target.files[0]);
      setImageRef(ref(storage, `${userInfo.email}/${imgFile.name + v4()}`));
      if (userInfo.photo) {
        const deleteImgRef = ref(storage, `${userInfo.email}/`);
        listAll(deleteImgRef).then((response) => {
          response.items.forEach((item) => {
            deleteObject(item).then(async () => {});
          });
        });
      }
      setMassage({ state: 1, massage: "Profile picture is changing" });
      setTimeout(() => {
        const dounloadImgRef = ref(storage, `${userInfo.email}/`);
        listAll(dounloadImgRef).then((response) => {
          response.items.forEach((item) => {
            getDownloadURL(item).then((url) => setCurrentImg(url));
            setTimeout(() => {
              setMassage({ state: 2, massage: "Profile picture changed" });
              setTimeout(() => {
                setMassage({ state: 0, massage: "" });
              }, 2000);
            }, 2000);
          });
        });
      }, 3000);
    }
  };

  const imageDelete = async () => {
    if (userInfo.photo) {
      const sureDelete = confirm(
        "Are you want to delete your profile picture?"
      );
      if (sureDelete) {
        const deleteImgRef = ref(storage, `${userInfo.email}/`);
        listAll(deleteImgRef).then((response) => {
          response.items.forEach((item) => {
            deleteObject(item).then(async () => {
              console.log("Profile picture changed");
              await setDoc(doc(db, "Guests", userInfo.id), {
                ...userInfo,
                photo: false,
              });
            });
          });
        });

        setMassage({ state: 1, massage: "Profile picture is deleting" });
        setTimeout(() => {
          setCurrentImg("");
          setTimeout(() => {
            setMassage({ state: 2, massage: "Profile picture deleted" });
            setTimeout(() => {
              setMassage({ state: 0, massage: "" });
            }, 2000);
          }, 2000);
        }, 3000);
      }
    }
  };

  useEffect(() => {
    if (userInfo) {
      setBio(userInfo.bio);
    }
  }, [userInfo]);

  useEffect(() => {
    const photoChange = async (value) => {
      if (value) {
        await setDoc(doc(db, "Guests", userInfo.id), {
          ...userInfo,
          photo: true,
        });
      }
    };

    if (imageRef) {
      uploadBytes(imageRef, imgFile).then(() => {
        photoChange(true);
      });
    }
    if (userInfo) {
      if (userInfo.photo) {
        const dounloadImgRef = ref(storage, `${userInfo.email}/`);
        listAll(dounloadImgRef).then((response) => {
          response.items.forEach((item) => {
            getDownloadURL(item).then((url) => setCurrentImg(url));
          });
        });
      }
    }
  }, [imageRef, imgFile, userInfo]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        const logout = alert("Are you want to log out for sure?");
        if (logout) {
          navigate("/login");
          console.log("Signed Out");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleUpdateBio = async () => {
    if (bioEditing) {
      setBioEditing(false);
      await setDoc(doc(db, "Guests", userInfo.id), {
        ...userInfo,
        bio: bio,
      });
    } else {
      setBioEditing(true);
    }
  };

  return (
    <div>
      {massage.state == 1 ? (
        <div className="h-6 text-xl bg-yellow-800 mb-10 p-7 rounded-xl flex justify-center items-center">
          {massage.massage}
        </div>
      ) : massage.state == 2 ? (
        <div className="h-6 text-xl bg-green-800 mb-10 p-7 rounded-xl flex justify-center items-center">
          {massage.massage}
        </div>
      ) : (
        <div className="h-6 text-xl bg-[rgb(10, 12, 30)] text-[rgb(10, 12, 30)] mb-10 p-7 rounded-xl flex justify-center items-center"></div>
      )}
      {userInfo ? (
        <div className="flex justify-center items-center">
          <div className="h-[200px] w-[200px] text-center flex justify-center items-center text-9xl bg-[rgb(10, 12, 30)] rounded-full mb-5 border-2 border-sky-500">
            {currentImg ? (
              <div className="h-[194px] w-[196px] overflow-hidden rounded-full text-[16px] ">
                <img src={currentImg}></img>
              </div>
            ) : (
              <div className="hidden"></div>
            )}
            {!currentImg ? (
              <div>{userInfo.name.charAt(0)}</div>
            ) : (
              <div className="hidden"></div>
            )}

            <input
              className="hidden"
              type="file"
              name="file"
              ref={inputRef}
              onChange={handleImageChange}
            />
            <img
              onClick={handleImageClick}
              src={upload}
              alt="icon"
              className="h-7 absolute ml-[170px] mt-[170px]"
            />
            <img
              onClick={imageDelete}
              src={deleteIcon}
              alt="icon"
              className="h-6 absolute ml-[-170px] mt-[170px]"
            />
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="w-[100%] text-center text-sky-100 text-5xl mb-5">
        {userInfo ? `${userInfo.name}` : "Welcome"}
      </div>
      <div className="w-[100%] text-center text-gray-300 text-l mb-5 flex justify-center items-center">
        {userInfo && !bioEditing ? <div className="float-left">{bio}</div> : ""}
        {userInfo && bioEditing ? (
          <input
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="float-left p-2 border box-border w-[300px] rounded-md text-blue-950 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
        ) : (
          ""
        )}
        {userInfo && !bioEditing ? (
          <img
            src={icon}
            alt="icon"
            className="h-5 ml-5"
            onClick={handleUpdateBio}
          />
        ) : (
          ""
        )}
        {userInfo && bioEditing ? (
          <img
            src={doneIcon}
            alt="icon"
            className="h-5 ml-5"
            onClick={handleUpdateBio}
          />
        ) : (
          ""
        )}
      </div>
      <div className="flex flex-col justify-center items-center">
        {userInfo ? (
          <button
            className="bg-blue-900 text-white tounded p-2 mt-5 w-[100px] rounded-lg"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Home;
