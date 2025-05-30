import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={25}
    fill="none"
    {...props}
  >
    <G
      stroke="#008C44"
      strokeLinejoin="round"
      strokeWidth={2}
      clipPath="url(#a)"
    >
      <Path d="M12 22.5s7.5-6 7.5-12.5a7.5 7.5 0 0 0-15 0c0 6.5 7.5 12.5 7.5 12.5Z" />
      <Path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 .5h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgComponent
