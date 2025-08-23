import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
    Circle,
    Defs,
    Path,
    Pattern,
    Rect
} from 'react-native-svg';

const MAIN_COLOR = "#1D3935";

export const GeometricPattern = ({ opacity = 0.1 }: { opacity?: number }) => (
  <View style={[StyleSheet.absoluteFillObject, { opacity }]}>
    <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
      <Defs>
        <Pattern
          id="geometricPattern"
          patternUnits="userSpaceOnUse"
          width="40"
          height="40"
        >
          <Rect width="40" height="40" fill="transparent" />
          <Circle cx="20" cy="20" r="1.5" fill={MAIN_COLOR} opacity="0.3" />
          <Circle cx="0" cy="0" r="1" fill={MAIN_COLOR} opacity="0.2" />
          <Circle cx="40" cy="40" r="1" fill={MAIN_COLOR} opacity="0.2" />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#geometricPattern)" />
    </Svg>
  </View>
);

export const WavePattern = ({ opacity = 0.1 }: { opacity?: number }) => (
  <View style={[StyleSheet.absoluteFillObject, { opacity }]}>
    <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
      <Defs>
        <Pattern
          id="wavePattern"
          patternUnits="userSpaceOnUse"
          width="100"
          height="20"
        >
          <Path
            d="M0,10 Q25,0 50,10 T100,10 L100,20 L0,20 Z"
            fill={MAIN_COLOR}
            opacity="0.1"
          />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#wavePattern)" />
    </Svg>
  </View>
);

export const DiamondPattern = ({ opacity = 0.08 }: { opacity?: number }) => (
  <View style={[StyleSheet.absoluteFillObject, { opacity }]}>
    <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
      <Defs>
        <Pattern
          id="diamondPattern"
          patternUnits="userSpaceOnUse"
          width="30"
          height="30"
        >
          <Rect width="30" height="30" fill="transparent" />
          <Path
            d="M15,5 L25,15 L15,25 L5,15 Z"
            fill={MAIN_COLOR}
            opacity="0.15"
          />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#diamondPattern)" />
    </Svg>
  </View>
);

export const HexagonPattern = ({ opacity = 0.06 }: { opacity?: number }) => (
  <View style={[StyleSheet.absoluteFillObject, { opacity }]}>
    <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
      <Defs>
        <Pattern
          id="hexPattern"
          patternUnits="userSpaceOnUse"
          width="50"
          height="43.3"
        >
          <Path
            d="M25,2 L43.3,12.5 L43.3,31.8 L25,42.3 L6.7,31.8 L6.7,12.5 Z"
            fill="none"
            stroke={MAIN_COLOR}
            strokeWidth="1"
            opacity="0.2"
          />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#hexPattern)" />
    </Svg>
  </View>
);
