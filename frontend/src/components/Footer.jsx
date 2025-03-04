// import React from 'react'
import { Link, useLocation } from "react-router-dom";
// import "./footer.css"
import coin from "../assets/coinAnimation.png";
import owl from "../assets/images/owl_8405589.svg";

function Footer() {
  const location = useLocation();
  return (
    <section
      id="bottom-navigation"
      className=" fixed inset-x-0 bottom-2 z-10 bg-footer rounded-2xl  p-1 mx-3 w-[95%]"
    >
      <div id="tabs" className="flex justify-between">
        <Link
          to="/dashboard"
          className={`${
            location.pathname === "/dashboard"
              ? "bg-footerMenu rounded-2xl transition-all duration-300 active"
              : ""
          } rounded-2xl w-full justify-center text-center flex flex-col items-center py-1`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`${
              location.pathname === "/dashboard"
                ? "w-7 fill-primary filter-filterGlow animate-glow"
                : "w-7"
            }`}
            viewBox="0 0 1024 1024"
          >
            <path
              className={`${
                location.pathname === "/dashboard"
                  ? "fill-primary animate-glow"
                  : "w-7 fill-white"
              }`}
              d="M946.5 505L534.6 93.4a31.93 31.93 0 0 0-45.2 0L77.5 505c-12 12-18.8 28.3-18.8 45.3c0 35.3 28.7 64 64 64h43.4V908c0 17.7 14.3 32 32 32H448V716h112v224h265.9c17.7 0 32-14.3 32-32V614.3h43.4c17 0 33.3-6.7 45.3-18.8c24.9-25 24.9-65.5-.1-90.5"
            ></path>
          </svg>

          <span
            className={`${
              location.pathname === "/dashboard"
                ? "text-primary animate-glow text-shadow-greenGlow"
                : "text-white"
            } tab tab-home block text-[12px]`}
          >
            Home
          </span>
        </Link>
        <Link
          to="/Withdrawal"
          className={`w-full   justify-center  flex flex-col items-center text-center py-1 ${
            location.pathname === "/Withdrawal"
              ? "bg-footerMenu  rounded-2xl transition-all duration-300 "
              : "text-white"
          } rounded-2xl `}
        >
          <img src={coin} className="w-8 " alt="" />

          <span
            className={`${
              location.pathname === "/Withdrawal"
                ? "text-primary text-shadow-greenGlow"
                : "text-white"
            } tab tab-home block text-[12px] `}
          >
            Withdrawal
          </span>
        </Link>

        <Link
          to="/mining"
          className={`w-full  hidden  justify-center  flex flex-col items-center text-center py-1 ${
            location.pathname === "/mining"
              ? "bg-footerMenu rounded-2xl transition-all duration-300 "
              : "text-white"
          } rounded-2xl `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            id="Capa_1"
            x="0px"
            y="0px"
            className={`${
              location.pathname === "/mining"
                ? "w-6 stroke-primary filter-filterGlow animate-glow"
                : "w-6 fill-white"
            }`}
            viewBox="0 0 512 512"
            style={{ enableBackground: "new 0 0 512 512" }}
          >
            <g>
              <g>
                <path
                  style={{
                    fill: "none",
                    stroke: "#ffffff",
                    strokeWidth: 30,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeMiterlimit: 10
                  }}
                  d="M477.788,211.331v0.228c0,123.349-77.332,233.458-193.362,275.317L256.362,497l-28.501-10.249c-116.178-41.776-193.648-151.96-193.648-275.42v0"
                />
                <path
                  style={{
                    fill: "none",
                    stroke: "#ffffff",
                    strokeWidth: 30,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeMiterlimit: 10
                  }}
                  d="M277.556,299.477c20.949,15.914,47.078,25.36,75.416,25.36c68.934,0,124.815-55.882,124.815-124.815c0-40.985-19.754-77.356-50.261-100.112"
                />
                <path
                  style={{
                    fill: "none",
                    stroke: "#ffffff",
                    strokeWidth: 30,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeMiterlimit: 10
                  }}
                  d="M84.467,99.914c-30.503,22.756-50.255,59.125-50.255,100.108c0,68.934,55.882,124.815,124.815,124.815c28.177,0,54.171-9.34,75.06-25.09"
                />
                <g>
                  <circle
                    style={{
                      fill: "none",
                      stroke: "#ffffff",
                      strokeWidth: 30,
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeMiterlimit: 10
                    }}
                    cx="176.075"
                    cy="206.935"
                    r="52.95"
                  />
                </g>
                <g>
                  <circle
                    style={{
                      fill: "none",
                      stroke: "#ffffff",
                      strokeWidth: 30,
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeMiterlimit: 10
                    }}
                    cx="335.925"
                    cy="206.935"
                    r="52.95"
                  />
                </g>
                <polyline
                  style={{
                    fill: "none",
                    stroke: "#ffffff",
                    strokeWidth: 30,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeMiterlimit: 10
                  }}
                  points="274.119,206.934 299.263,248.929 255.991,343.112 212.719,248.929 237.863,206.935"
                />
                <path
                  style={{
                    fill: "none",
                    stroke: "#ffffff",
                    strokeWidth: 30,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeMiterlimit: 10
                  }}
                  d="M29.22,23.667v19.522c0,12.726,6.471,24.58,17.175,31.463l117.3,69.044c6.391,3.762,13.237,6.655,20.301,8.914c18.055,5.772,33.759,17.457,44.483,33.308l27.513,40.668l27.531-40.678c10.723-15.844,26.423-27.525,44.474-33.295c7.064-2.258,13.91-5.152,20.301-8.914l117.308-69.046c10.705-6.883,17.175-18.736,17.175-31.463V23.667l-61.652,17.266c-29.351,8.22-60.616,6.314-88.752-5.409l-24.213-10.089c-33.39-13.912-70.954-13.912-104.344,0l-24.21,10.088c-28.138,11.724-59.404,13.629-88.757,5.407L29.22,23.667z"
                />
              </g>
              <line
                style={{
                  fill: "none",
                  stroke: "#ffffff",
                  strokeWidth: 30,
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeMiterlimit: 10
                }}
                x1="176.075"
                y1="206.935"
                x2="176.075"
                y2="206.935"
              />
              <line
                style={{
                  fill: "none",
                  stroke: "#ffffff",
                  strokeWidth: 30,
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeMiterlimit: 10
                }}
                x1="335.925"
                y1="206.935"
                x2="335.925"
                y2="206.935"
              />
            </g>
          </svg>

          <span
            className={`${
              location.pathname === "/mining"
                ? "text-primary text-shadow-greenGlow"
                : ""
            } tab tab-home block text-[12px] `}
          >
            Mining
          </span>
        </Link>
        <Link
          to="/profile"
          className={`w-full    justify-center rounded-2xl flex flex-col items-center text-center py-1 ${
            location.pathname === "/profile"
              ? "bg-footerMenu rounded-2xl transition-all duration-300 "
              : ""
          } `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`${
              location.pathname === "/profile"
                ? "w-6 fill-primary filter-filterGlow animate-glow"
                : "w-6 fill-white"
            }`}
            viewBox="0 0 64 64"
          >
            <path
              d="M26.89 32.291h-7.592V4.525c0-3.366-5.215-3.366-5.215 0v27.766H6.49c-2.446 0-4.49 2.318-4.49 5.095c0 2.779 2.043 5.098 4.49 5.098h7.593v16.992c0 3.365 5.215 3.365 5.215 0V42.484h7.592c2.449 0 4.491-2.318 4.491-5.098c0-2.778-2.042-5.095-4.491-5.095m22.849 23.57H37.372c-3.847 0-3.847 6.138 0 6.138h12.367c3.848 0 3.848-6.138 0-6.138m1.875-10.772H37.372c-3.847 0-3.847 6.139 0 6.139h14.242c3.848 0 3.848-6.139 0-6.139m1.875-10.772H37.372c-3.847 0-3.847 6.138 0 6.138h16.117c3.848 0 3.848-6.138 0-6.138m1.875-10.772H37.372c-3.847 0-3.847 6.138 0 6.138h17.992c3.848 0 3.848-6.138 0-6.138m0 4.138H37.372c-.77 0-.885-.67-.885-1.068c0-.399.115-1.069.885-1.069h17.992c.771 0 .885.67.885 1.069s-.114 1.068-.885 1.068m1.875-14.909H37.372c-3.847 0-3.847 6.138 0 6.138h19.867c3.848 0 3.848-6.138 0-6.138m0 4.138H37.372c-.77 0-.885-.67-.885-1.068c0-.399.115-1.069.885-1.069h19.867c.771 0 .885.67.885 1.069s-.114 1.068-.885 1.068m1.875-14.911H37.372c-3.847 0-3.847 6.138 0 6.138h21.742c3.848 0 3.848-6.138 0-6.138m0 4.138H37.372c-.77 0-.885-.67-.885-1.069s.115-1.068.885-1.068h21.742c.771 0 .885.67.885 1.068c0 .399-.114 1.069-.885 1.069"
            />
          </svg>
          <span
            className={`${
              location.pathname === "/profile"
                ? "text-primary text-shadow-greenGlow"
                : "text-white"
            } tab tab-home block text-[12px] `}
          >
            Level
          </span>
        </Link>
      </div>
    </section>
  );
}

export default Footer;
