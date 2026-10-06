<?php
// RESERVA DE MESA: recibe los campos enviados desde el formulario de contacto.html.
// PRÓXIMAMENTE: la función aún no está disponible. Para abrirla, poner true aquí
// y quitar "disabled" del <fieldset> (y el velo) en contacto.html.
const RESERVAS_ACTIVAS = false;

date_default_timezone_set("America/Lima");
header("Content-Type: text/html; charset=utf-8");

// RESPUESTA: igual que en el proyecto anterior, un aviso y regreso al formulario.
function responder($mensaje) {
    // JSON_HEX_TAG: un nombre con "</script>" no puede romper el script del aviso
    echo '<script>alert(' . json_encode($mensaje, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG) . ');'
       . ' window.location.href="../html/contacto.html#reservar";</script>';
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // EN PAUSA: no se guarda nada mientras las reservas en línea no estén activas.
    if (!RESERVAS_ACTIVAS) {
        responder("Las reservas en línea estarán disponibles próximamente. Reserva por teléfono o WhatsApp al +51 987 654 321.");
    }

    // DATOS POST: nombres coinciden con los atributos name del formulario.
    $nombres = trim($_POST["nombres"] ?? "");
    $telefono = trim($_POST["telefono"] ?? "");
    $correo = trim($_POST["correo"] ?? "");
    $fecha = trim($_POST["fecha"] ?? "");
    $hora = trim($_POST["hora"] ?? "");
    $personas = (int) ($_POST["personas"] ?? 0);
    $comentarios = trim($_POST["comentarios"] ?? "");

    // VALIDACIÓN: el navegador ya revisa el formulario, pero el servidor no se fía.
    $dia = DateTime::createFromFormat("!Y-m-d", $fecha);
    if ($nombres === "" || mb_strlen($nombres) > 60) responder("Escribe tu nombre.");
    if (!preg_match('/^[0-9 +()-]{7,20}$/', $telefono)) responder("Escribe un teléfono válido.");
    if ($correo !== "" && (strlen($correo) > 80 || !filter_var($correo, FILTER_VALIDATE_EMAIL))) responder("El correo no es válido.");
    if (!$dia || $dia->format("Y-m-d") !== $fecha || $dia < new DateTime("today")) responder("Elige una fecha de hoy en adelante.");
    if ($dia->format("N") === "1") responder("Los lunes estamos cerrados: elige de martes a domingo.");
    if (!preg_match('/^\d{2}:\d{2}$/', $hora) || $hora < "12:00" || $hora > "21:30") responder("Elige una hora entre 12:00 y 21:30.");
    if ($personas < 1 || $personas > 30) responder("Indica de 1 a 30 personas.");
    if (mb_strlen($comentarios) > 300) responder("El comentario puede tener hasta 300 caracteres.");

    // CONEXIÓN MYSQLI: host, usuario root y contraseña vacía de XAMPP local.
    mysqli_report(MYSQLI_REPORT_OFF);
    $conexion = mysqli_connect("localhost", "root", "");
    if (!$conexion) {
        responder("No pudimos conectar con la base de datos. Escríbenos por WhatsApp al +51 987 654 321.");
    }
    mysqli_set_charset($conexion, "utf8mb4");

    // SELECCIÓN DE BASE DE DATOS: usa la base tiosam_chifa (php/tiosam_chifa.sql).
    if (!mysqli_select_db($conexion, "tiosam_chifa")) {
        responder("Falta crear la base de datos tiosam_chifa (importa php/tiosam_chifa.sql).");
    }

    // INSERT SQL: consulta preparada, los valores viajan aparte del SQL.
    $sql = "INSERT INTO reservas (nombres, telefono, correo, fecha, hora, personas, comentarios)
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    $consulta = mysqli_prepare($conexion, $sql);
    $guardado = false;
    if ($consulta) {
        mysqli_stmt_bind_param($consulta, "sssssis", $nombres, $telefono, $correo, $fecha, $hora, $personas, $comentarios);
        $guardado = mysqli_stmt_execute($consulta);
        mysqli_stmt_close($consulta);
    }
    mysqli_close($conexion);

    if ($guardado) {
        responder("¡Listo, " . $nombres . "! Recibimos tu reserva para " . $personas . " persona(s) el "
            . $dia->format("d/m/Y") . " a las " . $hora . ".");
    }
    responder("Problemas al guardar la reserva. Inténtalo de nuevo o escríbenos por WhatsApp.");
} else {
    // ACCESO DIRECTO: vuelve al formulario si no se envió por POST.
    header("Location: ../html/contacto.html#reservar");
    exit;
}
