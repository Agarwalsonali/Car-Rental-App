import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppContext } from "../context/AppContext";

const Login = () => {
  const { setShowLogin, axios, setToken, nav } = useAppContext();

  const [mode, setMode] = React.useState("login"); // "login" | "register"
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload =
        mode === "register"
          ? { firstName, lastName, email, password }
          : { email, password };

      const { data } = await axios.post(`/api/user/${mode}`, payload);

      if (data?.success) {
        // store token and navigate
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setShowLogin(false);
        nav("/");
        resetForm();
        toast.success(data.message ?? `${mode === "register" ? "Registered" : "Logged in"} successfully`);
      } else {
        toast.error(data?.message ?? "Something went wrong");
      }
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        "An unexpected error occurred";
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center text-sm text-gray-600 bg-black/50"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">User</span>{" "}
          {mode === "login" ? "Login" : "Sign Up"}
        </p>

        {mode === "register" && (
          <div className="w-full">
            <p>Firstname</p>
            <input
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="text"
              required
            />
            <div className="w-full mt-5">
              <p>Lastname</p>
              <input
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                placeholder="type here"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                type="text"
                required
              />
            </div>
          </div>
        )}

        <div className="w-full ">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="email"
            required
          />
        </div>

        <div className="w-full ">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="password"
            required
          />
        </div>

        {mode === "register" ? (
          <p>
            Already have account?{" "}
            <span
              onClick={() => setMode("login")}
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        ) : (
          <p>
            Create an account?{" "}
            <span
              onClick={() => setMode("register")}
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={`bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md ${
            submitting ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {submitting
            ? mode === "register"
              ? "Creating..."
              : "Logging in..."
            : mode === "register"
            ? "Create Account"
            : "Login"}
        </button>
      </form>

      <ToastContainer position="top-right" />
    </div>
  );
};

export default Login;
