import { ChevronLeft, ChevronRight, CircleQuestionMark } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getCryptoBoxLotteryTickets,
  joinCryptoBoxLottery,
  getDashboardStats,
  getLotteryWinners,
} from "../../api/auth";
import Navigation from "../../components/navigation";
import Footer from "../../components/footers";
import {
  connectToLotterySocket,
  disconnectLotterySocket,
  isLotterySocketConnected,
} from "../../utils/socketManager";

// Custom styles for enhanced selection animation
const selectedTicketStyles = `
  @keyframes ticketPulse {
    0% { 
      transform: scale(1.1); 
      box-shadow: 0 0 8px #F5CC4F, 0 0 16px #F5CC4F;
    }
    50% { 
      transform: scale(1.15); 
      box-shadow: 0 0 12px #F5CC4F, 0 0 24px #F5CC4F;
    }
    100% { 
      transform: scale(1.1); 
      box-shadow: 0 0 8px #F5CC4F, 0 0 16px #F5CC4F;
    }
  }
  
  @keyframes smallTicketPulse {
    0% { 
      transform: scale(1.3); 
      box-shadow: 0 0 6px #F5CC4F, 0 0 12px #F5CC4F;
    }
    50% { 
      transform: scale(1.4); 
      box-shadow: 0 0 8px #F5CC4F, 0 0 16px #F5CC4F;
    }
    100% { 
      transform: scale(1.3); 
      box-shadow: 0 0 6px #F5CC4F, 0 0 12px #F5CC4F;
    }
  }
  
  .selected-ticket-large {
    animation: ticketPulse 1.5s ease-in-out infinite;
  }
  
  .selected-ticket-small {
    animation: smallTicketPulse 1.5s ease-in-out infinite;
  }
`;

