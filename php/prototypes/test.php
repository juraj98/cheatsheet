<?php
header('Content-Type: application/json');	//Needed for not showing ads

echo date(' jS F Y G:i:s A' ,strtotime("2017-02-09T20:37:43.842Z"));
echo "\n";
echo date(' jS F Y G:i:s A' ,strtotime("9.2.2017 18:34"));

?>
