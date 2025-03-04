import React, { useState, useEffect } from "react";
import headBg from "../assets/images/MiningTop.png";
import polygon from "../assets/images/Polygon.svg";
import Header from "./Header";
import MiningIcon from "../assets/images/miningIcon.png";
import owl from "../assets/images/owlmining.png";
import trophy from "../assets/images/trophyy.png";
import Footer from "./Footer";
import serverBox1 from "../assets/images/Server1.png";
import serverBox2 from "../assets/images/Server.png";
import confetti from "canvas-confetti";

function Mining() {
  const [isFirstVisible, setIsFirstVisible] = useState(true);
  const [count, setCount] = useState(() => {
    return parseInt(localStorage.getItem("owlCount")) || 0;
  });
  const [isAnimating, setIsAnimating] = useState(false);

  const [todaysCount, setTodaysCount] = useState(() => {
    const savedDate = localStorage.getItem("owlLastDate");
    const currentDate = new Date().toISOString().split("T")[0];

    // If the saved date matches today's date, load today's count, otherwise reset
    if (savedDate === currentDate) {
      return parseInt(localStorage.getItem("owlTodaysCount")) || 0;
    } else {
      localStorage.setItem("owlTodaysCount", 0);
      localStorage.setItem("owlLastDate", currentDate);
      return 0;
    }
  });


  const handleOwlClick = () => {
    const newCount = count + 1;
    const newTodaysCount = todaysCount + 1;

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }
    confetti({
      ticks: 200,
      gravity: 1,
      decay: 0.94,
      startVelocity: 30,
      angle: randomInRange(55, 125),
      spread: randomInRange(50, 70),
      particleCount: randomInRange(50, 100),
      scalar: 0.5,
      origin: { y: 0.6 },
      shapes: ["star"],
      colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
    });

    setIsAnimating(true); // 
    // Update total and today's count in state
    setCount(newCount);
    setTodaysCount(newTodaysCount);

    // Save to local storage
    localStorage.setItem("owlCount", newCount);
    localStorage.setItem("owlTodaysCount", newTodaysCount);

    // Save today's date in case it's the first click of the day
    const currentDate = new Date().toISOString().split("T")[0];
    localStorage.setItem("owlLastDate", currentDate);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFirstVisible((prev) => !prev); // Toggle visibility
    }, 500); // Change every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <>
      <div className=" min-h-screen text-white  w-full bg-miningBg bg-cover">
        <div className="relative">
          <img src={headBg} className="absolute top-0 h-24 w-full" alt="" />
          <Header />
          <div className="relative h-14 w-full">
            <div className="flex justify-center">
              <img
                src={polygon}
                className="absolute w-12 bottom-2 animate-spinSlow transition duration-1000 ease-in-out"
                alt=""
              />
            </div>
            <div className="absolute bottom-6 end-5 tracking-tight ">
              <h1 class="text-white text-xs  text-center font-bold italic tracking-wide relative leading-3">
                <span class="block">
                  High<span class="opacity-80">Performance</span>
                </span>
                <span class="block">Global Node</span>
              </h1>
            </div>
          </div>
        </div>
        <div className="my-3 flex justify-center">
          <h1 className="text-4xl text-center font-bold bg-gradient-to-b from-white from-50% to-black inline-block text-transparent bg-clip-text">
            {count}
          </h1>
        </div>
        <div className="my-3 flex justify-center relative overflow-hidden">
          <div className="absolute w-72 -top-1 inset-x-0 m-auto h-12  bg-gradient-to-t from-transparent from-80% via-[#645245] to-transparent blur">
            <div className="flex justify-center items-center ">
              <div className="w-32 h-12 bg-[#645245] blur-[20px] absolute -top-10"></div>
            </div>
          </div>
          <div className="flex justify-between items-center gap-3 z-10 py-1.5">
            <img src={MiningIcon} className="w-5" alt="" />
            <span className="text-yellow-100 text-sm">
              Mining Community Upcoming{" "}
            </span>
            <span className="border border-yellow-100/30 p-3.5 py-1 rounded-full text-yellow-100 font-medium text-md leading-none">
              5X
            </span>
          </div>
        </div>
        <div className="bg-[#192435] mx-8 px-4 py-2 rounded-xl">
          <div className="grid grid-cols-3">
            <div className="leading-none flex flex-col">
              <span className="uppercase text-xs">RTX3080...</span>
              <span className="uppercase text-[10px] text-white/40">
              AGS Machine
              </span>
            </div>
            <div className="leading-none flex flex-col items-center">
              <span className="uppercase text-xs">760M / 2370W</span>
              <span className="uppercase text-[10px] text-white/40">
                49 W/T / 3.91%
              </span>
            </div>
            <div className="flex justify-end items-center">
              <div className="leading-none px-1 py-1  border border-[#2E9987]/10 bg-[#2E9987]/20  rounded-xl w-fit">
                <span className=" text-md leading-none text-[#2E9987]  font-chau">
                  Taps {count}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex justify-center"
          onClick={handleOwlClick} // Add click handler
        >
          <img
            src={owl}
            className={`w-72 cursor-pointer transform transition-transform duration-300 ${
              isAnimating ? "animate-scale" : ""
            }`}
            alt="Owl"
            onAnimationEnd={() => setIsAnimating(false)} // Reset animation state
          />
        </div>
        <div className="flex justify-between relative">
          <div className="bg-[#110E19] mx-4 px-4 py-4 rounded-xl relative z-10 w-full">
            <span className="flex items-center text-xs font-bold  ">
              <span className="flex w-2.5 h-2.5 border border-green-200 bg-green-500 rounded-full me-1.5 flex-shrink-0 capitalize animate-blink"></span>
              Mining Machine Active
            </span>
          </div>
          <img
            src={serverBox1}
            alt=""
            className={`absolute w-24 -top-9 end-2 z-10 transition-opacity duration-500 ${
              isFirstVisible ? "opacity-100" : "opacity-0"
            }`}
          />
          <img
            src={serverBox2}
            alt=""
            className={`absolute w-24 -top-9 end-2 z-10 transition-opacity duration-500 ${
              isFirstVisible ? "opacity-0" : "opacity-100"
            }`}
          />
        </div>
        <div className="w-full bg-gradient-to-t from-[#122C89]/5 from-20% to-[#122C89] mt-4 py-3 pt-0.5 pb-20 rounded-t-[3rem]">
          <p className="text-xs text-center my-2 text-white/60">
            Upgrade your pet and earn more coins
          </p>
          <div className="bg-[#110E19] mx-4 px-4 py-4 rounded-2xl">
            <div className="grid grid-cols-2">
              <div className="flex gap-3">
                <img src={trophy} alt="" className="w-11" />
                <div className="flex flex-col">
                  <span className="text-md">Total Taps</span>
                  <span className="text-2xl font-semibold">{count}</span>
                </div>
              </div>
              <div className="flex flex-col pl-4">
                <span className="text-md">Today Taps</span>
                <span className="text-2xl font-semibold">{todaysCount}</span>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Mining;
