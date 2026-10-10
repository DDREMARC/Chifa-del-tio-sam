import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {bodyFont, colors, displayFont} from './theme';

// Reel vertical 9:16 de 15 s para TikTok / Instagram (1080x1920, 30 fps).
// Zona segura: el texto vive entre el 15 % superior y el 25 % inferior libre,
// porque la interfaz de la app tapa la parte de abajo (descripción, botones)
// y la columna derecha. Nada importante por debajo de y=1450.

export const REEL_FPS = 30;
export const REEL_DURATION = 15 * REEL_FPS;
const SAFE_BOTTOM = 470; // px libres abajo para la UI de la app

// Entrada con muelle. `delay` en frames.
const springIn = (frame: number, fps: number, delay: number, damping = 13) => {
  const p = spring({frame: frame - delay, fps, config: {damping, stiffness: 170}});
  return {
    opacity: interpolate(p, [0, 0.15], [0, 1], {extrapolateRight: 'clamp'}),
    transform: `translateY(${interpolate(p, [0, 1], [90, 0])}px) scale(${interpolate(p, [0, 1], [0.92, 1])})`,
  };
};

// Título: cada letra sube desde abajo con muelle, escalonadas.
const LetterRise: React.FC<{text: string; delay: number; size: number; color: string}> = ({
  text,
  delay,
  size,
  color,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div
      style={{
        fontFamily: displayFont,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.0,
        color,
        textAlign: 'center',
        letterSpacing: -2,
        whiteSpace: 'pre-wrap',
      }}
      aria-label={text}
    >
      {Array.from(text).map((ch, i) => {
        const p = spring({frame: frame - delay - i * 2, fps, config: {damping: 11, stiffness: 200}});
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: interpolate(p, [0, 0.2], [0, 1], {extrapolateRight: 'clamp'}),
              transform: `translateY(${interpolate(p, [0, 1], [120, 0])}px)`,
            }}
          >
            {ch === ' ' ? ' ' : ch}
          </span>
        );
      })}
    </div>
  );
};

// Foto de fondo con zoom rápido al entrar y lento después.
const Plate: React.FC<{src: string; total: number}> = ({src, total}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 12, total], [1.25, 1.08, 1.16], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: 'clamp',
  });
  const fade = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: fade}}>
      <Img
        src={staticFile(src)}
        style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})`}}
      />
      {/* Velo oscuro radial: contraste para el texto centrado, sin tapar el plato */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 42%, ${colors.granate}B3 0%, ${colors.granate}40 45%, ${colors.granate}E6 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// Bloque de texto centrado en la franja segura.
const Column: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill
    style={{
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: 70,
      paddingRight: 70,
      paddingTop: 260,
      paddingBottom: SAFE_BOTTOM,
    }}
  >
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36}}>{children}</div>
  </AbsoluteFill>
);

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: colors.granate}}>
      <Column>
        <LetterRise text="El Tío Sam" delay={0} size={150} color={colors.crema} />
        <LetterRise text="Chifa" delay={14} size={190} color={colors.dorado} />
        <div
          style={{
            ...springIn(frame, fps, 30),
            fontFamily: bodyFont,
            fontWeight: 600,
            fontSize: 46,
            color: colors.crema,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          Wok a fuego vivo
        </div>
      </Column>
    </AbsoluteFill>
  );
};

const Dish: React.FC<{src: string; title: string; sub: string; total: number}> = ({src, title, sub, total}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      <Plate src={src} total={total} />
      <Column>
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 600,
            fontSize: 44,
            color: colors.dorado,
            letterSpacing: 6,
            textTransform: 'uppercase',
            ...springIn(frame, fps, 0, 16),
          }}
        >
          Chaufa
        </div>
        <LetterRise text={title} delay={4} size={132} color={colors.crema} />
        <div style={{...springIn(frame, fps, 30), fontFamily: bodyFont, fontSize: 52, color: colors.crema}}>
          {sub}
        </div>
      </Column>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: colors.granate}}>
      <Column>
        <LetterRise text="Pide tu chaufa" delay={0} size={120} color={colors.crema} />
        <div style={{...springIn(frame, fps, 26), fontFamily: bodyFont, fontSize: 48, color: colors.dorado}}>
          Barrios Altos, Lima
        </div>
      </Column>
    </AbsoluteFill>
  );
};

// 15 s = 1.5 s intro + 3 × 3.5 s (carne, chancho, pollo) + 3 s cierre.
export const ChifaReel: React.FC = () => {
  return (
    <AbsoluteFill style={{background: colors.granate}}>
      <Sequence durationInFrames={45}>
        <Intro />
      </Sequence>
      <Sequence from={45} durationInFrames={105}>
        <Dish src="img/chaufa_carne.jpg" title="De carne" sub="Sabor de la casa" total={105} />
      </Sequence>
      <Sequence from={150} durationInFrames={105}>
        <Dish src="img/chaufa_chancho.jpg" title="De chancho" sub="Al wok, al momento" total={105} />
      </Sequence>
      <Sequence from={255} durationInFrames={105}>
        <Dish src="img/chaufa_pollo.jpg" title="De pollo" sub="Tres versiones, un sabor" total={105} />
      </Sequence>
      <Sequence from={360} durationInFrames={90}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
