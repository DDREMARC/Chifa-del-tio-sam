#!/bin/bash
# =====================================================================
#  El Tío Sam Chifa — pipeline de render scroll-world
#  Ejecutar SIEMPRE con bash (Git Bash en Windows), desde cualquier carpeta:
#
#    bash produccion/render.sh check                 # herramientas + saldo
#    bash produccion/render.sh stills                # 5 escenas (Higgsfield gpt_image_2)
#    VRES=480p bash produccion/render.sh dives       # PREVIZ barata (~$0.28/clip)
#    VRES=480p bash produccion/render.sh frames
#    VRES=480p bash produccion/render.sh connectors
#    bash produccion/render.sh encode                # → assets/video/*.mp4
#    ... aprobado el recorrido, repetir dives/frames/connectors/encode con VRES=1080p
#
#  Cadena móvil nativa 9:16 (opcional, ~2× vídeo):
#    MOBILE=1 bash produccion/render.sh canvases
#    MOBILE=1 VRES=720p bash produccion/render.sh dives   (luego frames, connectors, encode)
#
#  Backend de vídeo: BACKEND=monid (por defecto, USD por clip) | higgsfield (créditos)
#  Regenerar UN clip:  bash produccion/render.sh dive wok   |   bash produccion/render.sh conn 3
# =====================================================================
set -u
cd "$(dirname "$0")/.." || exit 1

P=produccion/prompts
WORK=produccion/_work
ASSETS=assets
NAMES="barrio mercado wok salon plato"
BACKEND="${BACKEND:-monid}"
VRES="${VRES:-1080p}"
MOBILE="${MOBILE:-0}"
if [ "$MOBILE" = "1" ]; then RATIO="9:16"; SFX="-m"; else RATIO="16:9"; SFX=""; fi
DIVE_DUR=8; CONN_DUR=5

# Solo backend higgsfield: UN modelo para toda la cadena (debe aceptar start+end image)
VMODEL="${VMODEL:-seedance_2_0}"
case "$VMODEL" in
  kling3_0)          VOPTS="--mode std --sound off"; DIVE_DUR=10 ;;   # Kling no tiene --resolution
  seedance_2_0_mini) VOPTS="--mode std --resolution 720p" ;;
  *)                 VOPTS="--mode std --resolution 1080p" ;;
esac

mkdir -p "$WORK" "$ASSETS/world" "$ASSETS/video"

# PHP de XAMPP (o el del PATH): solo se usa para leer/escribir JSON
PHP="${PHP:-$(command -v php || echo /c/xampp/php/php.exe)}"

# ---------- utilidades JSON (sin jq: produccion/json.php) ----------
jget() {    # archivo  ruta.con.puntos      p. ej.: jget x.json 0.result_url
  "$PHP" produccion/json.php get "$1" "$2"
}
jstdin() {  # ruta.con.puntos  (lee el JSON por stdin)
  "$PHP" produccion/json.php get - "$1"
}
# ---------- imágenes con ffmpeg (sin Pillow/GD) ----------
to_webp() {  # src dst calidad  (máx. 1800 px de ancho)
  ffmpeg -v error -y -i "$1" -vf "scale='min(1800,iw)':-2" -c:v libwebp -quality "$3" "$2"
}
prompt_of() {  # archivo-de-prompt → texto (con la cláusula vertical en la cadena móvil)
  if [ "$MOBILE" = "1" ]; then printf '%s ' "$(cat "$P/portrait_clause.txt")"; fi
  cat "$1"
}

# ---------- 0. check ----------
do_check() {
  ok=1
  for c in ffmpeg ffprobe curl; do command -v "$c" >/dev/null || { echo "FALTA: $c"; ok=0; }; done
  [ -x "$PHP" ] || command -v "$PHP" >/dev/null || { echo "FALTA: PHP (XAMPP en C:\\xampp\\php)"; ok=0; }
  if ! ffmpeg -hide_banner -sseof -0.1 -f lavfi -i "color=c=black:s=16x16:d=0.5" -frames:v 1 -f null - >/dev/null 2>&1; then
    echo "FFMPEG ANTIGUO: no soporta -sseof / scale=-2. Instala uno moderno, p. ej.:"
    echo "    winget install Gyan.FFmpeg      (y quita el ffmpeg viejo de Python312\\Scripts del PATH)"
    ok=0
  elif ! ffmpeg -hide_banner -encoders 2>/dev/null | grep -q libwebp; then
    echo "FFMPEG sin libwebp: instala la build completa (winget install Gyan.FFmpeg)"; ok=0
  fi
  if command -v higgsfield >/dev/null; then higgsfield workspace list || echo "higgsfield: ejecuta 'higgsfield auth login'";
  else echo "FALTA: Higgsfield CLI (stills + fallback de vídeo)"; ok=0; fi
  if command -v monid >/dev/null; then monid balance; monid keys list;
  else echo "AVISO: Monid CLI no instalado → usa BACKEND=higgsfield para el vídeo"; fi
  [ "$ok" = 1 ] && echo "check OK" || echo "check con faltantes (arriba)"
}

