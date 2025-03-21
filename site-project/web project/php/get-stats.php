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

$table = $_POST["table"];
$top = isset($_POST["top"]) ? $_POST["top"] : 0;

if ($table === "longestWatched") {

    $sql = 'SELECT title,timeWatched,lastWatched,videoURL FROM Video ORDER BY timeWatched DESC LIMIT ?';

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(1,$top,PDO::PARAM_INT);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $jsonArr = [];

    foreach ($result as $row) {
        $jsonArr[] = $row;
    }

    echo json_encode($jsonArr);
}
else if($table === "mostWatched"){
    $sql = 'SELECT title,viewedCount,lastWatched,videoURL FROM Video ORDER BY viewedCount DESC LIMIT ?';
    
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(1,$top,PDO::PARAM_INT);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $jsonArr = [];

    foreach ($result as $row) {
        $jsonArr[] = $row;
    }
    
    echo json_encode($jsonArr);
}
else if($table === "history") {
    $sql = 'SELECT title,watched,duration,videoURL FROM History ORDER BY watched DESC';
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