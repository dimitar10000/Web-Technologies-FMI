<?php

include './server-vars.php';

// establish connection
try {
  $conn = new PDO("mysql:host={$serverName}", $username, $password);
  // set the PDO error mode to exception
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch(PDOException $e) {
  echo "Connection failed: " . $e->getMessage();
}

$table = isset($_POST["table"]) ? $_POST["table"] : "";

$sql = "use $dbName";
$conn->exec($sql);

$type = $_POST["type"];

if ($type === "yt") {

    $position = $_POST["position"];

    $sql = 'DELETE FROM PlaylistYT WHERE position = ?';
    $stmt = $conn->prepare($sql);
    $stmt->execute([$position]);

    $sql = 'UPDATE PlaylistYT SET position = position-1 WHERE position > ?';
    $stmt = $conn->prepare($sql);
    $stmt->execute([$position]);

    echo "successfully removed entry";
}
else {
    $position = $_POST["position"];

    $sql = 'DELETE FROM PlaylistLocal WHERE position = ?';
    $stmt = $conn->prepare($sql);
    $stmt->execute([$position]);

    $sql = 'UPDATE PlaylistLocal SET position = position-1 WHERE position > ?';
    $stmt = $conn->prepare($sql);
    $stmt->execute([$position]);

    echo "successfully removed entry";
}

?>