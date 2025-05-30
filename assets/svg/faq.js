import * as React from "react";
import Svg, { Path, Circle } from "react-native-svg";

const FaqIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Circle
      cx={12}
      cy={12}
      r={9}  
      stroke="#008C44"
      strokeWidth={1.5}
    />
    <Path
      stroke="#008C44"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 18h.01M12 14c0-2 2-2 2-4a2 2 0 1 0-4 0"
    />
  </Svg>
);

export default FaqIcon;