// SVG Components
const TimerIcon = () => (
  <svg
    width="35"
    height="34"
    viewBox="0 0 35 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_653_1202)">
      <path
        d="M25.5977 9.09937L28.6653 6.03165L30.1451 7.51144L27.0775 10.5792L25.5977 9.09937Z"
        fill="#A7B7C6"
      />
      <path
        d="M29.8214 8.66713L27.5152 6.36097C27.1303 5.97612 27.1303 5.35214 27.5152 4.96729L27.6101 4.87238C27.995 4.48753 28.6189 4.48753 29.0038 4.87238L31.31 7.17855C31.6948 7.5634 31.6948 8.18738 31.31 8.57223L31.2151 8.66713C30.8302 9.05198 30.2062 9.05198 29.8214 8.66713Z"
        fill="#E4E9F4"
      />
      <path
        d="M31.2585 7.13296L30.3167 6.19116C30.7277 6.6022 30.7277 7.26868 30.3167 7.67972C29.9056 8.09076 29.2392 8.09082 28.8281 7.67979L29.7699 8.62158C30.181 9.03268 30.8474 9.03268 31.2585 8.62158C31.6695 8.21048 31.6695 7.54406 31.2585 7.13296Z"
        fill="#CDD2DF"
      />
      <path
        d="M16.1836 2.11108H18.2764V6.12224H16.1836V2.11108Z"
        fill="#A7B7C6"
      />
      <path
        d="M18.8698 3.16457H15.597C15.0559 3.16457 14.6172 2.7259 14.6172 2.18481V1.00491C14.6172 0.463819 15.0559 0.0251465 15.597 0.0251465H18.8698C19.4109 0.0251465 19.8496 0.463819 19.8496 1.00491V2.18481C19.8496 2.7259 19.411 3.16457 18.8698 3.16457Z"
        fill="#E4E9F4"
      />
      <path
        d="M18.8 0.0251465H16.707C17.2849 0.0251465 17.7535 0.49366 17.7535 1.07158V2.11801C17.7535 2.69593 17.2849 3.16444 16.707 3.16444H18.8C19.3779 3.16444 19.8464 2.69593 19.8464 2.11801V1.07164C19.8464 0.49366 19.3779 0.0251465 18.8 0.0251465Z"
        fill="#CDD2DF"
      />
      <path
        d="M27.5352 29.2157C33.1961 23.5547 33.2021 14.3826 27.5487 8.72943C21.8953 3.07622 12.7233 3.08258 7.0624 8.74364C1.40154 14.4047 1.39549 23.5767 7.0489 29.2299C12.7023 34.8832 21.8743 34.8768 27.5352 29.2157Z"
        fill="#FFC13F"
      />
      <path
        d="M27.5466 8.72711C24.4304 5.61087 20.2451 4.2151 16.168 4.53725C17.7805 5.30682 19.292 6.35804 20.6272 7.69326C26.9374 14.0035 26.9304 24.2412 20.6117 30.5599C19.4257 31.7459 18.1016 32.7094 16.6914 33.4507C20.5944 33.6076 24.5507 32.1955 27.5328 29.2135C33.1937 23.5525 33.1999 14.3804 27.5466 8.72711Z"
        fill="#FF9416"
      />
      <path
        d="M17.3578 30.6549C23.8118 30.6549 29.0438 25.4229 29.0438 18.9689C29.0438 12.5149 23.8118 7.28296 17.3578 7.28296C10.9039 7.28296 5.67188 12.5149 5.67188 18.9689C5.67188 25.4229 10.9039 30.6549 17.3578 30.6549Z"
        fill="#E4E9F4"
      />
      <path
        d="M20.7031 7.76733C26.7696 13.9114 26.9048 23.713 21.114 30.036C25.7259 28.4722 29.045 24.1071 29.045 18.9667C29.045 13.675 25.5274 9.20556 20.7031 7.76733Z"
        fill="#CDD2DF"
      />
      <path
        d="M17.2303 18.223C17.1616 18.223 17.0935 18.2095 17.03 18.1832C16.9665 18.1569 16.9089 18.1183 16.8603 18.0697C16.8117 18.0211 16.7731 17.9635 16.7468 17.9C16.7206 17.8365 16.707 17.7684 16.707 17.6997V11.8394C16.707 11.7006 16.7622 11.5676 16.8603 11.4694C16.9584 11.3713 17.0915 11.3162 17.2303 11.3162C17.3691 11.3162 17.5022 11.3713 17.6003 11.4694C17.6984 11.5676 17.7535 11.7006 17.7535 11.8394V17.6997C17.7536 17.7684 17.74 17.8365 17.7137 17.9C17.6874 17.9635 17.6489 18.0211 17.6003 18.0697C17.5517 18.1183 17.494 18.1569 17.4305 18.1832C17.3671 18.2095 17.299 18.223 17.2303 18.223Z"
        fill="#7A6CF7"
      />
      <path
        d="M17.3 20.549C18.1669 20.549 18.8696 19.8463 18.8696 18.9795C18.8696 18.1126 18.1669 17.4099 17.3 17.4099C16.4332 17.4099 15.7305 18.1126 15.7305 18.9795C15.7305 19.8463 16.4332 20.549 17.3 20.549Z"
        fill="#555E6B"
      />
      <path
        d="M24.531 11.6964C24.6332 11.7986 24.7671 11.8497 24.901 11.8497C25.0349 11.8497 25.1688 11.7986 25.2709 11.6965L25.9344 11.033C25.6974 10.7767 25.4492 10.5312 25.1903 10.297L24.531 10.9564C24.4824 11.005 24.4438 11.0627 24.4175 11.1262C24.3912 11.1897 24.3777 11.2577 24.3777 11.3264C24.3777 11.3951 24.3913 11.4632 24.4176 11.5267C24.4439 11.5901 24.4824 11.6478 24.531 11.6964ZM27.5432 18.8988C27.5432 18.9676 27.5567 19.0356 27.583 19.0991C27.6093 19.1626 27.6479 19.2203 27.6964 19.2689C27.745 19.3175 27.8027 19.356 27.8662 19.3823C27.9297 19.4086 27.9977 19.4221 28.0665 19.4221H29.0336C29.0394 19.2715 29.0432 19.1205 29.0432 18.9686C29.0432 18.7697 29.0381 18.5721 29.0283 18.3756H28.0665C27.9277 18.3756 27.7946 18.4307 27.6965 18.5289C27.5984 18.627 27.5432 18.7601 27.5432 18.8988ZM17.3575 8.78291C17.4262 8.78292 17.4943 8.76939 17.5578 8.7431C17.6213 8.71681 17.6789 8.67826 17.7275 8.62967C17.7761 8.58108 17.8147 8.52339 17.841 8.45991C17.8673 8.39642 17.8808 8.32837 17.8808 8.25965V7.29517C17.7065 7.28726 17.532 7.28319 17.3575 7.28296C17.1821 7.28296 17.0078 7.28753 16.8343 7.29517V8.25965C16.8342 8.32837 16.8478 8.39642 16.8741 8.45991C16.9004 8.52339 16.9389 8.58108 16.9875 8.62967C17.0361 8.67826 17.0938 8.71681 17.1573 8.7431C17.2208 8.76939 17.2888 8.78292 17.3575 8.78291ZM6.78809 19.4221C6.92686 19.4221 7.05996 19.367 7.15809 19.2688C7.25622 19.1707 7.31135 19.0376 7.31135 18.8988C7.31135 18.7601 7.25622 18.627 7.15809 18.5288C7.05996 18.4307 6.92686 18.3756 6.78809 18.3756H5.74163C5.72308 18.3756 5.70473 18.3766 5.68664 18.3785C5.67682 18.5751 5.6719 18.7718 5.67188 18.9686C5.67188 19.1193 5.67566 19.2691 5.68135 19.4183C5.70114 19.4206 5.72126 19.422 5.7417 19.422L6.78809 19.4221ZM9.41588 27.54C9.44049 27.5229 9.46356 27.5036 9.48485 27.4825L10.2248 26.7426C10.2734 26.694 10.312 26.6363 10.3383 26.5728C10.3646 26.5093 10.3781 26.4413 10.3781 26.3726C10.3781 26.3038 10.3646 26.2358 10.3383 26.1723C10.312 26.1088 10.2735 26.0511 10.2249 26.0026C10.1763 25.954 10.1186 25.9154 10.0551 25.8891C9.99163 25.8628 9.92359 25.8493 9.85487 25.8493C9.78615 25.8493 9.71811 25.8628 9.65462 25.8891C9.59113 25.9154 9.53345 25.9539 9.48485 26.0025L8.74487 26.7425C8.72462 26.7628 8.70699 26.7845 8.69079 26.807C8.92166 27.0618 9.16359 27.3063 9.41588 27.54ZM26.0482 26.7799L25.3203 26.0519C25.2717 26.0033 25.214 25.9648 25.1505 25.9385C25.087 25.9122 25.019 25.8987 24.9502 25.8987C24.8815 25.8987 24.8135 25.9122 24.75 25.9385C24.6865 25.9648 24.6288 26.0033 24.5802 26.0519C24.5316 26.1005 24.4931 26.1582 24.4668 26.2217C24.4405 26.2852 24.427 26.3532 24.427 26.4219C24.427 26.4907 24.4405 26.5587 24.4668 26.6222C24.4931 26.6857 24.5317 26.7434 24.5803 26.7919L25.3142 27.5259C25.5698 27.2882 25.8148 27.0393 26.0482 26.7799ZM8.80026 11.0119L9.53423 11.7458C9.63639 11.848 9.77029 11.8991 9.90419 11.8991C10.0381 11.8991 10.172 11.848 10.2742 11.7458C10.3227 11.6973 10.3613 11.6396 10.3876 11.5761C10.4139 11.5126 10.4274 11.4445 10.4274 11.3758C10.4274 11.3071 10.4139 11.2391 10.3876 11.1756C10.3613 11.1121 10.3227 11.0544 10.2742 11.0058L9.54625 10.2779C9.28681 10.5114 9.0379 10.7563 8.80026 11.0119ZM17.8774 30.6422C17.8795 30.6233 17.8807 30.6041 17.8807 30.5845V29.5381C17.8807 29.3993 17.8256 29.2662 17.7275 29.1681C17.6293 29.07 17.4962 29.0148 17.3575 29.0148C17.2187 29.0148 17.0856 29.07 16.9875 29.1681C16.8893 29.2662 16.8342 29.3993 16.8342 29.5381V30.5845C16.8342 30.6041 16.8354 30.6232 16.8375 30.6422C17.01 30.6498 17.1831 30.6543 17.3575 30.6543C17.5318 30.6543 17.705 30.6497 17.8774 30.6422Z"
        fill="#555E6B"
      />
    </g>
    <defs>
      <clipPath id="clip0_653_1202">
        <rect
          width="33.4419"
          height="33.4419"
          fill="white"
          transform="translate(0.582031 0.0192871)"
        />
      </clipPath>
    </defs>
  </svg>
);

const TargetIcon = () => (
  <svg
    width="24"
    height="23"
    viewBox="0 0 24 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_6097_6750)">
      <path
        d="M12.2643 20.8801C17.4973 20.8801 21.7395 16.6379 21.7395 11.4049C21.7395 6.17189 17.4973 1.92969 12.2643 1.92969C7.03126 1.92969 2.78906 6.17189 2.78906 11.4049C2.78906 16.6379 7.03126 20.8801 12.2643 20.8801Z"
        stroke="url(#paint0_linear_6097_6750)"
        strokeWidth="1.89504"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.2633 17.091C15.4031 17.091 17.9484 14.5456 17.9484 11.4058C17.9484 8.26602 15.4031 5.7207 12.2633 5.7207C9.12344 5.7207 6.57812 8.26602 6.57812 11.4058C6.57812 14.5456 9.12344 17.091 12.2633 17.091Z"
        stroke="url(#paint1_linear_6097_6750)"
        strokeWidth="1.89504"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.2622 13.2999C13.3088 13.2999 14.1573 12.4514 14.1573 11.4048C14.1573 10.3582 13.3088 9.50977 12.2622 9.50977C11.2156 9.50977 10.3672 10.3582 10.3672 11.4048C10.3672 12.4514 11.2156 13.2999 12.2622 13.2999Z"
        stroke="url(#paint2_linear_6097_6750)"
        strokeWidth="1.89504"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_6097_6750"
        x1="5.25262"
        y1="3.06671"
        x2="17.9494"
        y2="18.4166"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#33A0EA" />
        <stop offset="1" stopColor="#0AC488" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_6097_6750"
        x1="8.05626"
        y1="6.40292"
        x2="15.6743"
        y2="15.6128"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#33A0EA" />
        <stop offset="1" stopColor="#0AC488" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_6097_6750"
        x1="10.8599"
        y1="9.73717"
        x2="13.3993"
        y2="12.8071"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#33A0EA" />
        <stop offset="1" stopColor="#0AC488" />
      </linearGradient>
      <clipPath id="clip0_6097_6750">
        <rect
          width="22.7405"
          height="22.7405"
          fill="white"
          transform="translate(0.890625 0.0351562)"
        />
      </clipPath>
    </defs>
  </svg>
);

