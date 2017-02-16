<?php

require_once  "../connection.php";

require_once	"../_includes/decodeIdToken.php";
require_once	"../_includes/checkPostVariables.php";
require_once	"../_includes/checkIfMemberOfClass.php";
require_once	"../_includes/getUserIdFromSub.php";

require_once	"../_includes/errorMessagesAndDetails.php";

header('Content-Type: application/json');	//Needed for not showing ads

//Check post variables
checkPostVariables('idToken', 'classId');

mysqli_set_charset($conn, 'utf8');

//Decode ID token
$idTokenData = decodeIdToken($_POST['idToken']);
//Get user id
$userId = getUserIdFromSub($idTokenData->{"sub"});
//Check if user is member of class
ckeckIfMemberOfClass($userId, $_POST['classId']);

//Get timetable
if(isset($_POST['days'])){
	$daysToGet = "";
	$days = json_decode($_POST['days']);
	for($i = 0; $i < count($days);){
		$daysToGet .= getDayById($days[$i]) . (++$i == count($days) ? "" : ", ");
	}
} else {
	$daysToGet = "sunday, monday, tuesday, wednesday, thursday, friday, saturday";
}

$sql = "SELECT " . mysqli_real_escape_string( $conn, $daysToGet) . " FROM timetables WHERE class='" . mysqli_real_escape_string( $conn, $_POST['classId'] )  . "'";
$query = mysqli_query($conn, $sql);


if($query) {
	$data = mysqli_fetch_all($query, MYSQLI_ASSOC);

	$data[0]["monday"] = json_decode($data[0]["monday"]);
	$data[0]["tuesday"] = json_decode($data[0]["tuesday"]);
	$data[0]["wednesday"] = json_decode($data[0]["wednesday"]);
	$data[0]["thursday"] = json_decode($data[0]["thursday"]);
	$data[0]["friday"] = json_decode($data[0]["friday"]);
	$data[0]["saturday"] = json_decode($data[0]["saturday"]);
	$data[0]["sunday"] = json_decode($data[0]["sunday"]);

	$response->success = true;
	$response->data->timetable = $data[0];

	die(json_encode($response));
} else {
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = ERR_MSG_QUERY_FAILED;
	$response->error->details = "Query fetching timetable failed. Error: " . mysqli_error($conn);
	die(json_encode($response));
}

function getDayById($_id){
    switch($_id){
        case 0:
            return "sunday";
        case 1:
            return "monday";
        case 2:
            return "tuesday";
        case 3:
            return "wednesday";
        case 4:
            return "thursday";
        case 5:
            return "friday";
        case 6:
            return "saturday";
    }
}

?>
