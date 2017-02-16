<?php
function ckeckIfMemberOfClass($userId, $classId) {

	require  "../connection.php";


	$query = mysqli_query($conn, "SELECT * FROM classMembers
	WHERE userId='" . mysqli_real_escape_string($conn, $userId) . "' AND classId='" . mysqli_real_escape_string($conn, $classId) . "'");


	if(!$query){
		$response->success = false;
		$response->error->code = 3;
		$response->error->message = "Query failed.";
		$response->error->details = "Query checking if user is member of class failed. Error: " . mysqli_error($conn);
		die(json_encode($response));
	}

	if(mysqli_num_rows($query) == 0) {
		$response->success = false;
		$response->error->code = 4;
		$response->error->message = "User don’t have permissions.";
		$response->error->details = "User it's not a memeber of a class.";
		die(json_encode($response));
	}

	return;

}

?>
