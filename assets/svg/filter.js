import * as React from "react"
import Svg, { Path, Rect } from "react-native-svg"
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="#191919"
      strokeLinecap="round"
      strokeWidth={2}
      d="M6 6H2M17 6h6"
    />
    <Rect
      width={7.5}
      height={7.5}
      x={6.75}
      y={2.75}
      stroke="#191919"
      strokeWidth={2}
      rx={3.75}
    />
    <Path
      stroke="#191919"
      strokeLinecap="round"
      strokeWidth={2}
      d="M22 17h-4M1 17h6"
    />
    <Rect
      width={7.5}
      height={7.5}
      x={-0.75}
      y={0.75}
      stroke="#191919"
      strokeWidth={2}
      rx={3.75}
      transform="matrix(-1 0 0 1 16.5 13)"
    />
  </Svg>
)
export default SvgComponent
