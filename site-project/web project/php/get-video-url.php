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

$title = $_POST["title"];
$position = $_POST["position"];

$sql = 'SELECT videoURL FROM Video WHERE title = ?';

$stmt = $conn->prepare($sql);
$stmt->execute([$title]);

$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
$url = $result[0]['videoURL'];

$resultArr = ["url" => "{$url}","title" => "{$title}","position" => "{$position}"];
$encoded = json_encode($resultArr);

echo $encoded;
?>