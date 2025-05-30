import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={19}
    height={12}
    fill="none"
    {...props}
  >
    <Path
      fill="#191919"
      d="M2.261 12H.398L4.585.364h2.029L10.8 12H8.937l-3.29-9.523h-.09L2.26 12Zm.313-4.557h6.045V8.92H2.574V7.443Zm11.47-7.08V12h-1.699V.364h1.699Zm3.984 0V12H16.33V.364h1.698Z"
    />
  </Svg>
)
export default SvgComponent
