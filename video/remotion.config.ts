import {Config} from '@remotion/cli/config';

// Salida por defecto en /out (ignorada por git desde video/.gitignore)
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setCodec('h264');

// Navegador de render: Microsoft Edge instalado en el sistema.
// El chrome-headless-shell que descarga Remotion está bloqueado por la
// directiva de Control de aplicaciones de Windows en esta máquina.
// Si Edge se mueve o se desinstala, cambia esta ruta o quita la línea
// (Remotion usará su navegador descargado en ese caso).
Config.setBrowserExecutable('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe');
