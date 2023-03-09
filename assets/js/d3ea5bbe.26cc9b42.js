"use strict";(self.webpackChunkcs494_blog=self.webpackChunkcs494_blog||[]).push([[972],{9001:e=>{e.exports=JSON.parse('{"blogPosts":[{"id":"mgp1","metadata":{"permalink":"/cs494-blog/blog/mgp1","source":"@site/blog/mpg1/index.mdx","title":"mgP1","description":"Documenting the experience of building CS 494\'s first group project.","date":"2023-03-09T00:00:00.000Z","formattedDate":"March 9, 2023","tags":[{"label":"HCI","permalink":"/cs494-blog/blog/tags/hci"},{"label":"game","permalink":"/cs494-blog/blog/tags/game"},{"label":"circuits","permalink":"/cs494-blog/blog/tags/circuits"}],"readingTime":10.135,"hasTruncateMarker":true,"authors":[{"name":"Ethan Rickert","title":"CS 494 Student","url":"https://github.com/ethan0429","imageURL":"https://github.com/ethan0429.png","key":"ethan0429"},{"name":"Franklin Xie","title":"CS 494 Student","url":"https://github.com/Franklin-Xie","imageURL":"https://github.com/Franklin-Xie.png","key":"Franklin-Xie"}],"frontMatter":{"slug":"mgp1","title":"mgP1","authors":["ethan0429","Franklin-Xie"],"tags":["HCI","game","circuits"],"date":"2023-03-09T00:00:00.000Z"}},"content":"import LinkWithIcon from \\"/src/components/LinkWithIcon\\";\\n\\n\\nDocumenting the experience of building CS 494\'s first group project.\\n\\n\x3c!-- truncate --\x3e\\n\\n## About\\n\\nFor this group project, Franklin and I decided to implement a 2-player Pong clone with an 8x8 LED matrix, 2 potentiometers, and the <LinkWithIcon to=\\"https://wiki.seeedstudio.com/Seeeduino-Nano/\\" text=\\"Seeeduino Nano\\" /> .\\n\\n## Design Decisions\\n\\n### Why Pong?\\n\\nWe chose Pong because it\'s fun, and our experience with circuits/Arduino was limited to begin with. Pong isn\'t _too_ easy to implement, but it\'s not too hard either. So the decision to implement Pong was both a good learning experience and a fun project.\\n\\nI should also mention that although there are readily-available Arduino Pong implementations on the internet, our game is actually _completely_ built from scratch! Scouts honor. Initially, we intended to use these implementations as a reference, as none of the ones we found had a 2-player mode. However, due to the peculiar nature of this project\'s 8x8 LED matrix in particular, there were no code bases that were applicable even as a reference.\\n\\n### 8x8 LED Matrix\\n\\nPart of the project requirement was to use the 8x8 LED matrix provided to us. It\'s capable of displaying red and green pixels, but we decided to only use the red pixels to reduce complexity. The matrix is of course the main display for the game.\\n\\n### Potentiometers\\n\\nThis decision was difficult, because both of us having limited experience with hardware and really HCI in general, coming up with an inventive input within the scale of this project was difficult. Any form of inventive input we could think of felt too contrived to be worth the effort. So using 2 potentiometers was the most obvious choice. It\'s both simple and ergonomic. However, we also considered using sliders, joysticks, and even bananas.\\n\\n## Pong Implementation\\n\\nThe code for the game is available on <LinkWithIcon to=\\"https://github.com/Ethan0429/cs494-blog/blob/main/mpg1/pong.cpp\\" text=\\"GitHub\\" />, but I\'ll also go over the implementation here, piece by piece.\\n\\n### Constants\\n\\nThe first thing we did was define some constants. We defined the rows and columns of the LED matrix, the size of the matrix, the anchor points of the paddles, and the left and right edges of the matrix.\\n\\n```c title=\\"pong.cpp\\"\\n#include <Arduino.h>\\n\\n/* Constants */\\n\\n// pin IDs for the rows and columns of the LED matrix\\nconstexpr int rows[8] = { 2, 3, 4, 5, 6, 7, 8, 9 };\\nconstexpr int cols[8] = { A2, A3, A4, A5, 13, 10, 11, 12 };\\nconstexpr int MATRIX_SIZE = 8;\\n\\n// \\"anchor\\" points for the paddles (the top and bottom of the paddle and the reference point for the paddle\'s position)\\nconstexpr int ANCHOR1 = 3;\\nconstexpr int ANCHOR2 = 4;\\n\\n// left and right edges of the matrix\\nconstexpr int LEFT = 0;\\nconstexpr int RIGHT = 7;\\nconstexpr int TOP = 0;\\nconstexpr int BOTTOM = 7;\\n```\\n\\n### Player Class\\n\\nThe `Player` class is responsible for handling the input and movement of each player\'s paddle. It has a constructor that takes the player\'s potentiometer pin and the side of the paddle\'s position.\\n\\nIt implements the following methods:\\n\\n<div class=\\"flex flex-row justify-between p-1 space-x-10\\">\\n\\n<div class=\\"w-1/2\\">\\n\\n- `getMove()`: returns the direction the paddle should move in, based on the potentiometer\'s value. It works by mapping the potentiometer\'s value to a range of -3 to 3, where -3 is the top of the paddle and 3 is the bottom of the paddle. The mapping is as follows:\\n\\n</div>\\n<div class=\\"grow\\">\\n\\n###### Potentiometer Value to Direction Mapping\\n\\n| Potentiometer Value | Direction |\\n| ------------------- | --------- |\\n| 900+                | -3        |\\n| 800-900             | -2        |\\n| 600-800             | -1        |\\n| 500-600             | 0         |\\n| 300-500             | 1         |\\n| 200-300             | 2         |\\n| 200-                | 3         |\\n\\n</div>\\n</div>\\n\\n- `update()`: updates the paddle\'s position based on the potentiometer\'s value.\\n\\n- `drawPaddle()`: draws the paddle on the LED matrix. Interestingly, (**not sure if this is a bug with our wiring or something**), the LED matrix is wired such that the columns are active-low, and the rows are active-high. So we have to set the column to HIGH and the rows to LOW to draw the paddle. The resulting drawing is then inverted by the LED matrix.\\n\\n```c title=\\"pong.cpp\\"\\nclass Player {\\nprivate:\\n\\n    // potentiometer pin and column of the paddle\\n    int input;\\n\\n    // column of the paddle\\n    int col;\\n\\n    // row of the top and bottom of the paddle\\n    int row1 = ANCHOR1, row2 = ANCHOR2;\\n\\npublic:\\n    Player(int input, int col) {\\n        this->input = input;\\n        this->col = col;\\n    }\\n\\n    int getRow1() const {\\n        return row1;\\n    }\\n\\n    int getRow2() const {\\n        return row2;\\n    }\\n\\n    // maps the potentiometer value to a direction and returns the position increment\\n    int getMove() const {\\n        int potVal = analogRead(input);\\n        if (potVal > 900) {\\n            return -3;\\n        }\\n        else if (potVal > 800) {\\n            return -2;\\n        }\\n        else if (potVal > 600) {\\n            return -1;\\n        }\\n        else if (potVal < 200) {\\n            return 3;\\n        }\\n        else if (potVal < 300) {\\n            return 2;\\n        }\\n        else if (potVal < 500) {\\n            return 1;\\n        }\\n        else {\\n            return 0;\\n        }\\n    }\\n\\n    // updates the paddle\'s position based on the potentiometer\'s value\\n    void update() {\\n        int move = getMove();\\n        row1 = ANCHOR1 + move;\\n        row2 = ANCHOR2 + move;\\n    }\\n\\n    // draws the paddle on the LED matrix (inverted)\\n    void drawPaddle() {\\n        digitalWrite(cols[col], HIGH);\\n        for (int i = 0; i < MATRIX_SIZE; i++) {\\n            if (i != row1 && i != row2) {\\n                digitalWrite(rows[i], HIGH);\\n            }\\n        }\\n        delay(5);\\n    }\\n\\n};\\n```\\n\\n### Pong Class\\n\\nThe `Pong` class implements the rest of the game\'s logic including the ball\'s movement, collision detection, and game loop. It implements the following methods:\\n\\n- `setup()`: sets up the LED matrix by setting the rows and columns to output mode.\\n\\n- `resetScreen()`: resets the LED matrix by setting all the rows and columns to LOW. In order to effectively draw things \\"cuncurrently\\", we actually draw each column one by one and reset the screen in-between. This is due to the anode-cathode wiring of the LED matrix which would make it difficult to draw multiple columns whose rows are active at the same time without multiplexing. The process happens so fast that it looks like the columns are being drawn concurrently.\\n\\n- `drawBall()`: draws the ball on the LED matrix.\\n\\n- `updateBall()`: updates the ball\'s position based on its speed and the current tick. Due to the fast nature of the base game loop, we choose not to update the balls position until the tick reaches a certain value. This is to prevent the ball from moving too fast for the player to react to. The chosen tick rate is `25`. It is arbitrary, but it works the best based on our testing.\\n\\n- `resetBall()`: resets the ball\'s position and speed upon a score.\\n\\n```c title=\\"pong.cpp\\"\\nclass Pong {\\nprivate:\\n    Player player1;\\n    Player player2;\\n    int ballX = 3;\\n    int ballY = 3;\\n    int ballSpeedX = 1;\\n    int ballSpeedY = 1;\\n    int ticks = 1;\\n    const int TICK_RATE = 25;\\n\\n    public:\\n    Pong(): player1(A0, 0), player2(A1, 7) {}\\n\\n    void setup() {\\n        for (int i = 0; i < MATRIX_SIZE; i++) {\\n            pinMode(cols[i], OUTPUT);\\n            pinMode(rows[i], OUTPUT);\\n        }\\n    }\\n\\n    void resetScreen() {\\n        for (int i = 0; i < MATRIX_SIZE; i++) {\\n            digitalWrite(cols[i], LOW);\\n            digitalWrite(rows[i], LOW);\\n        }\\n    }\\n\\n    void drawBall() {\\n        digitalWrite(cols[ballX], HIGH);\\n        for (int i = 0; i < MATRIX_SIZE; i++) {\\n            if (i != ballY) {\\n                digitalWrite(rows[i], HIGH);\\n            }\\n            else {\\n                digitalWrite(rows[i], LOW);\\n            }\\n        }\\n        delay(5);\\n    }\\n\\n    bool updateBall() {\\n        // update ball position\\n        ballX += ballSpeedX;\\n        ballY += ballSpeedY;\\n\\n        // bounce ball off top and bottom edges\\n        if (ballY == TOP || ballY == BOTTOM) {\\n            ballSpeedY = -ballSpeedY;\\n        }\\n\\n        // check if the current ball position + speed is a collision against the left paddle\\n        if (ballX + ballSpeedX == LEFT) {\\n            if (ballY + ballSpeedY == player1.getRow1() || ballY + ballSpeedY == player1.getRow2()) {\\n                ballSpeedX = -ballSpeedX;\\n            }\\n        }\\n\\n        // check if the current ball position + speed is a collision against the right paddle\\n        else if (ballX + ballSpeedX == RIGHT) {\\n            if (ballY + ballSpeedY == player2.getRow1() || ballY + ballSpeedY == player2.getRow2()) {\\n                ballSpeedX = -ballSpeedX;\\n            }\\n        }\\n\\n        // reset ball to center if it goes off screen\\n        else if (ballX < LEFT || ballX > RIGHT) {\\n            return true;\\n        }\\n\\n        delay(5);\\n        return false;\\n    }\\n\\n    void resetBall() {\\n        ballX = 3;\\n        ballY = 3;\\n        ballSpeedX = -ballSpeedX;\\n        // randomly choose a direction for the ball to go\\n        if (random(0, 2) == 0) {\\n            ballSpeedY = -ballSpeedY;\\n        }\\n    }\\n\\n    void loop() {\\n        resetScreen();\\n        if (ticks % TICK_RATE == 0) {\\n            if (updateBall()) {\\n                resetBall();\\n                ticks = 1;\\n                resetScreen();\\n                delay(1000);\\n                return;\\n            }\\n            ticks = 1;\\n        }\\n        drawBall();\\n        resetScreen();\\n        player1.update();\\n        player1.drawPaddle();\\n        resetScreen();\\n        player2.update();\\n        player2.drawPaddle();\\n        ticks++;\\n    }\\n\\n};\\n```\\n\\n### Main\\n\\nNow that we have our game logic implemented, we only need to start the game.\\n\\nWe tie everything together in the `setup()` function (native to Arduino). We create a `Pong` object and call its `setup()` and `loop()` methods in an infinite loop.\\n\\n```c title=\\"pong.cpp\\"\\nvoid setup() {\\n    Pong pong;\\n    pong.setup();\\n    while (true) {\\n        pong.loop();\\n    }\\n}\\n```\\n\\n## Video Demo\\n\\nHere is a video demonstration of the game in action:\\n\\n{/* insert video here */}\\n\\n## Challenges\\n\\nOverall, there were a few challenges we encountered during this project.\\n\\n### Understanding the LED Matrix\\n\\nBecause of the peculiar nature of this particular LED matrix, we had trouble initially understanding how to draw anything on it. 2 sides of the matrix have 12 pins each. Each of these pins can be treated as a group of 3. The first is responsible for the row (red) the second is responsible for the column (red), and the third is responsible for the row (green). Because of this layout, it was difficult to understand at first considering other common 8x8 LED matrix parts follow a more standard layout. The MAX7219 LED matrix model, for example, is composed of 4 pins on both sides. A much simpler setup, and one that also provides a library for Arduino to make interfacing with the matrix much easier.\\n\\n### Drawing\\n\\nI mentioned this previously already, but I am unsure as to whether or not our particular setup for the matrix was unorthodox or even incorrect altogether. In other demonstrations we researched, toggling an LED is as simple as targetting a column (setting it to HIGH) and a row (setting it to LOW). This _should_ result in the LED at that coordinate being lit up. However, in our case this did not work.\\n\\nIn order to draw an object, we first target a column and set it to HIGH. We then target all of the rows that we **do not** want to be lit up and set them to HIGH. Intuitively, this would create a negative shape i.e. all the lights _around_ our desired shape would be lit. But the effect was inverted with our setup, which actually would result in the desired shape being lit up. This was a bit confusing at first, but we were able to figure it out.\\n\\nLastly, drawing included realizing that we could not draw multiple objects at once. We had to draw one object, reset the screen, draw another object, and so on. This was a bit of a pain, but it was manageable.\\n\\n### Ball Update Rate\\n\\nThe players\' paddle movement had to be responsive, and the display needed minimal flashing. Because of this, we use a short delay between screen refreshes. However, this also meant that the ball would move too fast for the player to react to. We had to implement a tick system to prevent this. The ball would only move once the tick reached a certain value. This value was chosen arbitrarily, but it worked the best based on our testing.\\n\\n## Conclusion\\n\\nOverall, this project was extremely fun. Although there was not much inventiveness to our implementation, it was still a great learning experience considering neither me nor Franklin had much experience with anything hardware related, much less a game! I would love to get suggestions/feedback on our implementation. I am sure there are many ways to improve it."}]}')}}]);