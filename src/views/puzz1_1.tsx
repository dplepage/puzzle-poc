import React from 'react';
import { PuzzleEngine } from '../engine/interface'

function Component({ engine, data }: { engine: PuzzleEngine, data:any }) {
  return <>
    <p>This is the first puzzle of round one.</p>
    <p>There's nothing really interesting here; submit any answer above and
    it'll be treated as correct and will unlock puzzle two.</p>
  </>
}

export default Component;
