import { loginStyles } from "@/styles/login/styles";
import React from "react";
import { View } from "react-native";
import Svg, { Circle, G, Path } from "react-native-svg";

// Componente para crear el patrón de ondas en la parte superior
const LoginWavePattern = () => {
  return (
    <View style={loginStyles.wavePatternContainer}>
      {/* Primera capa de ondas */}
      <Svg
        height="100%"
        width="100%"
        viewBox="0 0 1440 320"
        style={loginStyles.waveSvg}
      >
        <Path
          fill="rgba(255, 255, 255, 0.08)"
          d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </Svg>

      {/* Segunda capa de ondas */}
      <Svg
        height="100%"
        width="100%"
        viewBox="0 0 1440 320"
        style={loginStyles.waveSvg}
      >
        <Path
          fill="rgba(255, 255, 255, 0.12)"
          d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,80C672,64,768,64,864,96C960,128,1056,192,1152,202.7C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </Svg>

      {/* Tercera capa con círculos decorativos */}
      <Svg height="100%" width="100%" style={loginStyles.circlesSvg}>
        <G opacity="0.15">
          <Circle cx="80%" cy="30%" r="20" fill="white" />
          <Circle cx="90%" cy="20%" r="8" fill="white" />
          <Circle cx="10%" cy="40%" r="15" fill="white" />
          <Circle cx="25%" cy="15%" r="10" fill="white" />
          <Circle cx="60%" cy="10%" r="12" fill="white" />
        </G>
      </Svg>
    </View>
  );
};

export default LoginWavePattern;
