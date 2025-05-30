import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={39}
    height={39}
    fill="none"
    {...props}
  >
    <Path
      fill="#008C44"
      fillOpacity={0.6}
      d="M26.763 10.528a7.969 7.969 0 1 1-15.937 0 7.969 7.969 0 0 1 15.937 0ZM32.341 28.856c0 4.842-6.065 8.766-13.547 8.766-7.481 0-13.546-3.924-13.546-8.766 0-4.84 6.065-8.765 13.546-8.765 7.482 0 13.547 3.924 13.547 8.765Z"
    />
  </Svg>
)
export default SvgComponent
