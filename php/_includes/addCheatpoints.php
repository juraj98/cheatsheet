<?php
function addCheatpoints($userId, $number = 1) {

	require  "../connection.php";
	require	"../_includes/errorMessagesAndDetails.php";


	$query = mysqli_query($conn, "UPDATE users SET cheatpoints=cheatpoints+$number
	WHERE id='$userId'");

	if(!$query){
		$response->success = false;
		$response->error->code = 3;
		$response->error->message = ERR_MSG_QUERY_FAILED;
		$response->error->details = "Query adding cheatpoints failed failed. Error: " . mysqli_error($conn);
		die(json_encode($response));
	}

	return;

}

?>
