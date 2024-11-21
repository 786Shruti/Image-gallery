<?php
header('Content-Type: application/json');

// Include configuration file
include 'config.php';

// Simple authentication (adjust as needed)
$authenticated = true; // Replace with actual authentication logic

if ($authenticated) {
    echo json_encode(['apiKey' => API_KEY]);
} else {
    http_response_code(403); // Forbidden
    echo json_encode(['error' => 'Unauthorized']);
}
?>
