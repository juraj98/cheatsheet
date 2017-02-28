<?php

require_once  "../connection.php";

require_once	"../_includes/decodeIdToken.php";
require_once	"../_includes/checkPostVariables.php";
require_once	"../_includes/checkIfMemberOfClass.php";
require_once	"../_includes/getUserIdFromSub.php";

require_once	"../_includes/errorMessagesAndDetails.php";

header('Content-Type: application/json');	//Needed for not showing ads

//Check post variables
checkPostVariables('idToken');

//Decode ID token
$idTokenData = decodeIdToken($_POST['idToken']);
//Get user id
$userId = getUserIdFromSub($idTokenData->{"sub"});

if(empty($_POST['offset'])){
	$_POST['offset'] = 0;
}

if(empty($_POST['limit'])){
	$_POST['limit'] = 10;
}

//Select reminders

$sql = "
SELECT r.*, c.nameShort
FROM reminders r, classMembers cm, classes c
WHERE
	c.classId=cm.classId
	AND
	r.classId=cm.classId
	AND
	cm.userId=$userId
	AND
	dateOfReminder>=" .	(!empty($_POST["from"]) ? "'".mysqli_real_escape_string($conn, $_POST['from']) . "' " : "CURDATE() " ) .
	(!empty($_POST["to"]) ? "AND dateOfReminder<='" . mysqli_real_escape_string($conn, $_POST['to']) . "' " : " " );
if(!empty($_POST['filters'])){
	$sql .= " AND (";
	$filtersLength = count($_POST['filters']);
	for($i = 0; $i < $filtersLength; $i++){
		 $sql .=  " type=" . mysqli_real_escape_string($conn, $_POST["filters"][$i]) . ($filtersLength == ($i+1) ? " " : " OR ");
	}
	$sql .= ") ";
};
$sql .= " ORDER BY dateOfReminder ASC LIMIT " . mysqli_real_escape_string($conn, $_POST['limit']) . " OFFSET " . mysqli_real_escape_string($conn, $_POST['offset']);

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
