<?php


$air = simplexml_load_file("http://ville.montreal.qc.ca/rsqa/servlet/makeXmlActuel?date=151209");
echo json_encode($air)

?>