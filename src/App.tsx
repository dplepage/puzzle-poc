import React, { useState, FunctionComponent, FormEvent } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import { Layout, Menu, Typography } from 'antd';
// import {
//   LockOutlined, UnlockOutlined
// } from '@ant-design/icons';

// import { Show } from './components';
import { PuzzleEngine, Slug, ViewData, ViewModule } from './engine/interface';
import { JsPuzzleEngine } from './engine/js_engine';
import 'antd/dist/antd.css';
import {useLoading} from './loading';
import HackNav from './hack_nav';

const { Header, Content, Footer } = Layout;

type SubmitProps = {slug:string, engine:PuzzleEngine, vdata:ViewData}
const PuzzleHeader = ({slug, engine, vdata}:SubmitProps) => {
  // React Component that shows a puzzle's title and submit bar, or the
  // answer(s) if the puzzle has been solved already.
  const state = vdata.state
  const [submission, setSubmission] = useState("");
  const [wrong, setWrong] = useState("");
  const items:React.ReactElement[] = [<h1 key='label'>{vdata.label}</h1>];
  if (state.has_answers()) {
    items.push(<b key='answer'>Answer: {state.answer_str()}</b>)
  }
  if (state.can_submit) {
    const onSubmit = (evt:FormEvent) => {
      evt.preventDefault();
      engine.submit(slug, submission).then((result)=>{
        if (result) {
          setWrong("")
        } else {
          setWrong(submission)
        }
      });
      setSubmission("");
    }
    items.push(<form onSubmit={onSubmit} key='submit'>
      <input
        type="text"
        placeholder="Enter anything"
        value={submission}
        onChange={e=>setSubmission(e.target.value)}
      />
      <input type="submit" value="Submit" />
    </form>)
    if (wrong !== "") {
      items.push(<b key='wrong'>{wrong.toUpperCase()} is INCORRECT</b>)
    }
  }
  return <div>{items}</div>
}

export const PuzzleViewFromSlug:FunctionComponent<{engine:PuzzleEngine, version:number}> = ({engine, version}) => {
  // React component that renders a puzzle from a slug parameter. This is
  // intended for use with a Router, which is why it gets the slug from
  // useParams instead of as an argument.
  const { slug } = useParams<{ slug: Slug }>()
  // We pass version and slug when loading data but only slug when loading the
  // component, because we don't need to reload the component every time the
  // data changes (but we do want to reload the data, obviously). This'll change
  // if we want to switch to e.g. make both of these Observables
  const [data, dstate] = useLoading(()=>engine.get_data(slug), [slug, version]);
  const [view_module, vstate] = useLoading<ViewModule>(()=>engine.get_component(slug), [slug]);
  if (dstate === "error" || vstate === "error")
    return <b>404 - there's nothing here (or you haven't unlocked it yet!)</b>
  // We check vstate === "loading" instead of view_module === null because when
  // you change the slug both state non-null during the reload, so if the data
  // loads first we need to make sure not to try to render the old view with the
  // new data. TODO: is there a race condition the other way? If the view
  // finishes loading but the data takes a while, will we break? We could fix
  // this by putting the slug in the data, maybe?
  if (data === null || vstate === "loading" || view_module === null || dstate === "loading"){
    return <div>Loading...</div>
  }
  return <>
    <PuzzleHeader slug={slug} engine={engine} vdata={data}/>
    <view_module.default data={data} engine={engine}/>
   </>
}


function App() {
  const [version, setVersion] = useState(0)
  const [engine] = useState(new JsPuzzleEngine(setVersion));

  return <Router>
    <Layout>
      <HackNav engine={engine} version={version}/>
      <Layout>
        <Header>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
            <Menu.Item key="2"><Link to="/about">About</Link></Menu.Item>
            <Menu.Item key="3"><Link to="/hunt/start">Hunt</Link></Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px', marginTop: 64 }}>
          <Switch>
            <Route path="/about">
              <h2> About This Hunt </h2>
              How about this hunt, eh?
            </Route>
            <Route path="/hunt/:slug">
              <PuzzleViewFromSlug engine={engine} version={version}/>
            </Route>
            <Route path="/">
              <h2>Welcome to the hunt!</h2>
              <p>
              This is a proof-of-concept of using react as a hunt engine. You
              can select "Hunt" in the top navbar (or "start" in the hack bar on
              the side) to see the start of the hunt. Click "Unlock all" or
              "Relock unsolve" to auto-unlock/relock all puzzles and rounds.
              </p>
              <p>
              The basic idea was to see if we could make a hunt that lazy-loaded
              puzzle data aggressively enough that a determined hacker couldn't
              even deduce the existence of locked puzzles, while still allowing
              a React-style single-page app. As a bonus, this format would also
              allow the hunt to be run normally, with unlocks and everything,
              after the official hunt was over, by reimplementing the unlock
              logic in javascript and storing the hunt state as a cookie. To that end, this prototype defines an
              interface in engine/interface.tsx that is the abstract of what a
              server would need to provide, and then a JS implementation of this
              in engine/js_engine.tsx so that you can run the hunt right here in
              your browser.
              </p>
              <p>
              I didn't bother actually implementing cookie storage, so right now
              the hunt state will reset any time you reload the page.
              </p>
              <p>
              It's not a real hunt, obviously - none of the puzzles are actually
              puzzles, and most of them will just accept any answer you provide
              as the right one.
              </p>
            </Route>
          </Switch>
        </Content>
        <Footer> (Do we need a footer? Here's one.) </Footer>
      </Layout>
    </Layout>
  </Router>
}

export default App;
