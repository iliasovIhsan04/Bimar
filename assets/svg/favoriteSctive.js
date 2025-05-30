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
      fill="#DD2B1C"
      d="M22.5 8.69c0 1.19-.19 2.29-.52 3.31H3.02c-.33-1.02-.52-2.12-.52-3.31C2.5 5.6 4.99 3.1 8.06 3.1c1.81 0 3.43.88 4.44 2.23a5.549 5.549 0 0 1 4.44-2.23c3.07 0 5.56 2.5 5.56 5.59ZM21.98 12c-1.58 5-6.45 7.99-8.86 8.81-.34.12-.9.12-1.24 0C9.47 19.99 4.6 17 3.02 12h18.96Z"
      opacity={0.4}
    />
  </Svg>
);
export default SvgComponent;
