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
$operation = $_POST["operation"];

if ($operation == "insert") {

  if ($type == "local") {
    $title = $_POST["title"];
    $position = $_POST["position"];

    $query = "INSERT INTO PlaylistLocal (position,title) 
    VALUES(?,?)";

    $stmt = $conn->prepare($query);
    $stmt->execute([$position, $title]);
  } else {
    $title = $_POST["title"];
    $url = $_POST["url"];
    $position = $_POST["position"];

    $query = "INSERT INTO PlaylistYT (position,videoURL,title) 
    VALUES(?,?,?)";

    $stmt = $conn->prepare($query);
    $stmt->execute([$position, $url, $title]);
  }
}

if ($operation == "shift") {
  $position = $_POST["position"];
  $direction = $_POST["direction"];

  if ($type == "yt") {
    $sql = "SELECT videoURL,title FROM PlaylistYT WHERE position = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$position]);

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $selectedURL = $result[0]["videoURL"];
    $selectedTitle = $result[0]["title"];

    if ($direction == "up") {
      $sql = "SELECT videoURL,title FROM PlaylistYT WHERE position = ? - 1";
      $stmt = $conn->prepare($sql);
      $stmt->execute([$position]);

      $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

      $prevURL = $result[0]["videoURL"];
      $prevTitle = $result[0]["title"];

      $sql = "UPDATE PlaylistYT SET videoURL = ?,title = ? WHERE position = ? - 1";
      $stmt = $conn->prepare($sql);
      $stmt->execute([$selectedURL, $selectedTitle, $position]);

      $sql = "UPDATE PlaylistYT SET videoURL = ?,title = ? WHERE position = ?";
      $stmt = $conn->prepare($sql);
      $stmt->execute([$prevURL, $prevTitle, $position]);

    } else {
      $sql = "SELECT videoURL,title FROM PlaylistYT WHERE position = ? + 1";
      $stmt = $conn->prepare($sql);
      $stmt->execute([$position]);

      $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

      $nextURL = $result[0]["videoURL"];
      $nextTitle = $result[0]["title"];

      $sql = "UPDATE PlaylistYT SET videoURL = ?,title = ? WHERE position = ? + 1";
      $stmt = $conn->prepare($sql);
      $stmt->execute([$selectedURL, $selectedTitle, $position]);

      $sql = "UPDATE PlaylistYT SET videoURL = ?,title = ? WHERE position = ?";
      $stmt = $conn->prepare($sql);
      $stmt->execute([$nextURL, $nextTitle, $position]);
    }

  } else {
    $sql = "SELECT title FROM PlaylistLocal WHERE position = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$position]);

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $selectedTitle = $result[0]["title"];

    if ($direction == "up") {
      $sql = "SELECT title FROM PlaylistLocal WHERE position = ? - 1";
      $stmt = $conn->prepare($sql);
      $stmt->execute([$position]);

      $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
      $prevTitle = $result[0]["title"];

      $sql = "UPDATE PlaylistLocal SET title = ? WHERE position = ? - 1";
      $stmt = $conn->prepare($sql);
      $stmt->execute([$selectedTitle, $position]);

      $sql = "UPDATE PlaylistLocal SET title = ? WHERE position = ?";
      $stmt = $conn->prepare($sql);
      $stmt->execute([$prevTitle, $position]);

    } else {
      $sql = "SELECT title FROM PlaylistLocal WHERE position = ? + 1";
      $stmt = $conn->prepare($sql);
      $stmt->execute([$position]);

      $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
      $nextTitle = $result[0]["title"];

      $sql = "UPDATE PlaylistLocal SET title = ? WHERE position = ? + 1";
      $stmt = $conn->prepare($sql);
      $stmt->execute([$selectedTitle, $position]);

      $sql = "UPDATE PlaylistLocal SET title = ? WHERE position = ?";
      $stmt = $conn->prepare($sql);
      $stmt->execute([$nextTitle, $position]);
    }
  }
}

?>