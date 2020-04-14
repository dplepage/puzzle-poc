import React from 'react';
import {ViewProps} from '../engine/interface'

type Symbol = "X" | "O" | null

const Square: React.FC<{value:Symbol, onClick:()=>void}> = ({onClick, value}) => (
  <button className="square" onClick={onClick} style={{width:"25px", height:"25px"}}>
    {value}&nbsp;
  </button>
);

const Board: React.FC<{squares:Symbol[], onClick:(i:number)=>void}> = ({squares, onClick}) => {
  const renderSquare = (i:number) => <Square
    value={squares[i]}
    onClick={() => onClick(i)}
  />
  return       <div>
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
}

interface GameState {
  history: {squares:Symbol[]}[],
  stepNumber: number,
  xIsNext: boolean,
}

interface GameProps {
  onEnd: (winner:Symbol)=>void
}

class Game extends React.Component<GameProps, GameState> {
  constructor(props:GameProps) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i:number) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
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
    let winner = calculateWinner(squares)
    if (winner){
      this.props.onEnd(winner)
    }
  }

  jumpTo(step:number) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

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

function calculateWinner(squares:Symbol[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


function Component({engine, data}:ViewProps) {
  return <>
    <p>This puzzle can have pretty much anything in it, so I just copied in a tic-tac-toe game from a react demo.</p>
    <p>Ending the game will autosubmit the answer "TICTACS".</p>
    <p>In practice we probably don't want to do any sort of autosubmission, but I wanted to see if it would work.</p>
    <Game onEnd={(winner)=>{engine.submit("puzz2_1", "TICTACS")}}/>
  </>
}

export default Component;