const Trophy = ({
  size = 24,
  isActive = false,
}: {
  size?: number;
  isActive?: boolean;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.57915 9.04425H5.15787C4.52962 9.04425 3.92711 8.79468 3.48287 8.35044C3.03863 7.90621 2.78906 7.30369 2.78906 6.67545C2.78906 6.0472 3.03863 5.44468 3.48287 5.00045C3.92711 4.55621 4.52962 4.30664 5.15787 4.30664H6.57915"
      stroke={isActive ? "url(#paint0_linear_6097_6767)" : "white"}
      strokeWidth="1.89504"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.9492 9.04425H19.3705C19.9987 9.04425 20.6013 8.79468 21.0455 8.35044C21.4897 7.90621 21.7393 7.30369 21.7393 6.67545C21.7393 6.0472 21.4897 5.44468 21.0455 5.00045C20.6013 4.55621 19.9987 4.30664 19.3705 4.30664H17.9492"
      stroke={isActive ? "url(#paint1_linear_6097_6767)" : "white"}
      strokeWidth="1.89504"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.68359 21.3613H19.8439"
      stroke={isActive ? "url(#paint2_linear_6097_6767)" : "white"}
      strokeWidth="1.89504"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.366 14.4062V16.6235C10.366 17.1446 9.92067 17.552 9.44691 17.77C8.32883 18.2816 7.52344 19.6934 7.52344 21.3611"
      stroke={isActive ? "url(#paint3_linear_6097_6767)" : "white"}
      strokeWidth="1.89504"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.1562 14.4062V16.6235C14.1562 17.1446 14.6016 17.552 15.0753 17.77C16.1934 18.2816 16.9988 19.6934 16.9988 21.3611"
      stroke={isActive ? "url(#paint4_linear_6097_6767)" : "white"}
      strokeWidth="1.89504"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.9484 2.41016H6.57812V9.04281C6.57813 10.5506 7.17709 11.9966 8.24326 13.0628C9.30943 14.129 10.7555 14.7279 12.2633 14.7279C13.771 14.7279 15.2171 14.129 16.2833 13.0628C17.3494 11.9966 17.9484 10.5506 17.9484 9.04281V2.41016Z"
      stroke={isActive ? "url(#paint5_linear_6097_6767)" : "white"}
      strokeWidth="1.89504"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_6097_6767"
        x1="3.28177"
        y1="4.5909"
        x2="6.51149"
        y2="7.71456"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#33A0EA" />
        <stop offset="1" stopColor="#0AC488" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_6097_6767"
        x1="18.4419"
        y1="4.5909"
        x2="21.6716"
        y2="7.71456"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#33A0EA" />
        <stop offset="1" stopColor="#0AC488" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_6097_6767"
        x1="6.65444"
        y1="21.4213"
        x2="6.72865"
        y2="22.7815"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#33A0EA" />
        <stop offset="1" stopColor="#0AC488" />
      </linearGradient>
      <linearGradient
        id="paint3_linear_6097_6767"
        x1="7.89297"
        y1="14.8235"
        x2="11.6611"
        y2="16.6854"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#33A0EA" />
        <stop offset="1" stopColor="#0AC488" />
      </linearGradient>
      <linearGradient
        id="paint4_linear_6097_6767"
        x1="14.5258"
        y1="14.8235"
        x2="18.2939"
        y2="16.6854"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#33A0EA" />
        <stop offset="1" stopColor="#0AC488" />
      </linearGradient>
      <linearGradient
        id="paint5_linear_6097_6767"
        x1="8.05626"
        y1="3.14922"
        x2="16.4079"
        y2="12.4693"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#33A0EA" />
        <stop offset="1" stopColor="#0AC488" />
      </linearGradient>
    </defs>
  </svg>
);
const ClockIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.47419 14.0402C11.614 14.0402 14.1593 11.4949 14.1593 8.35505C14.1593 5.21524 11.614 2.66992 8.47419 2.66992C5.33438 2.66992 2.78906 5.21524 2.78906 8.35505C2.78906 11.4949 5.33438 14.0402 8.47419 14.0402Z"
      stroke="url(#paint0_linear_6097_6758)"
      strokeWidth="1.89504"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.0308 10.6016C18.9265 10.9355 19.7235 11.4899 20.3482 12.2135C20.9729 12.9371 21.405 13.8065 21.6046 14.7414C21.8042 15.6762 21.7649 16.6463 21.4902 17.5619C21.2156 18.4775 20.7145 19.3091 20.0333 19.9798C19.3521 20.6504 18.5128 21.1385 17.593 21.3988C16.6732 21.6591 15.7026 21.6833 14.771 21.4691C13.8394 21.2549 12.9768 20.8093 12.2631 20.1734C11.5493 19.5375 11.0074 18.732 10.6875 17.8312"
      stroke="url(#paint1_linear_6097_6758)"
      strokeWidth="1.89504"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.52344 6.45898H8.47096V10.2491"
      stroke="url(#paint2_linear_6097_6758)"
      strokeWidth="1.89504"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.7236 13.9258L17.3869 14.5985L14.7148 17.2705"
      stroke="url(#paint3_linear_6097_6758)"
      strokeWidth="1.89504"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_6097_6758"
        x1="4.2672"
        y1="3.35214"
        x2="11.8853"
        y2="12.562"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#33A0EA" />
        <stop offset="1" stopColor="#0AC488" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_6097_6758"
        x1="12.123"
        y1="11.2623"
        x2="19.4973"
        y2="20.202"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#33A0EA" />
        <stop offset="1" stopColor="#0AC488" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_6097_6758"
        x1="7.64662"
        y1="6.68639"
        x2="9.07852"
        y2="7.11917"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#33A0EA" />
        <stop offset="1" stopColor="#0AC488" />
      </linearGradient>
      <linearGradient
        id="paint3_linear_6097_6758"
        x1="15.0622"
        y1="14.1265"
        x2="17.3423"
        y2="16.3285"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#33A0EA" />
        <stop offset="1" stopColor="#0AC488" />
      </linearGradient>
    </defs>
  </svg>
);

