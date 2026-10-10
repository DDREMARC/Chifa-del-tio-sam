import React from 'react';
import {Composition} from 'remotion';
import {ChifaPromo, ChifaPromoProps, PROMO_DURATION, PROMO_FPS} from './ChifaPromo';
import {ChifaReel, REEL_DURATION, REEL_FPS} from './ChifaReel';
import {ChifaAntojo, ANTOJO_DURATION, ANTOJO_FPS} from './ChifaAntojo';

const defaultProps: ChifaPromoProps = {
  titulo: 'El Tío Sam Chifa',
  subtitulo: 'Comida china-peruana · Barrios Altos',
  direccion: 'Jr. Cantón 245, Barrios Altos, Lima',
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
    <Composition
      id="ChifaPromo"
      component={ChifaPromo}
      durationInFrames={PROMO_DURATION}
      fps={PROMO_FPS}
      width={1080}
      height={1920}
      defaultProps={defaultProps}
    />
    <Composition
      id="ChifaReel"
      component={ChifaReel}
      durationInFrames={REEL_DURATION}
      fps={REEL_FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="ChifaAntojo"
      component={ChifaAntojo}
      durationInFrames={ANTOJO_DURATION}
      fps={ANTOJO_FPS}
      width={1080}
      height={1920}
    />
    </>
  );
};
