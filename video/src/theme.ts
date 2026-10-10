// Paleta de css/style.css de la web: misma marca en el vídeo.
export const colors = {
  granate: '#2B0A0A',
  rojo: '#BE1A1A',
  bermellon: '#D0311E',
  dorado: '#F7D87F',
  crema: '#F8EBAB',
  verde: '#5E8C3A',
} as const;

// Fraunces (titulares) y Work Sans (texto), igual que la web.
// Se cargan con @remotion/google-fonts para que el render no dependa del sistema.
import {loadFont as loadFraunces} from '@remotion/google-fonts/Fraunces';
import {loadFont as loadWorkSans} from '@remotion/google-fonts/WorkSans';

export const {fontFamily: displayFont} = loadFraunces('normal', {
  weights: ['600', '900'],
  subsets: ['latin'],
});

export const {fontFamily: bodyFont} = loadWorkSans('normal', {
  weights: ['400', '600'],
  subsets: ['latin'],
});