const CryptoBoxLottery = () => {
  const { user, token } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [userTickets, setUserTickets] = useState<number[]>([]);
  const [otherUserTickets, setOtherUserTickets] = useState<number[]>([]);
  const [selectedDots2, setSelectedDots2] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [toast, setToast] = useState<any>(null);
  const [autoSelect, setAutoSelect] = useState(false);
  const [autoSelectCount, setAutoSelectCount] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bfmBalance, setBfmBalance] = useState(0);
  const [winners, setWinners] = useState<any[]>([]);
  const [winnersLoading, setWinnersLoading] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState<number>(1); // Dynamic quarters for Box1 display

  // New state for API response data
  const [lotteryData, setLotteryData] = useState<any>({
    total: 250,
    sold: 0,
    userTickets: 0,
    poolAmount: 0,
    startTime: null,
    endTime: null,
    previousWinner: null,
  });
  const [timeRemaining, setTimeRemaining] = useState<string>("00:00:00");

  // Calculate total dots based on lottery total with specific thresholds
  const calculateTotalDots = (totalTickets: number) => {
    if (totalTickets >= 5000) {
      return 5250; // >=5000 tickets → 5250 dots
    } else if (totalTickets >= 4750) {
      return 5000; // >=4750 tickets → 5000 dots
    } else if (totalTickets >= 4500) {
      return 4750; // >=4500 tickets → 4750 dots
    } else if (totalTickets >= 4250) {
      return 4500; // >=4250 tickets → 4500 dots
    } else if (totalTickets >= 4000) {
      return 4250; // >=4000 tickets → 4250 dots
    } else if (totalTickets >= 3750) {
      return 4000; // >=3750 tickets → 4000 dots
    } else if (totalTickets >= 3500) {
      return 3750; // >=3500 tickets → 3750 dots
    } else if (totalTickets >= 3250) {
      return 3500; // >=3250 tickets → 3500 dots
    } else if (totalTickets >= 3000) {
      return 3250; // >=3000 tickets → 3250 dots
    } else if (totalTickets >= 2750) {
      return 3000; // >=2750 tickets → 3000 dots
    } else if (totalTickets >= 2500) {
      return 2750; // >=2500 tickets → 2750 dots
    } else if (totalTickets >= 2250) {
      return 2500; // >=2250 tickets → 2500 dots
    } else if (totalTickets >= 2000) {
      return 2250; // >=2000 tickets → 2250 dots
    } else if (totalTickets >= 1750) {
      return 2000; // >=1750 tickets → 2000 dots
    } else if (totalTickets >= 1500) {
      return 1750; // >=1500 tickets → 1750 dots
    } else if (totalTickets >= 1250) {
      return 1500; // >=1250 tickets → 1500 dots
    } else if (totalTickets >= 1000) {
      return 1250; // >=1000 tickets → 1250 dots
    } else if (totalTickets >= 750) {
      return 1000; // >=750 tickets → 1000 dots
    } else if (totalTickets >= 500) {
      return 750; // >=500 tickets → 750 dots
    } else if (totalTickets >= 250) {
      return 500; // >=250 tickets → 500 dots
    } else {
      return 250; // <250 tickets → 250 dots
    }
  };

  // Dynamic dots for Box2 based on sold tickets
  const totalDots2 = calculateTotalDots(lotteryData.sold);

  // Box1 shows only 250 dots (current quarter)
  const totalDots = 250;

  // Calculate number of quarters dynamically
  const numberOfQuarters = totalDots2 / 250;

  // Debug: Log scaling behavior (remove in production)
  console.log(
    `🎯 Lottery Scaling: ${lotteryData.sold} sold tickets → ${totalDots2} dots → ${numberOfQuarters} quarters`
  );

  // Function to determine which quarter has available tickets (default selection)
  const getDefaultQuarter = () => {
    const totalTickets = totalDots2;
    const quarterSize = 250;
    const allOccupiedTickets = [...userTickets, ...otherUserTickets];

    // Check each quarter to find the one with most available tickets
    for (let quarter = 1; quarter <= numberOfQuarters; quarter++) {
      const quarterStart = (quarter - 1) * quarterSize + 1;
      const quarterEnd = quarter * quarterSize;

      // Count available tickets in this quarter
      let availableInQuarter = 0;
      for (let i = quarterStart; i <= quarterEnd; i++) {
        if (!allOccupiedTickets.includes(i)) {
          availableInQuarter++;
        }
      }

      // If this quarter has available tickets, return it as default
      if (availableInQuarter > 0) {
        return quarter;
      }
    }

    return 1; // Default to first quarter if all are occupied
  };

  // Get quarter range for Box1 display
  const getQuarterRange = (quarter: number) => {
    const quarterSize = 250;
    const start = (quarter - 1) * quarterSize + 1;
    const end = quarter * quarterSize;
    return { start, end };
  };

  // Set default quarter when tickets are loaded
  useEffect(() => {
    if (userTickets.length > 0 || otherUserTickets.length > 0) {
      const defaultQuarter = getDefaultQuarter();
      setSelectedQuarter(defaultQuarter);
    }
  }, [userTickets, otherUserTickets]);

  // Debug log to verify calculations
  console.log("Lottery Data:", {
    total: lotteryData.total,
    sold: lotteryData.sold,
    calculatedDots: totalDots,
    calculatedDots2: totalDots2,
    selectedQuarter,
    quarterRange: getQuarterRange(selectedQuarter),
  });

  // Function to calculate time remaining
  const calculateTimeRemaining = (endTime: string) => {
    // Use Date.now() for current UTC time to match server's UTC endTime
    const now = Date.now();
    const end = new Date(endTime).getTime();
    const difference = end - now;

    // Add 5 additional minutes (5 * 60 * 1000 milliseconds)
    const extendedDifference = difference + 5 * 60 * 1000;

    // Debug log (remove after testing)
    console.log("Timer Debug:", {
      endTime,
      now: new Date(now).toISOString(),
      end: new Date(end).toISOString(),
      difference: difference / (1000 * 60 * 60), // hours
      extendedDifference: extendedDifference / (1000 * 60 * 60), // hours
    });

    if (extendedDifference > 0) {
      // Calculate total hours (not limited to 24)
      const totalHours = Math.floor(extendedDifference / (1000 * 60 * 60));
      const minutes = Math.floor(
        (extendedDifference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((extendedDifference % (1000 * 60)) / 1000);

      return `${totalHours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    return "00:00:00";
  };

  // Connect to lottery socket on component mount
  useEffect(() => {
    // Connect to socket if not already connected
    if (!isLotterySocketConnected()) {
      connectToLotterySocket();
    }

    // Set up event listeners for real-time updates
    const handleTicketsUpdated = (event) => {
      console.log("Lottery tickets updated via socket:", event.detail);
      // Refresh tickets data when new tickets are purchased
      fetchTickets();
    };

    const handleLotteryUpdated = (event) => {
      console.log("Lottery data updated via socket:", event.detail);
      // Update lottery data with real-time information
      if (event.detail) {
        setLotteryData((prev) => ({
          ...prev,
          ...event.detail,
        }));
      }
    };

    const handleWinnerAnnounced = (event) => {
      console.log("Lottery winner announced via socket:", event.detail);
      // Show winner announcement toast
      setToast({
        type: "success",
        message: `🎉 Winner announced: ${
          event.detail?.winner || "Unknown"
        } won ${event.detail?.amount || 0} BFM!`,
      });
      // Refresh winners list
      fetchWinners();
    };

    const handleCountdownUpdated = (event) => {
      console.log("Lottery countdown updated via socket:", event.detail);
      // Update countdown if provided
      if (event.detail?.endTime) {
        setLotteryData((prev) => ({
          ...prev,
          endTime: event.detail.endTime,
        }));
      }
    };

    const handlePoolAmountUpdated = (event) => {
      console.log("Pool amount updated via socket:", event.detail);
      // Update pool amount
      if (event.detail?.poolAmount !== undefined) {
        setLotteryData((prev) => ({
          ...prev,
          poolAmount: event.detail.poolAmount,
        }));
      }
    };

    // Add event listeners
    window.addEventListener("lottery-tickets-updated", handleTicketsUpdated);
    window.addEventListener("lottery-updated", handleLotteryUpdated);
    window.addEventListener("lottery-winner-announced", handleWinnerAnnounced);
    window.addEventListener(
      "lottery-countdown-updated",
      handleCountdownUpdated
    );
    window.addEventListener("pool-amount-updated", handlePoolAmountUpdated);

    // Cleanup function
    return () => {
      window.removeEventListener(
        "lottery-tickets-updated",
        handleTicketsUpdated
      );
      window.removeEventListener("lottery-updated", handleLotteryUpdated);
      window.removeEventListener(
        "lottery-winner-announced",
        handleWinnerAnnounced
      );
      window.removeEventListener(
        "lottery-countdown-updated",
        handleCountdownUpdated
      );
      window.removeEventListener(
        "pool-amount-updated",
        handlePoolAmountUpdated
      );
    };
  }, []);

  // Function to fetch tickets (extracted for reuse)
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await getCryptoBoxLotteryTickets();

      if (response.success && response.data) {
        // Update lottery data from API response
        setLotteryData({
          total: response.total || 250,
          sold: response.sold || 0,
          userTickets: response.userTickets || 0,
          poolAmount: response.poolAmount || 0,
          startTime: response.startTime,
          endTime: response.endTime,
          previousWinner: response.previousWinner,
        });

        setTickets(response.data);

        // Separate tickets by ownership
        const currentUser = user?.username || user?.email || user?.id;
        const userOwnedTickets: number[] = [];
        const othersTickets: number[] = [];

        response.data.forEach((ticket: any) => {
          if (ticket.username === currentUser) {
            userOwnedTickets.push(ticket.ticketNumber);
          } else {
            othersTickets.push(ticket.ticketNumber);
          }
        });

        setUserTickets(userOwnedTickets);
        setOtherUserTickets(othersTickets);
      }
    } catch (error) {
      console.error("Error fetching lottery tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch winners (extracted for reuse)
  const fetchWinners = async () => {
    try {
      setWinnersLoading(true);
      const response = await getLotteryWinners();

      if (response.success && response.data && response.data.data) {
        setWinners(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching lottery winners:", error);
    } finally {
      setWinnersLoading(false);
    }
  };

  // Timer effect for countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (lotteryData.endTime) {
      interval = setInterval(() => {
        const remaining = calculateTimeRemaining(lotteryData.endTime);
        setTimeRemaining(remaining);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [lotteryData.endTime]);

  // Fetch lottery tickets on component mount
  useEffect(() => {
    fetchTickets();
  }, [user]);

  // Fetch dashboard stats to get BFM balance
  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!token) return;

      try {
        const response = await getDashboardStats(token);
        if (response.success && response.data) {
          setBfmBalance(response.data.bfm || 0);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchDashboardStats();
  }, [token]);

  // Fetch lottery winners
  useEffect(() => {
    fetchWinners();
  }, []);

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Disconnect socket when component unmounts
  useEffect(() => {
    return () => {
      // Don't disconnect immediately, let other components use the socket
      // disconnectLotterySocket();
    };
  }, []);

  // Function to show confirmation modal
  const handleBuyTickets = () => {
    // Check if user is logged in
    if (!token || !user) {
      setToast({
        type: "error",
        message: "🔐 Please sign in to join the lottery",
      });

      // Redirect to sign in page after a short delay
      setTimeout(() => {
        navigate("/signin");
      }, 1500);
      return;
    }

    if (selectedDots2.length === 0) {
      setToast({
        type: "error",
        message: "⚠️ Please select at least one ticket",
      });
      return;
    }

    setShowConfirmModal(true);
  };

  // Function to handle joining the lottery (called from modal)
  const handleJoinLottery = async () => {
    try {
      setJoining(true);

      // Send only newly selected tickets (not previously owned tickets)
      console.log("Sending tickets to API:", selectedDots2);
      const response = await joinCryptoBoxLottery(token, selectedDots2);

      if (response.success) {
        // Show success toast
        setToast({
          type: "success",
          message: `🎉 Successfully joined! Tickets: ${(
            response.tickets || selectedDots2
          ).join(", ")} | Cost: ${selectedDots2.length} BFM`,
        });

        // Clear selected tickets and auto select states immediately after successful join
        setSelectedDots2([]);
        setAutoSelect(false);
        setAutoSelectCount("");
        setShowConfirmModal(false);

        // Refresh lottery tickets data to get updated information
        fetchTickets();

        // Update BFM balance after successful purchase
        setBfmBalance((prev) => prev - selectedDots2.length);
      } else {
        // Show error toast
        setToast({
          type: "error",
          message: `❌ ${response.message || "Failed to join lottery"}`,
        });
      }
    } catch (error: any) {
      console.error("Error joining lottery:", error);

      // Show error toast
      setToast({
        type: "error",
        message: `❌ ${
          error.response?.data?.message ||
          "Failed to join lottery. Please try again."
        }`,
      });

      // Clear selections and auto select states on error as well
      setSelectedDots2([]);
      setAutoSelect(false);
      setAutoSelectCount("");
      setShowConfirmModal(false);
    } finally {
      setJoining(false);
    }
  };

  const handleDotClick = (dotIndex: number) => {
    // Disable manual selection when auto select is enabled
    if (autoSelect) return;

    // Only allow selection if the dot is not already owned by any user (available tickets only)
    if (
      !userTickets.includes(dotIndex) &&
      !otherUserTickets.includes(dotIndex)
    ) {
      setSelectedDots2((prev) => {
        if (prev.includes(dotIndex)) {
          // Remove from selection if already selected
          return prev.filter((index) => index !== dotIndex);
        } else {
          // Add to selection if not selected
          return [...prev, dotIndex];
        }
      });
    }
  };

  const handleDotClick2 = (dotIndex: number) => {
    // Disable manual selection when auto select is enabled
    if (autoSelect) return;

    // Only allow selection if the dot is not already owned by any user (available tickets only)
    if (
      !userTickets.includes(dotIndex) &&
      !otherUserTickets.includes(dotIndex)
    ) {
      setSelectedDots2((prev) => {
        if (prev.includes(dotIndex)) {
          // Remove from selection if already selected
          return prev.filter((index) => index !== dotIndex);
        } else {
          // Add to selection if not selected
          return [...prev, dotIndex];
        }
      });
    }
  };

  // Function to get available ticket numbers
  const getAvailableTickets = (): number[] => {
    const available: number[] = [];
    for (let i = 1; i <= totalDots2; i++) {
      if (!userTickets.includes(i) && !otherUserTickets.includes(i)) {
        available.push(i);
      }
    }
    return available;
  };

  // Function to auto select random available tickets
  const handleAutoSelect = (count: number) => {
    const availableTickets = getAvailableTickets();
    const maxSelectable = Math.min(count, availableTickets.length);

    if (maxSelectable === 0) {
      setToast({
        type: "error",
        message: "No available tickets to select",
      });
      return;
    }

    // Clear current selections first
    setSelectedDots2([]);

    // Randomly shuffle available tickets and take the required count
    const shuffled = [...availableTickets].sort(() => Math.random() - 0.5);
    const randomSelected = shuffled.slice(0, maxSelectable);

    setSelectedDots2(randomSelected);

    if (maxSelectable < count) {
      setToast({
        type: "error",
        message: `Only ${maxSelectable} tickets available, selected ${maxSelectable} tickets`,
      });
    }
  };

  // Handle auto select count change
  const handleAutoSelectCountChange = (value: string) => {
    setAutoSelectCount(value);
    const count = parseInt(value);

    if (!isNaN(count) && count > 0) {
      handleAutoSelect(count);
    } else if (value === "") {
      // Clear selections when input is empty
      setSelectedDots2([]);
    }
  };

  const getDotColor = (dotIndex: number) => {
    // Selected available ticket should be highlighted
    if (selectedDots2.includes(dotIndex)) {
      return "#F5CC4F";
    }

    // Only color based on real ownership
    if (userTickets.includes(dotIndex)) {
      return "#F5CC4F"; // Your tickets
    }
    if (otherUserTickets.includes(dotIndex)) {
      return "#08916A"; // Others' tickets
    }
    return "#1C1D24"; // Available
  };

  const getDotColor2 = (dotIndex: number) => {
    // Selected available ticket should be highlighted
    if (selectedDots2.includes(dotIndex)) {
      return "#F5CC4F";
    }

    // Only color based on real ownership
    if (userTickets.includes(dotIndex)) {
      return "#F5CC4F"; // Your tickets
    }
    if (otherUserTickets.includes(dotIndex)) {
      return "#08916A"; // Others' tickets
    }
    return "#1C1D24"; // Available
  };

  // Handle quarter selection in Box2
  const handleQuarterSelection = (quarter: number) => {
    setSelectedQuarter(quarter);
    console.log(`Selected quarter ${quarter}:`, getQuarterRange(quarter));
  };

  const renderDots = () => {
    const dots: JSX.Element[] = [];
    const { start, end } = getQuarterRange(selectedQuarter);

    // Render only the dots for the selected quarter
    for (let i = start; i <= end; i++) {
      const isSelected = selectedDots2.includes(i);
      dots.push(
        <div
          key={i}
          className={`w-3 h-3 rounded-full transition-all duration-200 ${
            autoSelect ? "cursor-not-allowed" : "cursor-pointer hover:scale-110"
          } ${
            isSelected
              ? "selected-ticket-large ring-2 ring-[#F5CC4F] ring-opacity-80 border-2 border-[#F5CC4F]"
              : ""
          }`}
          style={{
            backgroundColor: getDotColor(i),
            filter: isSelected ? "brightness(1.3) saturate(1.5)" : "none",
          }}
          onClick={() => handleDotClick(i)}
          title={`Ticket #${i} (Quarter ${selectedQuarter})`}
        />
      );
    }

    return dots;
  };
  const renderDots2 = () => {
    const quarters: JSX.Element[] = [];
    const quarterSize = 250;

    // Create dynamic quarters based on total tickets (each containing 250 dots)
    for (let quarter = 1; quarter <= numberOfQuarters; quarter++) {
      const quarterStart = (quarter - 1) * quarterSize + 1;
      const quarterEnd = quarter * quarterSize;

      // Count tickets in this quarter
      const allOccupiedTickets = [...userTickets, ...otherUserTickets];
      let userTicketsInQuarter = 0;
      let otherTicketsInQuarter = 0;
      let selectedTicketsInQuarter = 0;
      let availableInQuarter = 0;

      for (let i = quarterStart; i <= quarterEnd; i++) {
        if (userTickets.includes(i)) userTicketsInQuarter++;
        else if (otherUserTickets.includes(i)) otherTicketsInQuarter++;
        else availableInQuarter++;

        if (selectedDots2.includes(i)) selectedTicketsInQuarter++;
      }

      const isCurrentQuarter = selectedQuarter === quarter;

      quarters.push(
        <div
          key={quarter}
          className={`
            flex flex-col p-3 rounded-lg border-2 transition-all duration-300 cursor-pointer
            ${
              isCurrentQuarter
                ? "border-[#F5CC4F] bg-[#F5CC4F]/10 shadow-lg ring-2 ring-[#F5CC4F]/50"
                : "border-[#FFFFFF1A] bg-[#FFFFFF05] hover:border-[#FFFFFF33] hover:bg-[#FFFFFF08]"
            }
          `}
          onClick={() => handleQuarterSelection(quarter)}
          title={`Quarter ${quarter} (Tickets ${quarterStart}-${quarterEnd})`}
        >
          {/* Mini grid showing quarter overview */}
          <div className="grid grid-cols-10 gap-[1px] w-full">
            {Array.from({ length: 250 }, (_, idx) => {
              const actualTicketNum = quarterStart + idx; // Actual ticket number for this dot
              let dotColor = "#1C1D24"; // default: available

              // Color strictly based on actual data
              if (userTickets.includes(actualTicketNum)) {
                dotColor = "#F5CC4F"; // your tickets
              } else if (otherUserTickets.includes(actualTicketNum)) {
                dotColor = "#08916A"; // others' tickets
              }

              return (
                <div
                  key={idx}
                  className="w-0.5 h-0.5 rounded-full"
                  style={{ backgroundColor: dotColor }}
                />
              );
            })}
          </div>

          {/* Quarter stats */}
          {/* <div className="text-[10px] text-center mt-2 space-y-1">
            <div className="text-[#F5CC4F]">Your: {userTicketsInQuarter}</div>
            <div className="text-[#08916A]">
              Others: {otherTicketsInQuarter}
            </div>
            <div className="text-[#FFFFFF99]">
              Available: {availableInQuarter}
            </div>
            {selectedTicketsInQuarter > 0 && (
              <div className="text-[#FFB800]">
                Selected: {selectedTicketsInQuarter}
              </div>
            )}
          </div> */}
        </div>
      );
    }

    return quarters;
  };

  return (
    <div className=" w-full h-full">
      <Navigation />
      <div className="w-full h-full flex flex-col pt-16 max-w-[1440px] mx-auto px-3 sm:px-10">
        {/* Inject custom CSS styles */}
        <style>{selectedTicketStyles}</style>
        <div
          className="w-full flex flex-col sm:flex-row p-4 sm:p-10 items-center justify-between bg-cover bg-center bg-no-repeat rounded-xl sm:rounded-3xl gap-4 sm:gap-0"
          style={{ backgroundImage: "url('./cryptoboxbannerbg.svg')" }}
        >
          <div className="flex flex-col space-y-2 sm:space-y-4">
            <p className="text-3xl sm:text-4xl font-header text-gradient">
              BFm Crypto Box Lottery
            </p>
            <p className="text-base sm:text-lg font-body1">
              Use your BFM tokens to win a massive prize every Monday.
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-3">
              <TimerIcon />
              <p className="text-lg sm:text-xl font-body1">Next draw starts in :</p>
            </div>
            <p className="text-3xl sm:text-4xl font-body1 text-center sm:text-end ">
              {timeRemaining}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col mt-6 sm:mt-10">
          <div className="flex flex-col space-y-3">
            <p className="text-3xl sm:text-4xl font-header text-[#A0E0C4]">
              Your Ticket Table
            </p>
            <p className="text-[#FFFFFF99] font-body1 text-lg sm:text-xl">
              Track your lottery entries and see other participants in real-time
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 sm:gap-10 w-full mt-6">
            <div className="bg-[#FFFFFF1A] border border-[#FFFFFF1A] p-4 rounded-xl w-full">
              <div className="bg-black rounded-md flex flex-col p-4 h-full">
                <div className="flex flex-col sm:flex-row sm:items-center pt-4 sm:space-x-4 gap-2 sm:gap-0">
                  <div className="flex items-center space-x-2">
                    <div className="bg-[#F5CC4F] p-1.5 rounded-full"></div>
                    <p className="text-[#F5CC4F] text-sm font-body1">
                      Your tickets ({userTickets.length})
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-[#08916A] p-1.5 rounded-full"></div>
                    <p className="text-[#08916A] text-sm font-body1">
                      Other users ({otherUserTickets.length})
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-[#1C1D24] p-1.5 rounded-full"></div>
                    <p className="text-[#FFFFFFCC] text-sm font-body1">Available</p>
                  </div>
                </div>
                <div className="bg-[#FFFFFF17] h-px w-full my-4" />
                <div className="flex items-center justify-center h-full min-h-[200px]">
                  {loading ? (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#33A0EA]"></div>
                      <p className="text-[#FFFFFF99] text-sm font-body1">
                        Loading tickets...
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-6 items-center justify-between w-full">
                      {renderDots()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full md:w-[40%] space-y-4">
              <div className="bg-black border border-[#FFFFFF1A] p-4 rounded-xl space-y-4 flex flex-col">
                <div className="grid grid-cols-2 gap-3">{renderDots2()}</div>
              </div>

              <div className="bg-[#FFFFFF1A] border border-[#FFFFFF1A] p-4 rounded-xl space-y-4 flex flex-col">
                <p className="text-2xl sm:text-2xl font-header text-btn_gradient_start">
                  Your Ticket
                </p>

                <div className="flex w-full items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6">
                      <TargetIcon />
                    </div>
                    <p className="font-body1 text-base">You own</p>
                  </div>
                  <p className="text-xl text-[#F5CC4F] font-body1">
                    {userTickets.length}{" "}
                    <span className="text-[#FFFFFF] text-base font-body1">tickets</span>
                  </p>
                </div>

     

                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6">
                      <ClockIcon />
                    </div>
                    <p className="font-body1 text-base">Total Prize Pool</p>
                  </div>
                  <p className="text-xl text-[#0AC45E] font-body1">
                    {lotteryData.poolAmount}{" "}
                    <span className="text-[#FFFFFF] text-base font-body1">BFM</span>
                  </p>
                </div>

                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 ">
                      <Trophy isActive={true} />
                    </div>
                    <p className="font-body1 text-base">Ticket Price</p>
                  </div>
                  <p className="text-lg sm:text-xl text-[#FFFFFF] break-words font-body1">
                    1 BFM
                  </p>
                </div>

                <div className="w-full h-px bg-[#FFFFFF1A]" />

                {/* Auto Select Feature */}
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="autoSelect"
                      checked={autoSelect}
                      onChange={(e) => {
                        setAutoSelect(e.target.checked);
                        if (!e.target.checked) {
                          setAutoSelectCount("");
                          setSelectedDots2([]);
                        }
                      }}
                      className="w-4 h-4 text-[#33A0EA] bg-transparent border-2 border-[#FFFFFF33] rounded focus:ring-[#33A0EA] focus:ring-2"
                    />
                    <label
                      htmlFor="autoSelect"
                      className="text-sm font-body1 text-white cursor-pointer"
                    >
                      Auto Select
                    </label>
                  </div>

                  {autoSelect && (
                    <div className="flex flex-col space-y-2">
                      <label className="text-xs text-[#FFFFFF99] font-body1 ">
                        Number of tickets to auto select:
                      </label>
                      <input
                        type="number"
                        value={autoSelectCount}
                        onChange={(e) =>
                          handleAutoSelectCountChange(e.target.value)
                        }
                        placeholder="Enter number of tickets"
                        min="1"
                        max={getAvailableTickets().length}
                        className="w-full px-3 py-2 bg-[#1C1D24] border border-[#FFFFFF33] rounded-lg font-body1 text-white placeholder-[#FFFFFF66] focus:border-[#33A0EA] focus:outline-none text-sm"
                      />
                      <p className="text-xs text-[#FFFFFF66] font-body1">
                        Available BFM: {bfmBalance}
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleBuyTickets}
                  disabled={joining || selectedDots2.length === 0}
                  style={{
                    background:
                      joining || selectedDots2.length === 0
                        ? "#666666"
                        : "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                  }}
                  className="w-full font-body1 rounded-full py-3 text-body text-sm transition-all duration-200 disabled:cursor-not-allowed"
                >
                  {joining
                    ? "Purchasing Tickets..."
                    : selectedDots2.length > 0
                    ? `Buy ${selectedDots2.length} Ticket${
                        selectedDots2.length > 1 ? "s" : ""
                      } (${selectedDots2.length} BFM)`
                    : "Place your Ticket"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-[#FFFFFF1A] rounded-3xl w-full mt-10">
          <div className="flex overflow-x-auto justify-between bg-black rounded-t-3xl py-6 px-4 scrollbar-hide">
            <button
              onClick={() => setActiveTab(0)}
              className={`flex items-center space-x-2 relative  transition-all duration-200 whitespace-nowrap min-w-fit px-2 sm:px-4 ${
                activeTab === 0 ? "" : "hover:text-gray-300"
              }`}
            >
              <div
                style={
                  activeTab === 0
                    ? {
                        background:
                          "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }
                    : { color: "white" }
                }
              >
                <CircleQuestionMark size={22} />
              </div>
              <p
                className="text-base sm:text-xl font-body1"
                style={
                  activeTab === 0
                    ? {
                        background:
                          "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }
                    : { color: "white" }
                }
              >
                How it Works
              </p>
              {activeTab === 0 && (
                <div
                  className="absolute -bottom-5 left-0 right-0 h-px rounded-full"
                  style={{
                    background:
                      "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                  }}
                ></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab(1)}
              className={`flex items-center  space-x-2 relative transition-all duration-200 whitespace-nowrap min-w-fit px-2 sm:px-4 ${
                activeTab === 1 ? "" : "hover:text-gray-300"
              }`}
            >
              <div
                style={
                  activeTab === 1
                    ? {
                        background:
                          "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }
                    : { color: "white" }
                }
              >
                <Trophy size={22} />
              </div>
              <p
                className="text-base sm:text-xl font-body1"
                style={
                  activeTab === 1
                    ? {
                        background:
                          "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }
                    : { color: "white" }
                }
              >
                Winner List
              </p>
              {activeTab === 1 && (
                <div
                  className="absolute -bottom-5 left-0 right-0 h-px rounded-full"
                  style={{
                    background:
                      "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                  }}
                ></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab(2)}
              className={`flex items-center space-x-2 relative transition-all duration-200 whitespace-nowrap min-w-fit px-2 sm:px-4 ${
                activeTab === 2 ? "" : "text-white hover:text-gray-300"
              }`}
            >
              <p
                className="text-base sm:text-xl font-body1"
                style={
                  activeTab === 2
                    ? {
                        background:
                          "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }
                    : { color: "white" }
                }
              >
                Prize Details
              </p>
              {activeTab === 2 && (
                <div
                  className="absolute -bottom-5 left-0 right-0 h-px rounded-full"
                  style={{
                    background:
                      "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                  }}
                ></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab(3)}
              className={`flex items-center space-x-2 relative transition-all duration-200 whitespace-nowrap min-w-fit px-2 sm:px-4 ${
                activeTab === 3 ? "" : "text-white hover:text-gray-300"
              }`}
            >
              <p
                className="text-base sm:text-xl font-body1"
                style={
                  activeTab === 3
                    ? {
                        background:
                          "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }
                    : { color: "white" }
                }
              >
                Admin Controls
              </p>
              {activeTab === 3 && (
                <div
                  className="absolute -bottom-5 left-0 right-0 h-px rounded-full"
                  style={{
                    background:
                      "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                  }}
                ></div>
              )}
            </button>
          </div>

          <div className="flex flex-col p-6 sm:p-10">
            {activeTab === 0 && (
              <div className="flex flex-col">
                <p className="text-gradient font-header text-xl sm:text-xl">
                  How BFM Crypto Box Lottery Works
                </p>
                <ul className="list-disc pl-5 text-sm sm:text-md space-y-4 text-white/80 mt-6 font-body1">
                  <li>
                    Use your BFM tokens to purchase lottery entries (1 BFM = 1
                    entry)
                  </li>
                  <li>Each entry gives you a dot in the lottery table</li>
                  <li>
                    Every Monday, a winner is randomly selected using random.org
                  </li>
                  <li>
                    The winner receives the entire prize pool as a Crypto Box
                  </li>
                  <li>
                    New lottery starts 5 minutes after the previous one ends
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 1 && (
              <div className="flex flex-col">
                <p className="text-gradient font-header text-xl sm:text-xl mb-6">
                  Lottery Winners
                </p>

                {winnersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#33A0EA]"></div>
                  </div>
                ) : winners.length > 0 ? (
                  <div className="overflow-x-auto">
                    <div className="bg-[#1a1b23] rounded-2xl overflow-hidden border border-[#2a2d3a]">
                      {/* Table Header */}
                      <div className="bg-[#0f1117] px-6 py-4">
                        <div className="grid grid-cols-4 gap-4 text-sm font-body1 font-medium text-[#8b949e]">
                          <div>Lottery ID</div>
                          <div>Winner</div>
                          <div>Amount</div>
                          <div>Date</div>
                        </div>
                      </div>

                      {/* Table Body */}
                      <div className="divide-y divide-[#2a2d3a]">
                        {winners.map((winner, index) => (
                          <div
                            key={winner._id || index}
                            className="px-6 py-4 hover:bg-[#21242d] transition-colors duration-200"
                          >
                            <div className="grid grid-cols-4 gap-4 items-center">
                              {/* Lottery ID */}
                              <div className="text-white text-sm font-body1">
                                {winner.lotteryId || "N/A"}
                              </div>

                              {/* Winner */}
                              <div className="text-[#0AC488] text-sm font-medium font-body1">
                                {winner.winner}
                              </div>

                              {/* Amount with BFM */}
                              <div className="flex items-center space-x-2">
                                <span className="text-white text-sm font-medium font-body1">
                                  {winner.ticketCount}
                                </span>
                                <span className="text-[#0AC488] text-sm font-medium font-body1 bg-[#0AC48820] px-2 py-1 rounded">
                                  BFM
                                </span>
                              </div>

                              {/* Date */}
                              <div className="text-[#8b949e] text-sm font-body1">
                                {new Date(winner.resultTime).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "2-digit",
                                    year: "numeric",
                                  }
                                )}{" "}
                                {new Date(winner.resultTime).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer showing count */}
                      <div className="bg-[#0f1117] px-6 py-3 text-center">
                        <p className="text-[#8b949e] text-sm font-body1">
                          Showing {winners.length} of {winners.length} winners
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-[#1a1b23] rounded-2xl border border-[#2a2d3a] p-8">
                      <p className="text-[#8b949e] text-sm">
                        No winners found yet
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === 2 && <></>}
            {activeTab === 3 && <></>}
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1C1D24] border border-[#FFFFFF1A] rounded-xl p-6 max-w-md w-full mx-4">
              <div className="text-center">
                <h3 className="text-xl font-heading2 text-white mb-4">
                  Confirm Purchase
                </h3>
                <p className="text-[#FFFFFF99] mb-6">
                  Are you sure you want to buy {selectedDots2.length} ticket
                  {selectedDots2.length > 1 ? "s" : ""} for{" "}
                  {selectedDots2.length} BFM?
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    disabled={joining}
                    className="flex-1 px-4 py-2 bg-[#FFFFFF1A] text-white rounded-lg hover:bg-[#FFFFFF2A] transition-colors duration-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleJoinLottery}
                    disabled={joining}
                    className="flex-1 px-4 py-2 rounded-lg text-white transition-all duration-200 disabled:opacity-50"
                    style={{
                      background: joining
                        ? "#666666"
                        : "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                    }}
                  >
                    {joining ? "Processing..." : "Yes, Buy Now"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
            <div
              className={`px-6 py-4 rounded-lg shadow-lg border-l-4 max-w-md ${
                toast.type === "success"
                  ? "bg-[#0AC48830] border-[#0AC488] text-[#0AC488]"
                  : "bg-[#FF6B6B30] border-[#FF6B6B] text-[#FF6B6B]"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white">
                  {toast.message}
                </p>
                <button
                  onClick={() => setToast(null)}
                  className="ml-4 text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CryptoBoxLottery;
