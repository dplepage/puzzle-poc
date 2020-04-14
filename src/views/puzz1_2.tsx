import React from 'react';
import img from "./puzz1_2.grid.png";

function Component() {
  return <div>
    <p>This is the second puzzle of round one; it has an embedded image.</p>
    <p>I grabbed it from image-searching "sudoku" - this isn't actually a puzzle.</p>
    <p>The only correct answer to this puzzle is "VERMILLION".</p>
    <img src={img} alt="a sudoku"/>
  </div>
}

export default Component;
