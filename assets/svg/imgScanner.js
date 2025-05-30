import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { forwardRef } from "react"
const SvgComponent = (props, ref) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    ref={ref}
    {...props}
  >
    <Path
      stroke="#F9671C"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 3H4a1 1 0 0 0-1 1v4M8 21H4a1 1 0 0 1-1-1v-4M16 21h4a1 1 0 0 0 1-1v-4M16 3h4a1 1 0 0 1 1 1v4M17 12H7M13.5 8h-3M13.5 16h-3"
    />
  </Svg>
)
const ForwardRef = forwardRef(SvgComponent)
export default ForwardRef
