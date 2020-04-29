import React from 'react';
import { Link } from 'react-router-dom'
import { Button, Tag, Card } from 'antd'
import { CheckCircleFilled } from '@ant-design/icons';
import { PuzzleEngine } from '../engine/interface'
import { DynamicImage } from '../loading';
import background from './pokemon/background.jpg';
import { Stage } from "../engine/pokemon";

function Component({ engine, data }: { engine: PuzzleEngine, data: any }) {
  const st: Stage[] = data.stages;
  window.console.log(data)
  return <div style={{ backgroundImage: `url(${background})` }}>
    <Card>
      The point of this puzzle is to prove that we can do dynamic layouts like
    mystery hunts often do. So this meta is laid out like <a
        href="https://www.mit.edu/~puzzle/2018/full/island/pokemon.html"> Pokémon
    Island from the 2018 hunt </a> (but with a simple linear unlock order so I
    could automate it). Solve any puzzle to unlock the next one, or click
    "Autosolve" next to any puzzle to automatically solve it with a random
    answer; see how new panels appear at the bottom automatically as they unlock.
    </Card>
    <div style={{ height: "50px" }} />
    {
      st.map((stage) =>
        <div key={stage.bg} style={{ width: "500px", position: "relative", margin: "-34px auto 0" }}>
          <DynamicImage src={"./views/pokemon/" + stage.bg} style={{ width: "100%", zIndex: 1 }} />
          {stage.battles.map((battle) => {
            const answerpos: React.CSSProperties = {
              position: "absolute",
              bottom: "0",
              left: "0"
            }
            let answer = <Button shape="round" block icon={<CheckCircleFilled />} style={answerpos} onClick={() => { engine.submit(battle.slug, "A RANDOM ANSWER") }}>
              AutoSolve
            </Button>
            if (battle.answer.length) {
              answer = <Tag color="green" style={answerpos}>{battle.answer}</Tag>
            }
            return <div style={{
              position: "absolute",
              zIndex: 3,
              left: battle.left / 2,
              top: battle.top / 2,
            }}>
              {answer}
              <Link to={`/hunt/${battle.slug}`}>
                <DynamicImage key={battle.img} src={"./views/pokemon/" + battle.img} />
              </Link>
            </div>
          })}
        </div>
      )
    }
  </div>
}

export default Component;
