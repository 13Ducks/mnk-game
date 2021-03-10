import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let boardSquares = []
    for (let i = 0; i < this.props.height; i++) {
      let boardRowSquares = []
      for (let j = 0; j < this.props.width; j++) {
        boardRowSquares.push(this.renderSquare(i * this.props.width + j))
      }
      boardSquares.push(<div className="board-row">
        {boardRowSquares}
      </div>)
    }

    console.log(boardSquares)

    return (
      <div>
        {boardSquares}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(props.height * props.width).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    console.log(this.state.history, i)
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares, this.props.width, this.props.height, this.props.k) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares, this.props.width, this.props.height, this.props.k);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            width={this.props.width}
            height={this.props.height}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game width={5} height={5} k={3} />, document.getElementById("root"));

function calculateWinner(squares, w, h, k) {
  let squareBoard = []
  for (let i = 0; i < squares.length; i += w) {
    squareBoard.push(squares.slice(i, i + w))
  }

  // horizontal
  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w - k + 1; j++) {
      let player = squareBoard[i][j]
      let win = true
      for (let s = 0; s < k; s++) {
        win &= (squareBoard[i][j + s] === player)
      }
      if (player && win) {
        return player
      }
    }
  }

  // vertical
  for (let i = 0; i < h - k + 1; i++) {
    for (let j = 0; j < w; j++) {
      let player = squareBoard[i][j]
      let win = true
      for (let s = 0; s < k; s++) {
        win &= (squareBoard[i + s][j] === player)
      }
      if (player && win) {
        return player
      }
    }
  }

  // ascending diagonal  
  for (let i = k - 1; i < h; i++) {
    for (let j = 0; j < w - k + 1; j++) {
      let player = squareBoard[i][j]
      let win = true
      for (let s = 0; s < k; s++) {
        win &= (squareBoard[i - s][j + s] === player)
      }
      if (player && win) {
        return player
      }
    }
  }

  // descending diagonal  
  for (let i = 0; i < h - k + 1; i++) {
    for (let j = 0; j < w - k + 1; j++) {
      let player = squareBoard[i][j]
      let win = true
      for (let s = 0; s < k; s++) {
        win &= (squareBoard[i + s][j + s] === player)
      }
      if (player && win) {
        return player
      }
    }
  }

  return null;
}
