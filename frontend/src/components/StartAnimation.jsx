import React, { useState, useEffect } from "react";
import Typewriter from "typewriter-effect";
import "./spinner.css";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Header from "./Header";
import { useHistory } from "react-router-dom";

const botTasks = [
  "Bot Software Installation",
  "AI Model Training",
  "Security Patch Update",
  "Cloud Synchronization",
  "Performance Optimization"
];

function StartAnimation() {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [currentTask, setCurrentTask] = useState(0);
  const history = useHistory(); // Using useHistory for navigation

  const x = useMotionValue(0);
  const width = useTransform(x, [0, 300 - 60], [300, 60]);
  const opacity = useTransform(x, [0, 300 - 60], [1, 0]);
  const rotate = useTransform(x, [0, 300 - 60], [-90, 0]);
  const dashOffset = useTransform(x, [0, 300 - 60], [192, 202]);
  const offsetX = useTransform(x, [0, 300 - 60], [0, -3]);
  const offsetY = useTransform(x, [0, 300 - 60], [0, 3]);

  useEffect(() => {
    if (currentTask < botTasks.length) {
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, currentTask]);
        setCurrentTask(currentTask + 1); // Move to next task
      }, 3000 * (currentTask + 1)); // 4s delay for each spinner
    } else {
      // If all tasks are completed, redirect to the dashboard page
      history.push("/dashboard"); // Navigates to the dashboard
    }
  }, [currentTask, history]);

  return (
    <>
      <div className="animation-font min-h-screen  bg-cover bg-center bg-[url('https://unsplash.it/1800/800?image=893')] text-white">
        <div class="absolute top-0 left-0 w-full h-full bg-[rgba(17,17,17,0.9)] z-0"></div>
        <Header />
        <div className="flex justify-center items-center relative ">
          <div className="flex flex-col justify-evenly gap-9 h-screen text-white">
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString("Top, We are connecting your bot.")
                  .pauseFor(1000) // Pause after typing
                  .start(); // Start the animation
              }}
            />
            <div className="container">
              {botTasks.map((task, index) => (
                <div key={index} className="flex-container w-full">
                  <div className="start-bot">
                    {completedSteps.includes(index) ? (
                      <div className="checkmark-icon">✔</div>
                    ) : (
                      <div className="spinner spinning"></div>
                    )}
                  </div>
                  <span className="mast__text">{task}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center ">
              <div className="swipercontainer">
                <motion.div
                  className="thumb"
                  drag="x"
                  dragConstraints={{ left: 0, right: 300 - 60 }}
                  dragSnapToOrigin
                  dragElastic={0.01}
                  style={{ x }}
                >
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    fill="none"
                    style={{
                      rotate,
                      position: "relative",
                      top: offsetY,
                      left: offsetX
                    }}
                  >
                    <motion.path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      strokeDasharray={100}
                      strokeDashoffset={dashOffset}
                      d="M23 4L17.5 9.5L12 15L7 10"
                    />
                  </motion.svg>
                </motion.div>

                <motion.div className="slider" style={{ width }}>
                  <motion.div className="slider-text" style={{ opacity }}>
                    Start Staking
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StartAnimation;
