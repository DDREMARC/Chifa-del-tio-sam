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

// Vídeo vertical para redes (1080x1920). Todas las animaciones dependen del
// frame actual: nada de timers ni CSS transitions, así el render es determinista.

export const PROMO_FPS = 30;
export const PROMO_DURATION = 12 * PROMO_FPS;

export type ChifaPromoProps = {
  titulo: string;
  subtitulo: string;
  direccion: string;
};

// Entrada con muelle: sube y aparece. `delay` en frames.
const rise = (frame: number, fps: number, delay: number) => {
  const p = spring({frame: frame - delay, fps, config: {damping: 16, stiffness: 120}});
  return {
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [70, 0])}px)`,
  };
};

// Zoom lento sobre la foto durante toda la escena (efecto Ken Burns).
const kenBurns = (frame: number, total: number, from = 1, to = 1.12) => {
  const scale = interpolate(frame, [0, total], [from, to], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    extrapolateRight: 'clamp',
  });
  return {transform: `scale(${scale})`};
};

const Photo: React.FC<{src: string; total: number}> = ({src, total}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Img
        src={staticFile(src)}
        style={{width: '100%', height: '100%', objectFit: 'cover', ...kenBurns(frame, total)}}
      />
      <AbsoluteFill
        style={{background: `linear-gradient(180deg, ${colors.granate}00 35%, ${colors.granate}F2 100%)`}}
      />
    </AbsoluteFill>
  );
};

const Intro: React.FC<ChifaPromoProps> = ({titulo, subtitulo}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // Sello/aro dorado que se dibuja y la marca que sube letra a letra.
  const ring = spring({frame, fps, config: {damping: 200}, durationInFrames: 40});
  const words = titulo.split(' ');
  return (
    <AbsoluteFill
      style={{background: colors.granate, justifyContent: 'center', alignItems: 'center', padding: 80}}
    >
      <div
        style={{
          position: 'absolute',
          width: 980,
          height: 980,
          borderRadius: '50%',
          border: `6px solid ${colors.dorado}`,
          clipPath: `inset(0 ${interpolate(ring, [0, 1], [100, 0])}% 0 0)`,
          opacity: 0.55,
        }}
      />
      <div style={{textAlign: 'center', fontFamily: displayFont, color: colors.crema}}>
        <div style={{fontSize: 118, fontWeight: 900, lineHeight: 1.02, letterSpacing: -2}}>
          {words.map((w, i) => {
            const p = spring({frame: frame - 8 - i * 5, fps, config: {damping: 14}});
            return (
              <span key={i} style={{display: 'inline-block', marginRight: 22, opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [60, 0])}px)`}}>
                {w}
              </span>
            );
          })}
        </div>
        <div
          style={{
            ...rise(frame, fps, 34),
            marginTop: 36,
            fontFamily: bodyFont,
            fontSize: 32,
            color: colors.dorado,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          {subtitulo}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Dish: React.FC<{src: string; line: string; sub: string; total: number}> = ({src, line, sub, total}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      <Photo src={src} total={total} />
      <div style={{position: 'absolute', left: 80, right: 80, bottom: 260, fontFamily: displayFont, color: colors.crema}}>
        <div style={{fontSize: 96, fontWeight: 900, lineHeight: 1.05, ...rise(frame, fps, 6)}}>{line}</div>
        <div style={{fontFamily: bodyFont, fontSize: 40, marginTop: 24, color: colors.dorado, ...rise(frame, fps, 16)}}>
          {sub}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC<ChifaPromoProps> = ({direccion}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: colors.granate, justifyContent: 'center', alignItems: 'center', padding: 90}}>
      <div style={{textAlign: 'center', fontFamily: displayFont, color: colors.crema}}>
        <div style={{fontSize: 92, fontWeight: 900, lineHeight: 1.05, ...rise(frame, fps, 0)}}>
          Wok a fuego vivo.
        </div>
        <div style={{fontFamily: bodyFont, fontSize: 46, marginTop: 56, color: colors.dorado, ...rise(frame, fps, 14)}}>
          {direccion}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ChifaPromo: React.FC<ChifaPromoProps> = (props) => {
  // Reparto de la duración: 12 s = intro 3 s + tres platos 2.5 s + cierre 2.5 s
  return (
    <AbsoluteFill style={{background: colors.granate}}>
      <Sequence durationInFrames={90}>
        <Intro {...props} />
      </Sequence>
      <Sequence from={90} durationInFrames={75}>
        <Dish src="img/chaufa_pollo.jpg" line="Chaufa de pollo" sub="Arroz al wok, al momento" total={75} />
      </Sequence>
      <Sequence from={165} durationInFrames={75}>
        <Dish src="img/chaufa_chancho.jpg" line="Chaufa de chancho" sub="Sazón de la casa" total={75} />
      </Sequence>
      <Sequence from={240} durationInFrames={75}>
        <Dish src="img/chaufa_carne.jpg" line="Chaufa de carne" sub="Tres versiones, un solo sabor" total={75} />
      </Sequence>
      <Sequence from={315} durationInFrames={45}>
        <Outro {...props} />
      </Sequence>
    </AbsoluteFill>
  );
};
