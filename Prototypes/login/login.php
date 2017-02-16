<?php
$db_name = "cl59-jsjajzin";
$mysql_user = "cl59-jsjajzin";
$mysql_pass = "V^GGgolD";
$server_name = "localhost";

$conn = mysqli_connect($server_name, $mysql_user, $mysql_pass, $db_name);
if(!$conn){
    echo "Connection error: " . mysqli_connect_error();
}

$usernameMail = $_POST("usernameMail");
$password = $_POST("password");

$sql =

?>
