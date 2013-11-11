<?php
	
 	$parametroFiltro = json_decode($_POST['datos']);

 	$sql = "";

 	foreach ($parametroFiltro as $key => $value) {
 		
 		if($value->type == 'multiDate') {

 			if(strlen($value->values->fechaInicio) > 0 && strlen($value->values->fechaFinal) > 0){
 				$sql .= " " . $value->columna . " BETWEEN  " . $value->values->fechaInicio . " AND ". $value->values->fechaFinal;
 			} else if(strlen($value->values->fechaInicio) > 0){
 				$sql .= " " . $value->columna . "  > " . $value->values->fechaInicio;
 			} else if(strlen($value->values->fechaFinal) > 0){
 				$sql .= " " . $value->columna . " <  " . $value->values->fechaFinal;	
 			}

 			// $sql .= " " . $value->columna . " = " . $value->values->valor;
 		}else if($value->type == 'select') {
 			$sql .= " " . $value->columna . " = " . $value->values->valor;
 		}

 		error_log($sql);
 	}


 	echo json_encode(array());