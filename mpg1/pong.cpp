#include <Arduino.h>

constexpr int rows[8] = { 2, 3, 4, 5, 6, 7, 8, 9 };
constexpr int cols[8] = { A2, A3, A4, A5, 13, 10, 11, 12 };
constexpr int MATRIX_SIZE = 8;
constexpr int ANCHOR1 = 3;
constexpr int ANCHOR2 = 4;
constexpr int LEFT = 0;
constexpr int RIGHT = 7;

class Player {
    private:
    int input;
    int col;
    int row1 = ANCHOR1, row2 = ANCHOR2;
    int speed = 1;

    public:
    Player(int input, int col) {
        this->input = input;
        this->col = col;
    }

    int getRow1() const {
        return row1;
    }

    int getRow2() const {
        return row2;
    }

    int getMove() const {
        int potVal = analogRead(input);
        if (potVal > 900) {
            return -3;
        }
        else if (potVal > 800) {
            return -2;
        }
        else if (potVal > 600) {
            return -1;
        }
        else if (potVal < 200) {
            return 3;
        }
        else if (potVal < 300) {
            return 2;
        }
        else if (potVal < 500) {
            return 1;
        }
        else {
            return 0;
        }
    }

    void update() {
        int move = getMove();
        row1 = ANCHOR1 + move;
        row2 = ANCHOR2 + move;
    }

    void drawPaddle() {
        digitalWrite(cols[col], HIGH);
        for (int i = 0; i < MATRIX_SIZE; i++) {
            if (i != row1 && i != row2) {
                digitalWrite(rows[i], HIGH);
            }
        }
        delay(5);
    }
};

class Pong {
    private:
    Player player1;
    Player player2;
    int ballX = 3;
    int ballY = 3;
    int ballSpeedX = 1;
    int ballSpeedY = 1;
    int ticks = 1;
    const int TICK_RATE = 25;

    public:
    Pong(): player1(A0, 0), player2(A1, 7) {}

    void setup() {
        for (int i = 0; i < MATRIX_SIZE; i++) {
            pinMode(cols[i], OUTPUT);
            pinMode(rows[i], OUTPUT);
        }
    }

    void resetScreen() {
        for (int i = 0; i < MATRIX_SIZE; i++) {
            digitalWrite(cols[i], LOW);
            digitalWrite(rows[i], LOW);
        }
    }

    void drawBall() {
        digitalWrite(cols[ballX], HIGH);
        for (int i = 0; i < MATRIX_SIZE; i++) {
            if (i != ballY) {
                digitalWrite(rows[i], HIGH);
            }
            else {
                digitalWrite(rows[i], LOW);
            }
        }
        delay(5);
    }

    bool updateBall() {
        // update ball position
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // bounce ball off top and bottom edges
        if (ballY == LEFT || ballY == RIGHT) {
            ballSpeedY = -ballSpeedY;
        }

        // check if the current ball position + speed is a collision against the left paddle
        if (ballX + ballSpeedX == LEFT) {
            if (ballY + ballSpeedY == player1.getRow1() || ballY + ballSpeedY == player1.getRow2()) {
                ballSpeedX = -ballSpeedX;
            }
        }

        // check if the current ball position + speed is a collision against the right paddle
        else if (ballX + ballSpeedX == RIGHT) {
            if (ballY + ballSpeedY == player2.getRow1() || ballY + ballSpeedY == player2.getRow2()) {
                ballSpeedX = -ballSpeedX;
            }
        }

        // reset ball to center if it goes off screen
        else if (ballX < LEFT || ballX > RIGHT) {
            return true;
        }

        delay(5);
        return false;
    }

    void resetBall() {
        ballX = 3;
        ballY = 3;
        ballSpeedX = -ballSpeedX;
        // randomly choose a direction for the ball to go
        if (random(0, 2) == 0) {
            ballSpeedY = -ballSpeedY;
        }
    }

    void loop() {
        resetScreen();
        if (ticks % TICK_RATE == 0) {
            if (updateBall()) {
                resetBall();
                ticks = 1;
                resetScreen();
                delay(1000);
                return;
            }
            ticks = 1;
        }
        drawBall();
        resetScreen();
        player1.update();
        player1.drawPaddle();
        resetScreen();
        player2.update();
        player2.drawPaddle();
        ticks++;
    }
};

void setup() {
    Pong pong;
    pong.setup();
    while (true) {
        pong.loop();
    }
}