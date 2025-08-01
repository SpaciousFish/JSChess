# JSChess

JSChess is a browser-based chess engine and GUI implemented in JavaScript. It features a playable chessboard, move generation, evaluation, and integration with Stockfish via WebAssembly. The project is designed for learning, experimentation, and playing chess directly in your web browser.

---

## Features

- Interactive chessboard with drag-and-drop piece movement
- FEN input/output for setting up and sharing positions
- Move generation, validation, and perft testing
- UCI engine support via Stockfish (WebAssembly)
- Visual board flipping and highlighting
- Opening book support (via `bookXml.xml`)
- Responsive UI with jQuery

---

## Project Structure

```
bookXml.xml         # Opening book in XML format
index.html          # Main HTML file (UI and script includes)
perftsuite.epd      # Perft test positions
README.md           # Project documentation
script.cmd          # Windows batch script for running/building
stockfish.wasm      # Stockfish chess engine (WebAssembly)
styles.css          # CSS styles for the UI
images/             # Chess piece and UI images
js/                 # JavaScript source files
```

### Key JavaScript Files

- `js/main.js`: Application entry point and initialization
- `js/board.js`: Board representation, FEN parsing, and printing
- `js/defs.js`: Constants, enums, and utility functions
- `js/gui.js`: User interface logic and event handlers
- `js/movegen.js`: Move generation logic
- `js/makemove.js`: Move making and unmaking
- `js/evaluate.js`: Position evaluation
- `js/search.js`: Search algorithms and engine logic
- `js/stockfish.js`: Stockfish engine integration

---

## Usage

1. **Clone or Download the Repository**

   ```sh
   git clone https://github.com/SpaciousFish/JSChess.git
   cd JSChess
   ```

2. **Open `index.html` in your browser**

   No build step is required. All dependencies are included in the `js/` folder.

3. **Play Chess!**

   - Use the board to make moves.
   - Enter FEN strings to set up custom positions.
   - Use the "Set Position" and "New Game" buttons for control.

---

## Credits

- Chess engine logic inspired by [Bluefever Software's Chess Programming](https://www.chessprogramming.net/).
- Stockfish engine (WASM) from [official Stockfish project](https://stockfishchess.org/).
- jQuery for DOM manipulation.

---

## License

This project is for educational and personal use. See individual file headers for more information.
