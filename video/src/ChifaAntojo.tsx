import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {displayFont} from './theme';

// Animación de 120 fotogramas (4 s a 30 fps, 1080x1920).
// Todo el movimiento sale de useCurrentFrame(): sin Math.random ni timers,
// así cada render es idéntico. Las "aleatoriedades" usan una semilla fija.

export const ANTOJO_FPS = 30;
export const ANTOJO_DURATION = 120;

const BG = '#0D0D0D';
const GOLD = '#E5A93B';

// Física pedida: tension 120 → stiffness, friction 14 → damping.
const SPRING = {stiffness: 120, damping: 14, mass: 1};

// Hash determinista: devuelve un número en [0, 1) a partir de una semilla.
const seeded = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// Rotación aleatoria sutil en [-15, 15] grados, fija por ingrediente.
const randomTilt = (seed: number) => -15 + seeded(seed) * 30;

// Ingrediente que cae y rebota al tocar el arroz.
// Marcador: recorte circular de la foto del plato hasta tener PNG reales.
const Ingredient: React.FC<{
  src: string;
  delay: number;
  x: number;
  y: number;
  seed: number;
}> = ({src, delay, x, y, seed}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: SPRING});
  const tilt = randomTilt(seed);
  const rotate = interpolate(p, [0, 1], [tilt, 0]);
  const drop = interpolate(p, [0, 1], [-760, 0]);
  const opacity = interpolate(frame, [delay, delay + 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 150,
        top: y - 150,
        width: 300,
        height: 300,
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
        transform: `translateY(${drop}px) rotate(${rotate}deg)`,
        opacity,
      }}
    >
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </div>
  );
};

// Humo: partículas semitransparentes que suben en los primeros 40 fotogramas.
const Smoke: React.FC = () => {
  const frame = useCurrentFrame();
  const particles = Array.from({length: 12}, (_, i) => i);
  return (
    <>
      {particles.map((i) => {
        const delay = Math.floor(seeded(i + 1) * 12);
        const local = frame - delay;
        const t = Math.max(0, Math.min(local / 40, 1));
        const x = 300 + seeded(i + 40) * 480;
        const size = 140 + seeded(i + 80) * 120;
        const rise = interpolate(t, [0, 1], [0, -420], {easing: Easing.out(Easing.quad)});
        // Opacidad máxima 0.2, se desvanece al final de los 40 fotogramas.
        const alpha = interpolate(t, [0, 0.3, 1], [0, 0.2, 0]);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - size / 2,
              top: 760 - size / 2,
              width: size,
              height: size,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,236,210,1) 0%, rgba(255,236,210,0) 70%)',
              opacity: alpha,
              filter: 'blur(8px)',
              transform: `translateY(${rise}px) scale(${1 + t * 0.4})`,
            }}
          />
        );
      })}
    </>
  );
};

// Plato: arriba al centro. Desde el fotograma 100 baja y se reduce con
// cubic-bezier(0.16, 1, 0.3, 1). Esa transformación la comparten el plato y
// los ingredientes (ver ChifaAntojo), para que todo encaje junto.
const Plate: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        left: 540 - 380,
        top: 1000 - 380,
        width: 760,
        height: 760,
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: '0 40px 90px rgba(0,0,0,0.7)',
      }}
    >
      <Img src={staticFile('img/chaufa_pollo.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </div>
  );
};

// Título: aparece en el fotograma 100 con transición de opacidad.
const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [100, 116], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: 230,
        textAlign: 'center',
        fontFamily: displayFont,
        fontWeight: 600,
        fontSize: 96,
        lineHeight: 1.08,
        color: GOLD,
        opacity,
      }}
    >
      ¿Qué se te antoja hoy?
    </div>
  );
};

export const ChifaAntojo: React.FC = () => {
  const frame = useCurrentFrame();
  // Mismo recorrido para plato e ingredientes: baja y se reduce desde el 100.
  const t = interpolate(frame, [100, 120], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const scale = interpolate(t, [0, 1], [1, 0.7]);
  const dy = interpolate(t, [0, 1], [0, 640]);
  return (
    <AbsoluteFill style={{background: BG, overflow: 'hidden'}}>
      <Smoke />
      <AbsoluteFill
        style={{
          transformOrigin: '540px 1000px',
          transform: `translateY(${dy}px) scale(${scale})`,
        }}
      >
        <Plate />
        <Ingredient src="img/chaufa_pollo.jpg" delay={8} x={430} y={880} seed={1} />
        <Ingredient src="img/chaufa_carne.jpg" delay={22} x={660} y={760} seed={2} />
      </AbsoluteFill>
      <Title />
    </AbsoluteFill>
  );
};
