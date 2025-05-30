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
      stroke="#904BE8"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8.75 3h-4a1 1 0 0 0-1 1v4M8.75 21h-4a1 1 0 0 1-1-1v-4M16.75 21h4a1 1 0 0 0 1-1v-4M16.75 3h4a1 1 0 0 1 1 1v4M17.75 12h-10M14.25 8h-3M14.25 16h-3"
    />
  </Svg>
)
export default SvgComponent
