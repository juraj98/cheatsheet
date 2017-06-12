<?php

$db_name = "********";
$mysql_user = "********";
$mysql_pass = "********";
$server_name = "********";

$conn = mysqli_connect($server_name, $mysql_user, $mysql_pass, $db_name);
if(!$conn){
    die("Connection error: " . mysqli_connect_error());
}

?>
