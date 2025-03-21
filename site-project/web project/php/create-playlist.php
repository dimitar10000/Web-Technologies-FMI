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

$type = $_POST["type"];

$sql = "use $dbName";
$conn->exec($sql);

if ($type == "local") {
  $playlist = "CREATE TABLE IF NOT EXISTS PlaylistLocal (
    position INT(10) UNSIGNED PRIMARY KEY,
    title VARCHAR(200) NOT NULL
    )";

  try {
    $conn->exec($playlist);
    echo "local";
  } catch (PDOException $e) {
    echo $playlist . "<br>" . $e->getMessage();
  }
} else {
  $playlist = "CREATE TABLE IF NOT EXISTS PlaylistYT (
    position INT(10) UNSIGNED PRIMARY KEY,
    videoURL VARCHAR(200) NOT NULL,
    title VARCHAR(200) NOT NULL
    )";

  try {
    $conn->exec($playlist);
    echo "yt";
  } catch (PDOException $e) {
    echo $playlist . "<br>" . $e->getMessage();
  }
}
?>