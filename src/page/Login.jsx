import { loginWithEmailAndPassword } from "../firebase";
import { NavLink, useNavigate } from "react-router-dom";
import FieldSet from "../components/FieldSet";
import Field from "../components/Field";
import { useForm } from "react-hook-form";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const submitForm = async (formData) => {
    console.log(formData);
    try {
      const response = await loginWithEmailAndPassword(
        formData.email,
        formData.password
      );
      console.log(response);
      navigate("/home");
    } catch (error) {
      console.log(error)
      setError("root.random", {
        message: `Email or Password is incorrect`,
        type: "random",
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center text-white text-center border-2 border-sky-700 p-5 rounded-[10px]">
      <form onSubmit={handleSubmit(submitForm)}>
        <FieldSet label="Enter Login Details">
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
            />
          </Field>
        </FieldSet>
        <div className="text-red-600">{errors?.root?.random?.message}</div>
        <Field>
          <button className="text-md text-white cursor-pointer border rounded-lg bg-blue-700 m-auto mt-5 p-2">
            Login
          </button>
        </Field>
      </form>
      <p className="my-2">
        No Account?{" "}
        <NavLink to="/register" className="underline">
          Register
        </NavLink>
      </p>
    </div>

  );
};

export default Login;
