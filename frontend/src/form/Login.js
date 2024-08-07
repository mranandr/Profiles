/* eslint-disable default-case */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function Login(props) {
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const onChangeForm = (event) => {
    const { name, value } = event.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(loginForm);

    try {
      const response = await axios.post("http://localhost:8000/api/auth/login", loginForm, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response);

      // Save token to local storage
      localStorage.setItem("auth_token", response.data.access_token);
      localStorage.setItem("auth_token_type", response.data.token_type);

      // Add success notification
      toast.success(response.data.detail);

      // Reload page after successful login
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      // Add error notification
      console.log(error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.detail);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <React.Fragment>
      <div>
        <h1 className="text-3xl font-bold text-center mb-4 cursor-pointer">
          Welcome to profileViewer
        </h1>
        <p className="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer mx-auto">
          Please login to your account!
        </p>
      </div>
      <form onSubmit={onSubmitHandler}>
        <div className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none focus:ring focus:outline-none focus:ring-yellow-400"
            onChange={onChangeForm}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none focus:ring focus:outline-none focus:ring-yellow-400"
            onChange={onChangeForm}
          />
        </div>
        <div className="text-center mt-6">
          <button
            type="submit"
            className="py-3 w-64 text-xl text-white bg-yellow-400 rounded-2xl hover:bg-yellow-300 active:bg-yellow-500 outline-none"
          >
            Sign In
          </button>
          <p className="mt-4 text-sm">
            You don't have an account?{" "}
            <Link
              to="/?register"
              onClick={() => {
                props.setPage("register");
              }}
            >
              <span className="underline cursor-pointer">Register</span>
            </Link>
          </p>
          <p className="mt-4 text-sm">
           Forgot password{" "}
            <Link
              to="/?forgot"
              onClick={() => {
                props.setPage("forgot");
              }}
            >
              <span className="underline cursor-pointer">forgot password</span>
            </Link>
          </p>
        </div>
      </form>
    </React.Fragment>
  );
}
