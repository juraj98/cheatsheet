<?php

	require	"../_includes/errorMessagesAndDetails.php";

	function checkPostVariables(){
    foreach (func_get_args() as $param) {
			if(!isset($_POST[$param])){
				$response->success = false;
				$response->error->details = $response->error->details . "Missing '$param' post variable. ";
			}
    }

		if($response->success === false){
			$response->error->code = 1;
			$response->error->message = ERR_MSG_MISSING_POST;
			die(json_encode($response));
		}
	}

?>
