import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const LoginWaveCurve = ({ color }: { color: string }) => {
  const { width } = Dimensions.get("window");

  // Versión con curvas cúbicas para máxima suavidad
  const createSmoothWavePath = () => {
    const amplitude = 30; // Amplitud de las olas
    const baseY = 50; // Línea base

    let path = `M0,0 `;

    // Primera bajada suave hacia la línea base
    path += `L0,${baseY} `;

    // Primera ola suave usando curvas cúbicas de Bézier
    // C x1,y1 x2,y2 x,y
    // Control points para suavidad máxima
    const cp1x = width * 0.15; // Primer punto de control
    const cp1y = baseY - amplitude * 0.8;
    const cp2x = width * 0.35; // Segundo punto de control
    const cp2y = baseY - amplitude * 0.8;
    const endx = width * 0.5; // Punto final
    const endy = baseY;

    path += `C${cp1x},${cp1y} ${cp2x},${cp2y} ${endx},${endy} `;

    // Segunda ola (valle hacia arriba) con curvas cúbicas
    const cp3x = width * 0.65; // Tercer punto de control
    const cp3y = baseY + amplitude * 0.8;
    const cp4x = width * 0.85; // Cuarto punto de control
    const cp4y = baseY + amplitude * 0.8;
    const end2x = width; // Punto final
    const end2y = baseY;

    path += `C${cp3x},${cp3y} ${cp4x},${cp4y} ${end2x},${end2y} `;

    // Línea final hacia arriba y cierre
    path += `L${width},0 `;
    path += `L${width},120 L0,120 Z`;

    return path;
  };

  return (
    <View style={styles.waveCurveContainer}>
      <Svg
        height="100%"
        width={width}
        viewBox={`0 0 ${width} 100`}
        style={styles.curveSvg}
      >
        {/* Usar la versión ultra suave */}
        <Path d={createSmoothWavePath()} fill={color} />

        {/* Alternativa con múltiples ondas suaves: */}
        {/* <Path d={createUltraSmoothWavePath()} fill={color} /> */}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  waveCurveContainer: {
    height: 100,
    marginTop: -100,
    zIndex: 10,
  },
  curveSvg: {
    position: "absolute",
    top: 0,
  },
});

export default LoginWaveCurve;