# ---------- 1. stills (siempre Higgsfield gpt_image_2) ----------
gen_still() {
  n=$1
  higgsfield generate create gpt_image_2 --prompt "$(cat "$P/still_$n.txt")" \
    --aspect_ratio 3:2 --resolution 2k --quality high --wait --wait-timeout 15m --json \
    > "$WORK/still_$n.json" 2> "$WORK/still_$n.err"
  url=$(jget "$WORK/still_$n.json" "0.result_url")
  if [ -n "$url" ] && curl -fsSL "$url" -o "$WORK/still_$n.png"; then
    to_webp "$WORK/still_$n.png" "$ASSETS/world/$n.webp" 84
    echo "still $n ok"
  else
    echo "still $n FAIL (ver $WORK/still_$n.err) — reintenta: bash produccion/render.sh still $n"
  fi
}

# ---------- 1b. lienzos verticales para la cadena móvil ----------
do_canvases() {  # 1080×1920 en el granate de la marca, escena al 94 % de ancho, centro al 45 % de alto
  for n in $NAMES; do
    ffmpeg -v error -y -i "$WORK/still_$n.png" \
      -vf "scale=1016:-2:flags=lanczos,pad=1080:1920:(ow-iw)/2:trunc(oh*0.45-ih/2):color=0x2B0A0A" \
      "$WORK/canvas_$n-m.png" && echo "canvas $n-m ok"
  done
}

# ---------- Monid (por defecto): fotogramas por sfs, nunca base64 ----------
monid_frame_url() {  # png  nombre-remoto
  jpg="$WORK/sfs_$2.jpg"
  ffmpeg -v error -y -i "$1" -vf "scale='min(1536,iw)':-2" -q:v 2 "$jpg"
  size=$(wc -c < "$jpg" | tr -d ' ')
  up=$(NO_COLOR=1 monid run -p sfs -e /put \
    -i "{\"path\":\"tiosam/$2.jpg\",\"sizeBytes\":$size,\"ttl\":\"1h\"}" -w 60 -j | jstdin "output.uploadUrl")
  curl -fsS -T "$jpg" "$up" > /dev/null
  # OJO: /cat usa la MISMA ruta relativa dada a /put (no la "home/..." que devuelve)
  NO_COLOR=1 monid run -p sfs -e /cat -i "{\"path\":\"tiosam/$2.jpg\",\"ttl\":\"1d\"}" -w 60 -j \
    | jstdin "output.url"
}
monid_wait() {  # runId  out.json
  while :; do
    NO_COLOR=1 monid runs get -r "$1" -j > "$2" 2>/dev/null
    case "$(jget "$2" "status")" in
      COMPLETED|FAILED|BLOCKED|STOPPED|TIME_OUT) break ;;
    esac
    sleep 8
  done
}
monid_video() {  # prompt-file  out-base  dur  firstPng  [lastPng]
  pf=$1; out=$2; dur=$3
  fu=$(monid_frame_url "$4" "$(basename "$out")_s")
  lu=""; [ -n "${5:-}" ] && lu=$(monid_frame_url "$5" "$(basename "$out")_e")
  prompt_of "$pf" > "$out.prompt.txt"
  "$PHP" produccion/json.php body "$out.prompt.txt" "$fu" "$lu" "$VRES" "$dur" "$RATIO" > "$out.body.json"
  rid=$(NO_COLOR=1 monid run -p bytedance -e /v1/video/seedance-2.0 -f "$out.body.json" -j | jstdin "runId")
  [ -z "$rid" ] && { echo "$(basename "$out") FAIL (no runId)"; return; }
  monid_wait "$rid" "$out.json"
  url=$(jget "$out.json" "output.content.video_url")
  if [ -n "$url" ] && curl -fsSL "$url" -o "$out.mp4"; then
    echo "$(basename "$out") ok (\$$(jget "$out.json" "cost.value"))"
  else
    echo "$(basename "$out") FAIL ($(jget "$out.json" "status"))"
  fi
}

