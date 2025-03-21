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

$sql = "CREATE DATABASE IF NOT EXISTS $dbName";

// create database
try {
  $conn->exec($sql);
  echo "Database created successfully<br>";

} catch(PDOException $e) {
  echo $database . "<br>" . $e->getMessage();
}

$sql = "use $dbName";
$conn->exec($sql);

// create tables
$videoTable = "CREATE TABLE IF NOT EXISTS Video (
  videoURL VARCHAR(200)  PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  timeWatched DOUBLE(15,3) UNSIGNED NOT NULL,
  lastWatched DATETIME NOT NULL,
  viewedCount INT(10) UNSIGNED NOT NULL
  )";

try {
$conn->exec($videoTable);
  echo "Table Video created successfully";
} catch(PDOException $e) {
  echo $videoTable . "<br>" . $e->getMessage();
}

$historyTable = "CREATE TABLE IF NOT EXISTS History (
  videoURL VARCHAR(200) ,
  title VARCHAR(200),
  watched DATETIME,
  duration DOUBLE(15,3) UNSIGNED,
  PRIMARY KEY (videoURL,watched)
  )";

try {
  $conn->exec($historyTable);
    echo "Table History created successfully";
  } catch(PDOException $e) {
    echo $historyTable . "<br>" . $e->getMessage();
  }

?>