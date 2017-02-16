<?php

	function checkPostVariables(){
    foreach (func_get_args() as $param) {
			if(!isset($_POST[$param])){
				$response->success = false;
				$response->error->details = $response->error->details . "Missing '$param' post variable. ";
			}
    }

		if($response->success === false){
			$response->error->code = 1;
			$response->error->message = "Did not recieved all needed variables on post.";
			die(json_encode($response));
		}
	}

?>
