<?php

function getUserIdFromSub($sub){

	require  "../connection.php";
	require	"../_includes/errorMessagesAndDetails.php";

	$query = mysqli_query($conn, "SELECT id FROM users
	WHERE googleSub='" . mysqli_real_escape_string($conn, $sub) . "'");

	if(!$query){
		$response->success = false;
		$response->error->code = 3;
		$response->error->message = ERR_MSG_QUERY_FAILED;
		$response->error->details = "Query fetching user's id failed. Error: " . mysqli_error($conn);
		die(json_encode($response));
	}

	return mysqli_fetch_assoc($query)["id"];

}

?>
