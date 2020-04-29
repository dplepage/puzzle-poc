import React, { useState, FunctionComponent } from 'react';
import { Layout, Menu, Button, Typography, Card, Space } from 'antd';
import {Link} from "react-router-dom";
import {useLoading} from './loading';
import { NavEntry } from './engine/interface';
import { JsPuzzleEngine } from './engine/js_engine';

const { Sider } = Layout;
const { Title } = Typography;

function* getNavItems(puzzle:NavEntry, depth=0): Generator<React.ReactElement> {
  let label = '> '.repeat(depth) + puzzle.label
  if (puzzle.state.has_answers())
    label += ' - '+puzzle.state.answer_str()
  yield <Menu.Item key={puzzle.slug}>
    <Link to={`/hunt/${puzzle.slug}`}>
      {label}
    </Link>
  </Menu.Item>
  for (const child of puzzle.children) {
    yield* getNavItems(child, depth+1)
  }
}

const HackNav: FunctionComponent<{engine:JsPuzzleEngine, version:number}> = ({engine, version}) => {
  const [nav_data] = useLoading(()=>engine.get_nav(), [version]);
  const [collapsed, setCollapsed] = useState(false)
  if (nav_data === null)
    return <div>Loading...</div>
  const items: React.ReactElement[] = [
    <Menu.Item key="start"><Link to="/hunt/start">Start</Link></Menu.Item>,
    <Menu.Divider key="start-div"/>
  ]
  for (const puzzle of nav_data) {
    items.push(...getNavItems(puzzle))
    items.push(<Menu.Divider key={puzzle.slug+"-div"}/>)
  }
  return <Sider theme="light" collapsible collapsedWidth={0} collapsed={collapsed} onCollapse={()=>setCollapsed(!collapsed)}>
    <Card>
    <Space direction="vertical">
      <Title level={3}>Dev Ctrls</Title>
      <p>This sidebar will be removed in the actual hunt.</p>
      <Button block type="primary" shape="round" onClick={()=>engine.unlock_all()}>
        Unlock all
      </Button>
      <Button block shape="round" onClick={()=>engine.unlock_restart()}>
        Relock unsolved
      </Button>
      </Space>
    </Card>
    <Menu mode="inline">
      {items}
    </Menu>
  </Sider>
}

export default HackNav

