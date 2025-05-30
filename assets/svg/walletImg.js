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
    <G stroke="#008C44" strokeWidth={2} clipPath="url(#a)">
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.991 6.484 15.892 2.5l2.306 3.994-9.207-.01Z"
        clipRule="evenodd"
      />
      <Path
        strokeLinejoin="round"
        d="M2 7.5a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-14Z"
      />
      <Path
        strokeLinejoin="round"
        d="M17.625 17H22v-5h-4.375C16.175 12 15 13.12 15 14.5s1.175 2.5 2.625 2.5Z"
      />
      <Path strokeLinecap="round" d="M22 8.75v12" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 .5h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgComponent
