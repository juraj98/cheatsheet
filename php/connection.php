<?php

$db_name = "cheatsheet";
$mysql_user = "cheatsheet";
$mysql_pass = "!.zjkWa!:m:h>>JuiV>=cu%ocBS9\:]#";
$server_name = "localhost";

$conn = mysqli_connect($server_name, $mysql_user, $mysql_pass, $db_name);
if(!$conn){
    die("Connection error: " . mysqli_connect_error());
}

?>
