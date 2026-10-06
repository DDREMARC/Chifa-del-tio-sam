<?php
// HELPER JSON de render.sh (sustituye a jq/Python), con el PHP de XAMPP:
//   php json.php get  <archivo|->  <ruta.con.puntos>    imprime el valor ("" si no existe)
//   php json.php body <prompt.txt> <urlInicio> <urlFin|""> <resolucion> <duracion> <ratio>
$orden = $argv[1] ?? "";

if ($orden === "get") {
    $origen = $argv[2] ?? "-";
    $texto = $origen === "-" ? stream_get_contents(STDIN) : @file_get_contents($origen);
    $dato = json_decode((string) $texto, true);
    // RUTA: "0.result_url", "output.content.video_url"... (los índices numéricos también valen)
    foreach (explode(".", $argv[3] ?? "") as $clave) {
        if (!is_array($dato) || !array_key_exists($clave, $dato)) { $dato = null; break; }
        $dato = $dato[$clave];
    }
    echo is_bool($dato) ? ($dato ? "true" : "false") : (is_scalar($dato) ? $dato : "");
    exit(0);
}

if ($orden === "body") {
    // CUERPO DE LA PETICIÓN a Seedance 2.0 en Monid: imágenes por URL (nunca base64)
    [, , $prompt, $inicio, $fin, $resolucion, $duracion, $ratio] = $argv + array_fill(0, 8, "");
    $contenido = [
        ["type" => "text", "text" => trim((string) file_get_contents($prompt))],
        ["type" => "image_url", "image_url" => ["url" => $inicio], "role" => "first_frame"],
    ];
    if ($fin !== "") {
        $contenido[] = ["type" => "image_url", "image_url" => ["url" => $fin], "role" => "last_frame"];
    }
    echo json_encode([
        "content" => $contenido,
        "resolution" => $resolucion,
        "duration" => (int) $duracion,
        "ratio" => $ratio,
        "generate_audio" => false,
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit(0);
}

fwrite(STDERR, "uso: php json.php get <archivo|-> <ruta>  |  php json.php body <prompt> <inicio> <fin> <res> <dur> <ratio>\n");
exit(1);
