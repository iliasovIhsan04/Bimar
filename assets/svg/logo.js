import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    fill="none"
    {...props}
  >
    <Rect width={39} height={39} x={0.5} y={0.5} fill="#fff" rx={19.5} />
    <Rect width={39} height={39} x={0.5} y={0.5} stroke="#9519AD" rx={19.5} />
    <Rect width={32} height={32} x={4} y={4} fill="#9519AD" rx={16} />
    <Path
      fill="#fff"
      d="M23.103 14.024 23.683 9h-7.151l.58 5.024H12L13.852 30h12.503l1.853-15.976h-5.113.008Zm-4.444-3.131h2.9l-.364 3.131h-2.172l-.364-3.131Zm6.017 17.21h-9.13l-1.41-12.186H26.09l-1.412 12.187h-.003Z"
    />
    <Path
      fill="#fff"
      d="m15.694 22.01 4.414 4.414 4.413-4.414-4.413-4.414-4.414 4.414Zm4.414 1.739-1.739-1.739 1.739-1.738 1.738 1.738-1.738 1.739Z"
    />
  </Svg>
)
export default SvgComponent

