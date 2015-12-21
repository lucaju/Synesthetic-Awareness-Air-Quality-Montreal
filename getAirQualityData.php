<?php

$air = simplexml_load_file("http://ville.montreal.qc.ca/rsqa/servlet/makeXmlActuel?date=".$_GET['date']);
echo json_encode($air)

?>