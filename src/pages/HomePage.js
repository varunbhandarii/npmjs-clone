import React from "react";
import "../styles/homePage.css";

const HomePage = () => {
  let title = document.title;
  if (!title.includes(" | Home")) {
    title += " | Home";
    document.title = title;
  }

  return (
    <div className="text-center">
      <div className="bg-hp px-[29%]">
        <h1 className="pt-28 poppins text-[80px] font-semibold text-white leading-[100px] py-14">
          Build amazing things
        </h1>
        <p className="arimo text-white pb-8">
          We're GitHub, the company behind the npm Registry and npm CLI. We
          offer those to the community for free, but our day job is building and
          selling useful tools for developers like you.
        </p>
        <h2 className="text-4xl leading-[45px] pb-8 poppins font-semibold text-white">
          Take your JavaScript development up a notch
        </h2>
        <p className="arimo text-white pb-20">
          Get started today for free, or step up to npm Pro to enjoy a premium
          JavaScript development experience, with features like private
          packages.
        </p>
        <a
          href="/"
          className="bg-[#ffc228] mr-8 font-bold shadow-2xl poppins py-4 px-14 rounded-full"
        >
          Sign up for free
        </a>
        <a
          href="/"
          className="font-bold text-white border-[2.5px] poppins py-4 px-14 rounded-full"
        >
          Learn about Pro
        </a>
        <div className="pt-24"></div>
      </div>
      <div className="border-line px-[32%] pt-16 h-[70vh]">
        <h2 className="text-4xl leading-[45px] pb-8 poppins font-semibold">
          Bring the best of open source to you, your team, and your company
        </h2>
        <p className="arimo pb-20">
          Relied upon by more than 17 million developers worldwide, npm is
          committed to making JavaScript development elegant, productive, and
          safe. The free npm Registry has become the center of JavaScript code
          sharing, and with more than two million packages, the largest software
          registry in the world. Our other tools and services take the Registry,
          and the work you do around it, to the next level.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
