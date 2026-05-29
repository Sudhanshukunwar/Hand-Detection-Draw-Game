About the Project

The Hand Detection Draw Game is a browser-based project that combines frontend development with basic computer vision concepts. The main goal of this project is to explore how hand-tracking models can be integrated into web applications to create touch-free and intuitive user interactions.

When the webcam is enabled, the application detects the user’s hand and tracks finger movement. These movements are then mapped onto an HTML5 canvas, allowing the user to draw naturally in the air.

This project is created mainly for:

Learning purposes

Experimenting with AI in the browser

Showcasing skills in JavaScript and interactive UI development
 Key Features

Real-time hand detection using webcam

Draw on screen using finger movement

Touchless and mouse-free interaction

Smooth and responsive drawing canvas

Runs entirely in the browser

No backend required

How It Works (Simple Explanation)

The browser asks for webcam permission

A hand-tracking model detects the hand

Finger position is tracked continuously

Finger coordinates are mapped to the canvas

Lines are drawn as the finger moves

Everything happens in real time, directly in the browser.

Technologies Used

HTML5 – Structure of the web page

CSS3 – Styling and layout

JavaScript (ES6) – Core logic

HTML5 Canvas – Drawing surface

Hand Tracking Library – For detecting hand and finger landmarks
 Project Structure
hand-detection-draw-game/
│
├── index.html        # Main HTML file
├── style.css         # Styling and layout
├── script.js         # Hand detection & drawing logic
├── assets/           # Images / models (if used)
└── README.md         # Project documentation

 How to Run the Project
Method 1: Simple (Recommended)

Download or clone the repository

git clone https://github.com/your-username/hand-detection-draw-game.git


Open the project folder

Open index.html in a modern browser (Chrome recommended)

Allow camera access

Method 2: Using VS Code Live Server

Open the project in VS Code

Install Live Server extension

Right-click index.html → Open with Live Server

Allow camera access

 Requirements

Webcam (built-in or external)

Modern browser (Chrome / Edge / Firefox)

Camera permission enabled

 Tested On

Google Chrome

Microsoft Edge

Firefox (limited support depending on device)
 Learning Outcomes

By building this project, I learned:

How webcam access works in browsers

Basics of hand detection and tracking

Working with HTML5 Canvas

Writing clean and structured JavaScript

Creating interactive web experiences

Combining AI models with frontend code

Possible Future Enhancements

Gesture-based color selection

Eraser using hand gesture

Clear canvas gesture

Save or download drawings

Multi-hand support

Mobile device optimization

 Why This Project?

I wanted to build something:

Interactive

Different from normal CRUD apps

Related to AI & computer vision

Fun to use and easy to understand

This project helped me understand how real-world AI features can be added to simple web applications.

 Author

Sudhanshu Kunwar 
IT Engineering Student
Interested in Frontend Development & Computer Vision

License

This project is open-source and created for educational purposes.
Feel free to fork, modify, and improve it.