# ---------- Higgsfield (fallback / modelos solo-Higgsfield) ----------
hf_video() {  # prompt-file  out-base  dur  firstPng  [lastPng]
  extra=""; [ -n "${5:-}" ] && extra="--end-image $5"
  # $VOPTS y $extra sin comillas a propósito (separan flags)
  higgsfield generate create "$VMODEL" --prompt "$(prompt_of "$1")" \
    --start-image "$4" $extra $VOPTS --aspect_ratio "$RATIO" --duration "$3" \
    --wait --wait-timeout 20m --json > "$2.json" 2> "$2.err"
  url=$(jget "$2.json" "0.result_url")
  if [ -n "$url" ] && curl -fsSL "$url" -o "$2.mp4"; then echo "$(basename "$2") ok"
  else echo "$(basename "$2") FAIL (ver $2.err)"; fi
}
video() { if [ "$BACKEND" = "higgsfield" ]; then hf_video "$@"; else monid_video "$@"; fi; }

# ---------- 2. dives ----------
gen_dive() {
  n=$1
  if [ "$MOBILE" = "1" ]; then start="$WORK/canvas_$n-m.png"; else start="$WORK/still_$n.png"; fi
  [ -f "$start" ] || { echo "dive $n: falta $start (corre stills/canvases)"; return; }
  video "$P/dive_$n.txt" "$WORK/dive_$n$SFX" "$DIVE_DUR" "$start"
}

# ---------- 3. fotogramas de costura: SIEMPRE de los vídeos renderizados ----------
do_frames() {
  for n in $NAMES; do
    v="$WORK/dive_$n$SFX.mp4"
    [ -f "$v" ] || { echo "frames: falta $v"; continue; }
    ffmpeg -v error -y -ss 0 -i "$v" -frames:v 1 -q:v 2 "$WORK/first_$n$SFX.png"
    ffmpeg -v error -y -sseof -0.15 -i "$v" -frames:v 1 -q:v 2 "$WORK/last_$n$SFX.png"
    echo "frames $n$SFX ok"
  done
}

# ---------- 4. conectores: start = último cuadro de i, end = primer cuadro de i+1 ----------
gen_conn() {  # i  (1..4)
  i=$1; set -- $NAMES
  a=$(eval echo "\${$i}"); b=$(eval echo "\${$((i + 1))}")
  s="$WORK/last_$a$SFX.png"; e="$WORK/first_$b$SFX.png"
  [ -f "$s" ] && [ -f "$e" ] || { echo "conn $i: faltan fotogramas (corre frames)"; return; }
  video "$P/conn_$i.txt" "$WORK/conn_$i$SFX" "$CONN_DUR" "$s" "$e"
}

# ---------- 5. encode para scrub ----------
enc() {  # src dst   escritorio: resolución nativa, crf 20, GOP 8
  ffmpeg -v error -y -i "$1" -an -vf "unsharp=5:5:0.8:5:5:0.0" \
    -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p \
    -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart "$2" && echo "enc $2"
}
encm() {  # src dst   móvil 9:16: 720 de ancho, crf 23, GOP 4
  ffmpeg -v error -y -i "$1" -an -vf "scale=720:-2,unsharp=5:5:0.6:5:5:0.0" \
    -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p \
    -g 4 -keyint_min 4 -sc_threshold 0 -movflags +faststart "$2" && echo "encm $2"
}
do_encode() {
  E=enc; [ "$MOBILE" = "1" ] && E=encm
  for n in $NAMES; do
    [ -f "$WORK/dive_$n$SFX.mp4" ] && $E "$WORK/dive_$n$SFX.mp4" "$ASSETS/video/$n$SFX.mp4"
    if [ "$MOBILE" = "1" ] && [ -f "$WORK/first_$n-m.png" ]; then   # póster = cuadro 0 del clip vertical
      to_webp "$WORK/first_$n-m.png" "$ASSETS/world/$n-m.webp" 82
    fi
  done
  for i in 1 2 3 4; do
    [ -f "$WORK/conn_$i$SFX.mp4" ] && $E "$WORK/conn_$i$SFX.mp4" "$ASSETS/video/conn$i$SFX.mp4"
  done
  ls -la "$ASSETS/video"
}

case "${1:-}" in
  check)      do_check ;;
  stills)     for n in $NAMES; do gen_still "$n" & done; wait ;;
  still)      gen_still "$2" ;;
  canvases)   MOBILE=1; do_canvases ;;
  dives)      for n in $NAMES; do gen_dive "$n" & done; wait ;;
  dive)       gen_dive "$2" ;;
  frames)     do_frames ;;
  connectors) for i in 1 2 3 4; do gen_conn "$i" & done; wait ;;
  conn)       gen_conn "$2" ;;
  encode)     do_encode ;;
  *) sed -n '2,21p' "$0" ;;
esac
