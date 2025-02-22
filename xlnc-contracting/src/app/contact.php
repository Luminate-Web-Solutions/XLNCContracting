<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Database configuration
$config = [
    'host' => 'localhost',
    'username' => 'your_username',
    'password' => 'your_password',
    'database' => 'xlnc_db'
];

// Response function
function sendResponse($status, $message) {
    echo json_encode([
        'status' => $status,
        'message' => $message
    ]);
    exit;
}

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse('error', 'Invalid request method');
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required_fields = ['name', 'email', 'phone', 'message'];
foreach ($required_fields as $field) {
    if (empty($data[$field])) {
        sendResponse('error', "Missing required field: {$field}");
    }
}

// Validate email
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    sendResponse('error', 'Invalid email format');
}

// Sanitize input data
$name = filter_var($data['name'], FILTER_SANITIZE_STRING);
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$phone = filter_var($data['phone'], FILTER_SANITIZE_STRING);
$message = filter_var($data['message'], FILTER_SANITIZE_STRING);

try {
    // Create database connection
    $conn = new mysqli(
        $config['host'],
        $config['username'],
        $config['password'],
        $config['database']
    );

    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Create contacts table if not exists
    $sql = "CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";

    if (!$conn->query($sql)) {
        throw new Exception("Error creating table: " . $conn->error);
    }

    // Prepare and execute insert statement
    $stmt = $conn->prepare("INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $name, $email, $phone, $message);

    if (!$stmt->execute()) {
        throw new Exception("Error saving contact: " . $stmt->error);
    }

    // Optional: Send email notification
    $to = "info@xlnccontracting.com";
    $subject = "New Contact Form Submission";
    $email_message = "Name: $name\n";
    $email_message .= "Email: $email\n";
    $email_message .= "Phone: $phone\n\n";
    $email_message .= "Message:\n$message";
    $headers = "From: $email";

    mail($to, $subject, $email_message, $headers);

    // Close connections
    $stmt->close();
    $conn->close();

    // Send success response
    sendResponse('success', 'Message sent successfully');

} catch (Exception $e) {
    // Log error (in a production environment)
    error_log($e->getMessage());
    
    // Send error response
    sendResponse('error', 'An error occurred while processing your request');
}
?>