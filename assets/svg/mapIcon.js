import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        fill="#008C44"
        d="M11.5 2C7.359 2 4 5.191 4 9.125c0 5.344 7.5 13.232 7.5 13.232S19 14.47 19 9.125C19 5.191 15.641 2 11.5 2Zm0 9.67c-1.479 0-2.679-1.14-2.679-2.545s1.2-2.545 2.679-2.545c1.479 0 2.679 1.14 2.679 2.545s-1.2 2.545-2.679 2.545Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgComponent
