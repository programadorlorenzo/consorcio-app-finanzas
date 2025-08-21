import { loginStyles } from "@/styles/login/styles";
import React from "react";
import { Dimensions, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const LoginWaveCurve = ({ color }: { color: string }) => {
  const { width } = Dimensions.get("window");

  return (
    <View style={loginStyles.waveCurveContainer}>
      <Svg
        height="100%"
        width={width}
        viewBox={`0 0 ${width} 120`}
        style={loginStyles.curveSvg}
      >
        <Path
          d={`M0,0 C${width * 0.33},80 ${
            width * 0.66
          },80 ${width},0 L${width},120 L0,120 Z`}
          fill={color}
        />
      </Svg>
    </View>
  );
};

export default LoginWaveCurve;
