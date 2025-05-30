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
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 11v5m0 5a9 9 0 1 1 0-18 9 9 0 0 1 0 18Zm.05-13v.1h-.1V8h.1Z"
    />
  </Svg>
)
export default SvgComponent
