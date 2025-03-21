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

$videoURL = $_POST["videoURL"];
$videoTitle = isset($_POST["videoTitle"]) ? $_POST["videoTitle"] : "";
$timeWatched = isset($_POST["timeWatched"]) ? $_POST["timeWatched"] : "";
$lastWatched = isset($_POST["lastWatched"]) ? $_POST["lastWatched"] : "";
$viewedCount = isset($_POST["viewedCount"]) ? $_POST["viewedCount"] : "";
$newLink = isset($_POST["newLink"]) ? $_POST["newLink"] : "";

// insert values
$stmt = $conn->prepare("SELECT * FROM Video WHERE videoURL = ?");
$stmt->execute([$videoURL]);
$numRows = $stmt->fetchColumn();

if ($numRows == 0) {
    $query = "INSERT INTO Video (videoURL, title,timeWatched, lastWatched,viewedCount) 
    VALUES(?, ?, 0,?,0)";

    $stmt = $conn->prepare($query);
    $stmt->execute([$videoURL, $videoTitle, $lastWatched]);
} else {
    $query = "UPDATE Video SET ";
    $executeArr = [];

    $commas = 0;

    if ($timeWatched !== "") {
        $commas++;
        $query = $query . "timeWatched = timeWatched + ?";
        $executeArr[] = $timeWatched;
    }

    if ($lastWatched !== "") {
        if($commas == 1) {
            $query = $query . ",";    
        }

        $commas++;

        $query = $query . "lastWatched = ?";
        $executeArr[] = $lastWatched;
    }

    if ($viewedCount !== "") {
        if($commas >= 1) {
            $query = $query . ",";    
        }

        $query = $query . "viewedCount = viewedCount + ?";
        $executeArr[] = $viewedCount;
    }

    $executeArr[] = $videoURL;
    $query = $query . " WHERE videoURL = ?";

    $stmt = $conn->prepare($query);
    $stmt->execute($executeArr);

    if ($lastWatched !== "" && $newLink == "false") {
        $query = "UPDATE History SET duration = duration + ?
        WHERE videoURL = ? AND watched = ?";
        
        $stmt = $conn->prepare($query);
        $stmt->execute([$timeWatched,$videoURL,$lastWatched]);
    }   
}

if ($newLink == "true") {
    $query = "INSERT INTO History (videoURL, title, watched,duration) 
    VALUES(?, ?, ?,0)";

    $stmt = $conn->prepare($query);
    $stmt->execute([$videoURL, $videoTitle, $lastWatched]);
}

?>