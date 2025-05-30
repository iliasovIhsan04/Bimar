import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="#212121"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M3.51 11.22v4.49C3.51 20.2 5.31 22 9.8 22h5.39c4.49 0 6.29-1.8 6.29-6.29v-4.49"
    />
    <Path
      stroke="#212121"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M12.5 12c1.83 0 3.18-1.49 3-3.32L14.84 2h-4.67L9.5 8.68c-.18 1.83 1.17 3.32 3 3.32Z"
    />
    <Path
      stroke="#212121"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M18.81 12c2.02 0 3.5-1.64 3.3-3.65l-.28-2.75C21.47 3 20.47 2 17.85 2H14.8l.7 7.01c.17 1.65 1.66 2.99 3.31 2.99Z"
    />
    <Path
      stroke="#212121"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M6.14 12c1.65 0 3.14-1.34 3.3-2.99l.22-2.21.48-4.8H7.09C4.47 2 3.47 3 3.11 5.6l-.27 2.75C2.64 10.36 4.12 12 6.14 12ZM12.5 17c-1.67 0-2.5.83-2.5 2.5V22h5v-2.5c0-1.67-.83-2.5-2.5-2.5Z"
    />
  </Svg>
);
export default SvgComponent;
