<?php

header('Content-Type: application/json');	//Needed for not showing ads

if(isset($_POST["date"])) {
	 die(date('jS F Y G:i:s' ,strtotime($_POST["date"])));
} else {
	die("No date recieved");
}

?>
