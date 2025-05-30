import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={25}
    fill="none"
    {...props}
  >
    <Path
      fill="#008C44"
      fillRule="evenodd"
      d="M5 22.5a3 3 0 0 1-3-3v-12a3 3 0 0 1 3-3h1v-1a1 1 0 0 1 2 0v1h8v-1a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5Zm3-5H4v2a1 1 0 0 0 1 1h3v-3Zm6 0h-4v3h4v-3Zm6 0h-4v3h3a1 1 0 0 0 1-1v-2Zm-12-5H4v3h4v-3Zm6 0h-4v3h4v-3Zm6 0h-4v3h4v-3Zm-14-6H5a1 1 0 0 0-1 1v3h16v-3a1 1 0 0 0-1-1h-1v1a1 1 0 1 1-2 0v-1H8v1a1 1 0 0 1-2 0v-1Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default SvgComponent
