<?php
header('Content-Type: application/json');	//Needed for not showing ads
require_once  "../connection.php";

$sql = "DELETE FROM classMembers WHERE userId = 56";
$query = mysqli_query($conn, $sql);

if($query) {
  die("Bendarik killed");
} else {
  die("Bednarik survived");
}

?>
