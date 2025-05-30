import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="#008C44"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M18.5 4h-13a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1Z"
    />
    <Path
      stroke="#008C44"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 2v3M15 2v3M8 9.5h8M8 13.5h6M8 17.5h4"
    />
  </Svg>
)
export default SvgComponent
