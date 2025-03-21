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

    $sql = 'SELECT * FROM PlaylistYT';
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $jsonArr = [];

    foreach ($result as $row) {
        $jsonArr[] = $row;
    }

    echo json_encode($jsonArr);
}
else {
    $sql = 'SELECT * FROM PlaylistLocal';
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $jsonArr = [];

    foreach ($result as $row) {
        $jsonArr[] = $row;
    }

    echo json_encode($jsonArr);
}

?>