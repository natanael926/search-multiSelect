<?php
	
	// $arrayName = array('nombre' => $_POST['datos'],  'apellido' => 'acosta');
 	
 	$pruebaN = json_decode($_POST['datos']);

 	error_log(print_r($pruebaN, true));

 	echo json_encode(array());