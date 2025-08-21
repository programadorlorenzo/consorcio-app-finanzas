import { MAIN_COLOR } from "@/app/constants";
import { loginStyles } from "@/styles/login/styles";
import React from "react";
import { View } from "react-native";
import Svg, { Circle, G, Path } from "react-native-svg";

// Componente para patrones en la sección blanca - Mejorado
const LoginWhitePatterns = () => {
  return (
    <View style={loginStyles.whitePatternContainer}>
      <Svg height="100%" width="100%" style={loginStyles.whitePatternSvg}>
        <G opacity="0.07">
          <Circle cx="85%" cy="85%" r="50" fill={MAIN_COLOR} />
          <Circle cx="15%" cy="65%" r="35" fill={MAIN_COLOR} />
          <Circle cx="50%" cy="90%" r="25" fill={MAIN_COLOR} />
          <Path
            d="M0,50 Q100,100 200,50 T400,50"
            stroke={MAIN_COLOR}
            strokeWidth="2"
            fill="none"
          />
          <Path
            d="M0,80 Q150,130 300,80 T600,80"
            stroke={MAIN_COLOR}
            strokeWidth="2"
            fill="none"
          />
          <Path
            d="M0,150 Q120,190 240,150 T480,150"
            stroke={MAIN_COLOR}
            strokeWidth="1.5"
            fill="none"
          />
          <Path
            d="M100,220 Q220,260 340,220 T580,220"
            stroke={MAIN_COLOR}
            strokeWidth="1.5"
            fill="none"
          />
        </G>
      </Svg>
    </View>
  );
};

export default LoginWhitePatterns;
