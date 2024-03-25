import { registerWithEmailAndPassword, db } from "../firebase";
import { NavLink, useNavigate } from "react-router-dom";
import FieldSet from "../components/FieldSet";
import Field from "../components/Field";
import { useForm } from "react-hook-form";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";

const Register = () => {
  const [isTyping, setIsTyping] = useState(false);

  const typing = () => {
    setIsTyping(true);
  };

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const submitForm = async (formData) => {
    const sureSubmit = confirm(
      "You can set your name only once. Are you sure to Register?"
    );
    if (sureSubmit) {
      try {
        const response = await registerWithEmailAndPassword(
          formData.email,
          formData.password
        );
        await addDoc(collection(db, "Guests"), {
          name: formData.name,
          email: formData.email,
          photo: false,
          bio: "add your bio",
        });
        console.log(response);
        navigate("/login");
      } catch (error) {
        setError("root.random", {
          message: `This email is taken`,
          type: "random",
        });
      }
    }
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col justify-center items-center text-white text-center border-2 border-sky-700 p-5 rounded-[10px]">
      <form onSubmit={handleSubmit(submitForm)}>
        <FieldSet label="Enter Registration Details">
          <Field label="Name" error={errors.name}>
            <input
              {...register("name", { required: "Name is required." })}
              className={`p-2 border box-border w-[300px] rounded-md text-blue-950 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${
                !errors.name ? "border-gray-200" : "border-red-500"
              }`}
              type="name"
              name="name"
              id="name"
              placeholder="Enter name address"
              onChange={typing}
            />
          </Field>
          <Field label="Email" error={errors.email}>
            <input
              {...register("email", { required: "Email is required." })}
              className={`p-2 border box-border w-[300px] rounded-md text-blue-950 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${
                !errors.email ? "border-gray-200" : "border-red-500"
              }`}
              type="email"
              name="email"
              id="email"
              placeholder="Enter email address"
              onChange={typing}
            />
          </Field>
          <Field label="Password" error={errors.password}>
            <input
              {...register("password", {
                required: "Password is required.",
                minLength: {
                  value: 8,
                  message: "Your password must be at least 8 characters.",
                },
              })}
              className={`p-2 border box-border w-[300px] rounded-md text-blue-950 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${
                !errors.password ? "border-gray-200" : "border-red-500"
              }`}
              type="password"
              name="password"
              id="password"
              placeholder="Enter Password"
              onChange={typing}
            />
          </Field>
        </FieldSet>
        {!isTyping ? (
          <div className="text-red-700">{errors?.root?.random?.message}</div>
        ) : (
          <></>
        )}
        <Field>
          <button className="text-md text-white cursor-pointer border rounded-lg bg-blue-700 m-auto mt-5 p-2">
            Register
          </button>
        </Field>
      </form>
      <p className="my-2">
        Already Have An Account?{" "}
        <NavLink to="/login" className="underline">
          Login
        </NavLink>
      </p>
    </div>
  );
};

export default Register;
