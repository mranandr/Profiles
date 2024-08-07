/* eslint-disable default-case */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function Register(props) {
  const options = [
    { value: "", label: "Select Your gender !" },
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
  ];

  const navigate = useNavigate();

  // Register Form
  const [formRegister, setFormRegister] = useState({
    name: "",
    username: "",
    email: "",
    phone_number: "",
    password: "",
    gender: "",
  });
 

  const onChangeForm = (label, event) => {
    switch (label) {
      case "name":
      case "username":
      case "phone_number":
      case "password":
        setFormRegister(prevState => ({
          ...prevState,
          [label]: event.target.value
        }));
        break;
      case "email":
        const emailValidation = /\S+@\S+\.\S+/;
        if (emailValidation.test(event.target.value)) {
          setFormRegister(prevState => ({
            ...prevState,
            email: event.target.value
          }));
        }
        break;
      case "gender":
        setFormRegister(prevState => ({
          ...prevState,
          gender: event.target.value
        }));
        break;
      default:
        break;
    }
  };
  
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
        const response = await axios.post("http://localhost:8000/api/auth/register", formRegister);
        navigate("/?signin");
        toast.success(response.data.detail);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.detail);
    }
};


  return (
    <React.Fragment>
      <div>
        <h1 className="text-3xl font-bold text-center mb-4 cursor-pointer">
          Create An Account
        </h1>
        <p className="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer mx-auto">
          Welcome to profileViewer
        </p>
      </div>
      <form onSubmit={onSubmitHandler}>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none focus:ring focus:outline-none focus:ring-yellow-400"
            onChange={(event) => {
              onChangeForm("name", event);
            }}
          />
          <select
            value={formRegister.gender}
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none focus:ring focus:outline-none focus:ring-yellow-400"
            onChange={(event) => {
              onChangeForm("gender", event);
            }}
          >
            {options.map((data) => {
              if (data.value === "") {
                return (
                  <option key={data.label} value={data.value} disabled>
                    {data.label}
                  </option>
                );
              } else {
                return (
                  <option key={data.label} value={data.value}>
                    {data.label}
                  </option>
                );
              }
            })}
          </select>
          <input
            type="text"
            placeholder="Username"
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none focus:ring focus:outline-none focus:ring-yellow-400"
            onChange={(event) => {
              onChangeForm("username", event);
            }}
          />
          <input
            type="number"
            placeholder="Phone number"
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none focus:ring focus:outline-none focus:ring-yellow-400"
            onChange={(event) => {
              onChangeForm("phone_number", event);
            }}
          />
          <input
            type="email"
            placeholder="Email"
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none focus:ring focus:outline-none focus:ring-yellow-400"
            onChange={(event) => {
              onChangeForm("email", event);
            }}
          />
          <input
            type="password"
            placeholder="Password"
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none focus:ring focus:outline-none focus:ring-yellow-400"
            onChange={(event) => {
              onChangeForm("password", event);
            }}
          />
        </div>
        <div className="text-center mt-6">
          <button
            type="submit"
            className="py-3 w-64 text-xl text-white bg-yellow-400 rounded-2xl hover:bg-yellow-300 active:bg-yellow-500 outline-none"
          >
            Create Account
          </button>
          <p className="mt-4 text-sm">
            Already have an account?{" "}
            <Link
              to="/?signin"
              onClick={() => {
                props.setPage("login");
              }}
            >
              <span className="underline cursor-pointer">Sign In</span>
            </Link>
          </p>
        </div>
      </form>
    </React.Fragment>
  );
}
