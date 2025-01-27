"use client";
import React, { useState } from "react";
import { IoCall } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";
import { FaGlobe } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import Image from "next/image";
import Background1 from "../../../../public/company-terms/bg03.png";
import { MdDescription } from "react-icons/md";
import { describe } from "node:test";
import { contactUs } from "@/apis/landing-page";
import { Toast } from "@/components/ui/toast";
import { Header } from "@/components/layout";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setErrorMessage] = useState({
    name: "",
    nameFlag: "",
    email: "",
    emailFlag: "",
    description: "",
    descriptionFlag: "",
  });

  const sendMessage = async () => {
    const body = {
      name: name,
      email: email,
      description: message,
    };
    try {
         const landingPageData = await contactUs(body);
    //   const { data } = await api.post("contactUs", body);
    //   Toast.success("Message sent successfully!");
      // Clear input fields after successful API call
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleEnterPress = async (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const validateEmail = (email: string) => {
    // Basic email validation using regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  const validateName = (name: string) => {
    const inputValue: string = name;
    const regex: RegExp = /^[a-zA-Z]+$/;
    const isValid: boolean = regex.test(inputValue);
    return isValid;
  };

  const handleBlurEvent = async (field: string) => {
    switch (field) {
      case "Name":
        if (!name || name.length === 0) {
          setErrorMessage((prev) => ({
            ...prev,
            ["name"]: "please mention your name",
          }));
          setErrorMessage((prev) => ({
            ...prev,
            ["nameFlag"]: "red",
          }));
        } else if (!validateName(name)) {
          setErrorMessage((prev) => ({
            ...prev,
            ["name"]: "User name cannot have integers or empty spaces",
          }));
          setErrorMessage((prev) => ({
            ...prev,
            ["nameFlag"]: "red",
          }));
        } else {
          setErrorMessage((prev) => ({
            ...prev,
            ["name"]: "",
          }));

          setErrorMessage((prev) => ({
            ...prev,
            ["nameFlag"]: "green",
          }));
        }
        break;

      case "Email":
        if (!email || email.length === 0) {
          setErrorMessage((prev) => ({
            ...prev,
            ["email"]: "please mention your email",
          }));

          setErrorMessage((prev) => ({
            ...prev,
            ["emailFlag"]: "red",
          }));
        } else if (!validateEmail(email)) {
          setErrorMessage((prev) => ({
            ...prev,
            ["email"]: "please provide a valid email address",
          }));

          setErrorMessage((prev) => ({
            ...prev,
            ["emailFlag"]: "red",
          }));
        } else {
          setErrorMessage((prev) => ({
            ...prev,
            ["email"]: "",
          }));

          setErrorMessage((prev) => ({
            ...prev,
            ["emailFlag"]: "green",
          }));
        }
        break;

      case "Description":
        if (!message || message.length === 0) {
          setErrorMessage((prev) => ({
            ...prev,
            ["description"]: "please write description",
          }));

          setErrorMessage((prev) => ({
            ...prev,
            ["descriptionFlag"]: "red",
          }));
        } else {
          setErrorMessage((prev) => ({
            ...prev,
            ["description"]: "",
          }));
          setErrorMessage((prev) => ({
            ...prev,
            ["descriptionFlag"]: "green",
          }));
        }
        break;

      default:
        console.log("condition not available");
        break;
    }
  };

  return (
    <div
      className="bg-white dark:bg-zinc-900"
      style={{
        backgroundImage: 'url("company-terms/background.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "repeat",
        height: "100%",
        width: "100%",
        backgroundColor: "",
      }}
    >
      <head>
        <meta
          name="RewardWale Contact Page | We're Here to Assist You"
          content="Need help with RewardWale? Visit our Contact Us page for support and inquiries. Our team is ready to assist with your questions about rewards, merchant profiles, and more. Contact us now for prompt assistance."
        />
      </head>
      <Header />
      {/* <div className="absolute  max-md:hidden">
        <Image
          src={Background1}
          alt="background"
          className="bg-[#F7F7F7] dark:bg-zinc-900 w-screen max-lg:h-screen"
        />
        <div className="absolute w-full">
          <Footer />
        </div>
      </div> */}
      <section
        className=" bg-white dark:bg-zinc-900
       max-md:min-h-screen 
       xl:min-h-screen border rounded-lg flex md:justify-center 
      dark:border-gray-900  dark:shadow-black
      md:my-10 md:mx-16 lg:mx-40 md:inset-x-0 shadow-lg shadow-violet-200
       text-neutral-700"
      >
        <div className="flex-col justify-start 4k:justify-evenly items-center gap-7 inline-flex p-7 2xl:max-w-4xl 4k:max-w-6xl">
          <div className="flex-col justify-start gap-2.5 inline-flex pt-7 md:p-7">
            <h1 className="text-neutral-700 dark:text-stone-300 text-xl 2xl:text-2xl 4k:text-5xl font-semibold md:text-center">
              <span className="text-violet-500 font-bold md:text-neutral-700 dark:md:text-stone-300 md:font-semibold">
                Contact
              </span>{" "}
              Us
            </h1>
            <p className="text-neutral-700 dark:text-stone-300 text-xs sm:text-sm 2xl:text-lg 4k:text-4xl text-center">
              Still in disbelief about what you read? Please reach out and let
              us amaze you!
            </p>
          </div>
          <div className="grid grid-cols-2 gap-7 4k:h-[40em] 4k:w-[90em] justify-center max-md:hidden ">
            <a
              href="tel:+918071176648"
              className="cursor-pointer flex items-center 4k:gap-5 gap-3 p-5 rounded-lg shadow-lg shadow-violet-200 dark:shadow-black"
            >
              <div className="w-16 h-16 4k:w-20 4k:h-20 relative">
                <div className="w-16 h-16 4k:w-20 4k:h-20 absolute bg-pink-200 rounded-full" />
                <div className="left-[13px] top-[13px] 4k:left-[18px] 4k:top-[18px] absolute">
                  <IoCall className="w-9 h-9 4k:w-11 4k:h-11 text-[#A844D8]" />
                </div>
              </div>
              <div className="flex flex-col justify-center items-start gap-1.5 4k:gap-3  dark:text-stone-300">
                <h3 className="font-semibold 2xl:text-xl 4k:text-5xl">Call</h3>
                <p className="text-sm 2xl:text-lg 4k:text-3xl">
                  +91 8071176648
                </p>
              </div>
            </a>
            <a
              href="mailto:contact@rewardwale.com"
              className="flex items-center gap-3 p-5 rounded-lg shadow-lg shadow-violet-200 dark:shadow-black"
            >
              <div className="w-16 h-16 4k:w-20 4k:h-20 relative">
                <div className="w-16 h-16 4k:w-20 4k:h-20 absolute bg-pink-200 rounded-full" />
                <div className="left-[13px] top-[13px] 4k:left-[18px] 4k:top-[18px] absolute">
                  <IoIosMail className="w-9 h-9 4k:w-11 4k:h-11 text-[#A844D8]" />
                </div>
              </div>
              <div className="flex flex-col justify-center items-start gap-1.5 4k:gap-3  dark:text-stone-300">
                <h3 className="font-semibold 2xl:text-xl 4k:text-5xl">Mail</h3>
                {/* <p className="text-sm 2xl:text-lg">customer.support@rewardwale.com</p> */}
                <p className="text-sm 2xl:text-lg 4k:text-3xl">
                  {" "}
                  contact@rewardwale.com
                </p>
              </div>
            </a>
            <div className="flex items-center 4k:gap-8 gap-3 p-5 rounded-lg shadow-lg  shadow-violet-200 dark:shadow-black">
              <div className="w-16 h-16 4k:w-20 4k:h-20 relative">
                <div className="w-16 h-16 4k:w-20 4k:h-20 absolute bg-pink-200 rounded-full" />
                <div className="left-[13px] top-[13px] 4k:left-[18px] 4k:top-[18px] absolute">
                  <FaLocationDot className="w-9 h-9 4k:w-11 4k:h-11 text-[#A844D8]" />
                </div>
              </div>
              <div className="flex flex-col justify-center items-start gap-1.5 4k:gap-3  dark:text-stone-300">
                <h3 className="font-semibold 2xl:text-xl 4k:text-5xl">
                  Registered Office
                </h3>
                <div className="text-xs 2xl:text-lg 4k:text-3xl">
                  <p>MSVP Innovations Private Limited</p>
                  <p>Columbia, A-806, Casa Rio Kalyan Shil Road,</p>
                  <p>Manpada, Kalyan,</p>
                  <p>Thane- 421204, Maharashtra</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-5 rounded-lg shadow-lg shadow-violet-200 dark:shadow-black">
              <div className="w-16 h-16 4k:w-20 4k:h-20 relative">
                <div className="w-16 h-16 4k:w-20 4k:h-20 absolute bg-pink-200 rounded-full" />
                <div className="left-[13px] top-[13px] 4k:left-[18px] 4k:top-[18px] absolute">
                  <FaLocationDot className="w-9 h-9 4k:w-11 4k:h-11 text-[#A844D8]" />
                </div>
              </div>
              <div className="flex flex-col justify-center items-start gap-1.5 4k:gap-3  p-5 dark:text-stone-300">
                <h3 className="font-semibold 2xl:text-xl 4k:text-5xl">
                  Location
                </h3>
                <div className="text-xs 2xl:text-lg 4k:text-3xl">
                  <p>MSVP Innovations Private Limited</p>
                  <p>#E12, 630, Innovation Park, Arekere Gate,</p>
                  <p>Bannerghatta Rd, Bengaluru,</p>
                  <p>Karnataka 560076, India</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 md:hidden">
            <a href="tel:+918071176648" className="flex gap-3 items-center">
              <div className="w-5 h-5 relative">
                <div className="w-5 h-5 left-0 top-0 absolute bg-violet-50 rounded-full" />
                <div className="left-[4.37px] top-[4.36px] absolute">
                  <IoCall className="w-3 h-3 text-violet-500" />
                </div>
              </div>
              <div className="text-neutral-700 dark:text-stone-300">
                <h1 className="text-xs font-semibold">Call</h1>
                <p className="text-xs font-normal">+91 8071176648</p>
              </div>
            </a>
            <a
              href="mailto:contact@rewardwale.com"
              className="flex gap-3 items-center "
            >
              <div className="w-5 h-5 relative">
                <div className="w-5 h-5 left-0 top-0 absolute bg-violet-50 rounded-full" />
                <div className="left-[4.37px] top-[4.36px] absolute">
                  <IoIosMail className="w-3 h-3 text-violet-500" />
                </div>
              </div>
              <div className="text-neutral-700 dark:text-stone-300">
                <h1 className="text-xs font-semibold">Mail</h1>
                <p className="text-xs font-normal">
                  customer.support@rewardwale.com
                </p>
              </div>
            </a>
            <div className="flex gap-3">
              <div className="w-5 h-5 relative">
                <div className="w-5 h-5 left-0 top-0 absolute bg-violet-50 rounded-full" />
                <div className="left-[4.37px] top-[4.36px] absolute">
                  <FaLocationDot className="w-3 h-3 text-violet-500" />
                </div>
              </div>
              <div className="text-neutral-700 dark:text-stone-300">
                <h1 className="text-xs font-semibold">Registered Office</h1>
                <div className="text-xs">
                  <p>MSVP Innovations Private Limited</p>
                  <p>Columbia, A-806, Casa Rio Kalyan Shil Road,</p>
                  <p>Manpada, Kalyan,</p>
                  <p>Thane- 421204, Maharashtra</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-5 h-5 relative">
                <div className="w-5 h-5 left-0 top-0 absolute bg-violet-50 rounded-full" />
                <div className="left-[4.37px] top-[4.36px] absolute">
                  <FaLocationDot className="w-3 h-3 text-violet-500" />
                </div>
              </div>
              <div className="flex flex-col justify-center items-start gap-1 text-neutral-700 dark:text-stone-300">
                <h1 className="text-xs font-semibold">Location</h1>
                <div className="text-xs">
                  <p>MSVP Innovations Private Limited</p>
                  <p>630,DHI Innovation Park, Arekere Gate,</p>
                  <p>Bannerghatta Rd, Bengaluru,</p>
                  <p>Karnataka 560076, India</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col  4k:w-[90em] 4k:gap-4 gap-2">
            <div className="grid grid-cols-2 gap-2.5 4k:gap-10 md:gap-7">
              <div className="4k:py-4">
                <input
                  className="shadow-sm bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light 4k:text-4xl 4k:p-6"
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => handleBlurEvent("Name")}
                />
                <div
                  className={`text-xs 4k:text-2xl pl-2 text-${error.nameFlag}-500 h-4`}
                >
                  {error.name}
                </div>
              </div>
              <div className="4k:py-4">
                <input
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light  4k:text-4xl 4k:p-6"
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlurEvent("Email")}
                />
                <div
                  className={`text-xs 4k:text-2xl pl-2 text-${error.emailFlag}-500 h-4`}
                >
                  {error.email}
                </div>
              </div>
            </div>
            <div className="4k:py-4">
              <textarea
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light  4k:text-4xl 4k:p-6"
                rows={4}
                placeholder="Description"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleEnterPress}
                onBlur={() => handleBlurEvent("Description")}
              ></textarea>
              <div
                className={`text-xs 4k:text-2xl pl-2 text-${error.descriptionFlag}-500 h-4`}
              >
                {error.description}
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center">
            {/* <button
              className="px-6 py-2 font-semibold tracking-wide text-white capitalize
               bg-gradient-to-r from-[#D64ACF] via-[#A844D8] to-[#883FDE] rounded-lg"
              onClick={sendMessage}
              disabled={
                (error.descriptionFlag != "green" &&
                  error.emailFlag != "green" &&
                  error.nameFlag != "green") ||
                (message.trim().length === 0 &&
                  email.trim().length === 0 &&
                  name.trim().length === 0)
              }
            >
              Send message
            </button> */}

            <button
              className="group relative  px-6 py-2  4k:px-10 4k:py-5
              font-semibold tracking-wide max-md:w-full
               text-white capitalize bg-gradient-to-r 
               from-[#D64ACF] via-[#A844D8] to-[#883FDE]
                rounded-lg transition-all duration-300 ease-out
               hover:bg-gradient-to-r overflow-hidden
               active:shadow-sm active:shadow-purple-950
                  active:from-[#9e3799] active:via-[#763097] active:to-[#612c9c]  
                  disabled:opacity-40
                   disabled:transition-none  
                   disabled:duration-0
                   disabled:shadow-none
                 disabled:from-[#D64ACF] disabled:via-[#A844D8] disabled:to-[#883FDE]
                 "
              onClick={sendMessage}
              disabled={
                error.descriptionFlag != "green" ||
                error.emailFlag != "green" ||
                error.nameFlag != "green" ||
                (message.trim().length === 0 &&
                  email.trim().length === 0 &&
                  name.trim().length === 0)
              }
            >
              <span
                className={`ease absolute right-0 -mt-12 h-32 w-8 
                  translate-x-12 rotate-12 transform
                   bg-white opacity-50
                   transition-all 
                  duration-500 group-hover:-translate-x-40 
                  
                  max-sm:group-hover:-translate-x-[100vw]
                    max-md:group-hover:-translate-x-[70vw]
                    md:group-hover:-translate-x-[80vw]
                      lg:group-hover:-translate-x-[30vw]

                  ${
                    (error.descriptionFlag != "green" ||
                      error.emailFlag != "green" ||
                      error.nameFlag != "green" ||
                      (message.trim().length === 0 &&
                        email.trim().length === 0 &&
                        name.trim().length === 0)) &&
                    " transition-none opacity-100 "
                  }
                 
                  `}
              ></span>
              <span className="relative 4k:text-4xl"> Send message</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
