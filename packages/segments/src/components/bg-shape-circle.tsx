import { cn } from "@/lib/utils";

export function BGShapeCircle(props: { className?: string }) {
  return (
    <svg
      className={cn("absolute grayscale opacity-15 -z-10", props.className)}
      width="1600"
      height="960"
      viewBox="0 0 1600 960"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_3_6)">
        <g filter="url(#filter0_f_3_6)">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M1112.5 136C1250.48 134.69 1383.71 222.089 1426.44 353.296C1469.24 484.719 1386.83 614.295 1275.98 696.847C1159.96 783.243 1005.91 837.868 887.712 754.477C765.644 668.355 746.294 499.609 797.498 359.268C843.204 233.998 979.159 137.266 1112.5 136Z"
            fill="url(#paint0_linear_3_6)"
          />
        </g>
        <g filter="url(#filter1_f_3_6)">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M1112.43 203.179C1162.9 185.222 1211.19 115.199 1258.44 140.416C1307.82 166.765 1277.67 249.464 1297.35 301.857C1309.7 334.741 1351.6 355.287 1352.32 390.407C1353.09 427.591 1297.72 451.157 1301.17 488.188C1305.84 538.412 1374.41 568.715 1373.62 619.149C1372.94 662.557 1343.52 702.215 1314.5 734.5C1280.8 771.987 1238.58 828.91 1188.3 825.289C1129.9 821.084 1105.58 745.083 1061.9 706.094C1037.01 683.878 1010.01 665.838 984.966 643.798C961.737 623.355 940.893 601.807 918.79 580.153C890.547 552.484 828.331 536.317 835.583 497.45C844.262 450.936 945.588 462.573 949.527 415.42C955.126 348.415 837.497 302.833 857.215 238.551C871.979 190.417 956.497 237.031 1006.37 230.119C1042.9 225.056 1077.69 215.544 1112.43 203.179Z"
            fill="url(#paint1_linear_3_6)"
          />
        </g>
        <g filter="url(#filter2_f_3_6)">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M1102.11 216.16C1151.42 221.123 1206.33 197.48 1248.01 224.281C1289.66 251.063 1295.25 308.559 1315.83 353.591C1334.49 394.392 1412.85 371.545 1424 415C1438.19 470.321 1425.53 598.446 1390.16 643.285C1352.49 691.028 1268.66 644.789 1212.59 668.331C1166.85 687.535 1149.53 749.627 1102.11 764.222C1050.65 780.064 1003.55 757.861 953.5 738C899.413 716.536 843.851 699.414 828.5 643.285C812.303 584.062 866.94 538.348 868.93 476.983C870.817 418.798 832.197 369.056 846 312.5C859.646 256.587 889.409 242.857 943.883 224.281C997.008 206.165 1046.27 210.539 1102.11 216.16Z"
            fill="url(#paint2_linear_3_6)"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_f_3_6"
          x="571"
          y="-64.0145"
          width="1066.95"
          height="1059.89"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_3_6" />
        </filter>
        <filter
          id="filter1_f_3_6"
          x="635"
          y="-65"
          width="938.631"
          height="1090.45"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_3_6" />
        </filter>
        <filter
          id="filter2_f_3_6"
          x="607.503"
          y="-6.75818"
          width="1040.2"
          height="994.371"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="109" result="effect1_foregroundBlur_3_6" />
        </filter>
        <linearGradient
          id="paint0_linear_3_6"
          x1="771"
          y1="795.872"
          x2="1512.24"
          y2="485.826"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#6CACE4" />
          <stop offset="0.0666667" stop-color="#6CACE4" />
          <stop offset="0.133333" stop-color="#6DADE4" />
          <stop offset="0.2" stop-color="#6FAEE5" />
          <stop offset="0.266667" stop-color="#72B0E5" />
          <stop offset="0.333333" stop-color="#75B3E6" />
          <stop offset="0.4" stop-color="#79B6E7" />
          <stop offset="0.466667" stop-color="#7DB9E8" />
          <stop offset="0.533333" stop-color="#82BDEA" />
          <stop offset="0.6" stop-color="#86C0EB" />
          <stop offset="0.666667" stop-color="#8AC3EC" />
          <stop offset="0.733333" stop-color="#8DC6ED" />
          <stop offset="0.8" stop-color="#90C8ED" />
          <stop offset="0.866667" stop-color="#92C9EE" />
          <stop offset="0.933333" stop-color="#93CAEE" />
          <stop offset="1" stop-color="#93CAEE" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_3_6"
          x1="835"
          y1="825.454"
          x2="1471.97"
          y2="619.81"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#6CACE4" />
          <stop offset="0.0666667" stop-color="#6CACE4" />
          <stop offset="0.133333" stop-color="#6DADE4" />
          <stop offset="0.2" stop-color="#6FAEE5" />
          <stop offset="0.266667" stop-color="#72B0E5" />
          <stop offset="0.333333" stop-color="#75B3E6" />
          <stop offset="0.4" stop-color="#79B6E7" />
          <stop offset="0.466667" stop-color="#7DB9E8" />
          <stop offset="0.533333" stop-color="#82BDEA" />
          <stop offset="0.6" stop-color="#86C0EB" />
          <stop offset="0.666667" stop-color="#8AC3EC" />
          <stop offset="0.733333" stop-color="#8DC6ED" />
          <stop offset="0.8" stop-color="#90C8ED" />
          <stop offset="0.866667" stop-color="#92C9EE" />
          <stop offset="0.933333" stop-color="#93CAEE" />
          <stop offset="1" stop-color="#93CAEE" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_3_6"
          x1="555.118"
          y1="493.292"
          x2="1085.39"
          y2="1067.09"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#E25544" />
          <stop offset="1" stop-color="#620C90" />
        </linearGradient>
        <clipPath id="clip0_3_6">
          <rect width="1600" height="960" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
