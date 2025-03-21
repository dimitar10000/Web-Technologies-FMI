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

if ($table === "stats") {
    try {
        $sql = "TRUNCATE TABLE Video";
        $conn->exec($sql);
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}

if ($table === "history") {
    $customInput = $_POST["customInput"];
    $period = $_POST["period"];

    try {
        $dateTime = new DateTime("now", new DateTimeZone("Europe/Sofia"));
        $localTime = $dateTime->getTimestamp() + $dateTime->getOffset() - 3600;

        $currDate = date("Y-m-d H:i:s", $localTime);

        if($customInput !== "") {
            
            $plural = "";
            if($customInput > 1) {
                $plural = "s";
            }

            $timestamp = strtotime("-" . $customInput . "day" . $plural,$localTime);
            $dateAgo = date("Y-m-d H:i:s", $timestamp);

            echo $dateAgo . " " . $currDate;
            
            $query = "DELETE FROM History WHERE watched BETWEEN ? AND ?";
            $stmt = $conn->prepare($query);
            $stmt->execute([$dateAgo,$currDate]);
        }
        else if($period !== "") {
            if($period == "week") {
                $timestamp = strtotime("- 1 week",$localTime);
            }
            else if($period == "month") {
                $timestamp = strtotime("- 1 month",$localTime);
            }
            else if($period == "year") {
                $timestamp = strtotime("- 1 year",$localTime);
            }

            $dateAgo = date("Y-m-d H:i:s", $timestamp);

            echo $dateAgo . " " . $currDate;
            
            $query = "DELETE FROM History WHERE watched BETWEEN ? AND ?";
            $stmt = $conn->prepare($query);
            $stmt->execute([$dateAgo,$currDate]);

        }
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}

?>