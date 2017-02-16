<?php

require_once  "../connection.php";

require_once	"../_includes/decodeIdToken.php";
require_once	"../_includes/checkPostVariables.php";
require_once	"../_includes/checkIfMemberOfClass.php";
require_once	"../_includes/getUserIdFromSub.php";

header('Content-Type: application/json');	//Needed for not showing ads

//Check post variables
checkPostVariables('idToken', 'classId');

//Decode ID token
$idTokenData = decodeIdToken($_POST['idToken']);
//Get user id
$userId = getUserIdFromSub($idTokenData->{"sub"});
//Check if user is member of class
ckeckIfMemberOfClass($userId, $_POST['classId']);

//Select reminders
$sql = "SELECT * FROM reminders WHERE
(classId=" . mysqli_real_escape_string($conn, $_POST['classId']) . "
AND dateOfReminder>=" .	(!empty($_POST["from"]) ? "'".mysqli_real_escape_string($conn, $_POST['from']) . "' " : "CURDATE() " ) .
(!empty($_POST["to"]) ? "AND dateOfReminder<='" . mysqli_real_escape_string($conn, $_POST['to']) . "' " : " " );


if(!empty($_POST['filters'])){
	$sql .= " AND (";
	$filtersLength = count($_POST['filters']);
	for($i = 0; $i < $filtersLength; $i++){
		 $sql .=  " type=" . mysqli_real_escape_string($conn, $_POST["filters"][$i]) . ($filtersLength == ($i+1) ? " " : " OR ");
	}
	$sql .= ") ";
}

$sql .= (!empty($_POST['numberOfReminders']) ? ") LIMIT " . mysqli_real_escape_string($conn, $_POST['numberOfReminders']) : ") LIMIT 10");

$query = mysqli_query($conn, $sql);

if($query) {
	$response->success = true;
	$response->data->reminders = mysqli_fetch_all($query, MYSQLI_ASSOC);

} else {
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = "Query failed.";
	$response->error->details = "Query fetching reminders failed. Error: " . mysqli_error($conn);
}

die(json_encode($response));

?>
