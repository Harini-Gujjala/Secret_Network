# 🔐 Secret Network

> A relaxed deduction puzzle game inspired by the logic of Mastermind.

**Secret Network** is a browser-based puzzle game where you try to discover a hidden network connecting four nodes — **A, B, C, and D**.

The computer secretly selects **3 connections** from 6 possible connections. Your goal is to figure out the hidden network using partial feedback from each guess.

**Observe → Guess → Analyze → Deduce → Solve**

---

## 🎮 How to Play

You are given four nodes:

```text
    A       B


    C       D
```

The possible connections are:

```text
A-B
A-C
A-D
B-C
B-D
C-D
```

### 1. Build your network

Click two nodes to create a connection.

Click the same pair again to remove the connection.

You can create your complete guess before submitting it.

### 2. Check your guess

Press **CHECK NETWORK** to receive feedback.

The game tells you:

* 🟢 **Correct connections** — connections that belong to the secret network
* 🔴 **Incorrect connections** — connections that do not belong to the secret network
* 🟡 **Missing connections** — secret connections you have not selected

The game **never reveals which specific connections are correct or incorrect**, so you must deduce the answer yourself.

### 3. Solve the network

You have **10 attempts** to discover the exact 3-connection network.

---

## 💡 Hint System

You receive **2 hints per game**.

Hints provide additional information without directly giving away the entire solution.

Examples:

```text
Node A is connected to exactly 2 other nodes.

A-B is not part of the secret network.

C-D is part of the secret network.
```

Each hint costs **100 points**.

---

## 🏆 Scoring

Every game starts with:

```text
Score: 1000
```

Each unsuccessful attempt reduces the score by:

```text
-100 points
```

Hints also cost:

```text
-100 points
```

Your score can never go below **0**.

If you solve the network, your remaining score becomes your final score.

---

## ✨ Features

* 🎯 Randomly generated secret networks
* 🔗 Interactive node connections
* 🧠 Deduction-based gameplay
* 📊 Correct / incorrect / missing feedback
* 📝 Guess history
* 💡 Limited hint system
* 🏆 Score tracking
* 🔢 10-attempt limit
* 🎉 Win and loss screens
* 🔍 Secret network reveal at the end
* 📱 Responsive design
* ♿ Accessible controls and text-based feedback
* ✨ Subtle animations and interactions
* 🔌 No backend required

---

## 🛠️ Technologies

Built entirely with native web technologies:

* **HTML5** — structure and semantic elements
* **CSS3** — responsive layout, styling and animations
* **Vanilla JavaScript** — game logic and interactions
* **SVG** — responsive connection lines

No frameworks, libraries, APIs, or backend services are used.

---

## 📁 Project Structure

```text
Secret-Network/
│
├── index.html
├── style.css
└── script.js
```

### `index.html`

Contains the game structure, nodes, controls, feedback area, guess history and result screen.

### `style.css`

Handles the visual design, responsive layout, node states, animations and game UI.

### `script.js`

Contains the complete game logic including:

* Secret network generation
* Node selection
* Connection creation/removal
* Guess validation
* Feedback calculation
* Score management
* Attempt tracking
* Hint generation
* Guess history
* Win/loss handling
* Game reset

---

## 🚀 Run Locally

No installation or server is required.

Simply:

1. Download or clone the repository.
2. Open `index.html` in your browser.
3. Start solving the network.

```bash
git clone https://github.com/your-username/Secret-Network.git
```

Then open:

```text
index.html
```

---

## 🌐 Live Demo

**Play Secret Network:**
https://your-username.github.io/Secret-Network/

> Replace the URL above with your GitHub Pages link after enabling GitHub Pages.

---

## 🧩 Game Logic

Each game randomly selects **3 unique connections** from the 6 possible connections.

For example, the hidden network might be:

```text
A-B
A-D
C-D
```

The player does **not** see these connections.

If the player guesses:

```text
A-B
A-C
B-D
```

The game might respond:

```text
1 correct
2 incorrect
2 missing
```

The player must use this information to narrow down the possibilities.

The exact connections responsible for the feedback are never revealed.

---

## 🎨 Design Philosophy

Secret Network was designed to feel like a **small, calm puzzle game** rather than a technical graph-theory application.

The interface focuses on:

* Minimal visual clutter
* Clear interactions
* Large clickable nodes
* Simple feedback
* Gentle animations
* Easy-to-understand game rules

The goal is to make the deduction loop satisfying:

> **Observe → Guess → Receive clues → Think → Guess again → Solve**

---

## 🔮 Future Improvements

The current version intentionally focuses on the four-node experience.

Possible future additions include:

* 5 or 6 node networks
* Multiple difficulty levels
* Different numbers of hidden connections
* Daily puzzles
* More sophisticated hint mechanics
* Additional puzzle modes
* Statistics and personal best scores
* Theme customization

---

## 👩‍💻 Author

**Harini G**

---

⭐ If you enjoyed the puzzle, consider giving the repository a star!
