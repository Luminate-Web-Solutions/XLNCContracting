<?php
// Enable error reporting for debugging
error_reporting(0);
ini_set('display_errors', 0);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require 'vendor/autoload.php'; // Include PHPMailer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require '/full_path/Exception.php';
require '/full_path/PHPMailer.php';
require '/full_path/SMTP.php';

// Database configuration
$config = [
    'host' => 'hostname',
    'username' => 'username',
    'password' => 'password',
    'database' => 'database'
];

// Response function
function sendResponse($success, $message) {
    echo json_encode([
        'success' => $success,
        'message' => $message
    ]);
    exit;
}

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Invalid request method');
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required_fields = ['name', 'email', 'phone', 'message'];
foreach ($required_fields as $field) {
    if (empty($data[$field])) {
        sendResponse(false, "Missing required field: {$field}");
    }
}

// Validate email
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    sendResponse(false, 'Invalid email format');
}

// Sanitize input data
$name = filter_var($data['name'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$phone = filter_var($data['phone'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$message = filter_var($data['message'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);

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

    // Send email using PHPMailer
    $mail = new PHPMailer(true);

    // Server settings
    $mail->isSMTP();
    $mail->Host = 'domain.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'email@domain.com';
    $mail->Password = 'password';
    $mail->SMTPSecure = 'ssl';
    $mail->Port = 465;

    // Recipients
    $mail->setFrom('email@domain.com', 'From');
    $mail->addAddress('email@domain.com', 'To');
    $mail->addReplyTo($data['email'], $data['name']);

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'New Contact Form Submission';
    $mail->Body = "
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> " . htmlspecialchars($data['name']) . "</p>
        <p><strong>Email:</strong> " . htmlspecialchars($data['email']) . "</p>
        <p><strong>Phone:</strong> " . htmlspecialchars($data['phone']) . "</p>
        <p><strong>Message:</strong><br>" . nl2br(htmlspecialchars($data['message'])) . "</p>
    ";
    $mail->send();

    // Close connections
    $stmt->close();
    $conn->close();

    // Send success response
    sendResponse(true, 'Message sent successfully and stored in database');

} catch (Exception $e) {
    // Log error (in a production environment)
    error_log($e->getMessage());

    // Send error response
    sendResponse(false, 'An error occurred while processing your request: ' . $e->getMessage());
}
?>