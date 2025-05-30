import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    {...props}
  >
    <Path
      stroke="#fff"
      strokeLinejoin="round"
      strokeWidth={1.125}
      d="M3 17.25V4.5h12v12.75H3Z"
    />
    <Path
      stroke="#fff"
      strokeWidth={1.125}
      d="M6.017 6S5.591.75 9 .75C12.41.75 11.983 6 11.983 6"
    />
  </Svg>
)
export default SvgComponent
