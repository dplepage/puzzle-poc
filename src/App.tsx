import React, { useState, FunctionComponent, useEffect, FormEvent } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import { FlexBox } from './components';
import { PuzzleEngine, Slug, NavEntry, ViewData } from './engine/interface';
import { JsPuzzleEngine } from './engine/js_engine';

type loadState = "loading" | "404" | "loaded";

function useData(engine:PuzzleEngine, slug:Slug, version:number):[ViewData|null, loadState] {
  // React hook to load the latest data; reloads if you change the slug OR the
  // version number (thus, data is reloaded when e.g. you submit an answer).
  // This could probably be merged with useView with fairly minimal effort, this
  // is just a proof-of-concept.
  const [data, setData] = useState<ViewData|null>(null);
  const [state, setState] = useState<loadState>("loading");
  useEffect(()=>{
    async function load_data() {
      setState("loading");
      const unlocked = await engine.unlocked(slug)
      if (!unlocked) {
        setState("404")
        return
      }
      const data = await engine.get_data(slug);
      window.console.log(`Loaded data for ${slug} at version ${version}`)
      setData(data)
      setState("loaded")
    }
    load_data();
  }, [engine, slug, version]);
  return [data, state];
}

function useView(engine:PuzzleEngine, slug:Slug) {
  // React hook to load the view for a slug dynamically.
  // TODO: This doesn't reload on unlocks, so if you go to a puzzle slug before
  // it's unlocked and then unlock it, it'll still show as a 404 until you
  // navigate away and back again
  const [view, setView] = useState<any>(null);
  const [state, setState] = useState<loadState>("loading");
  useEffect(()=>{
    async function load_data() {
      setState("loading");
      const unlocked = await engine.unlocked(slug)
      if (!unlocked) {
        setState("404")
        return
      }
      const view = await import(/* webpackChunkName: "[request]" */ `./views/${slug}`);
      window.console.log(`Loaded view for ${slug}`)
      setView(view)
      setState("loaded")
    }
    load_data();
  }, [engine, slug]);
  return [view, state];
}

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
  const [data, dstate] = useData(engine, slug, version);
  const [view_module, vstate] = useView(engine, slug);
  const loading_div = <div>Loading...</div>
  if (dstate === "404" || vstate === "404")
    return <b>404 - there's nothing here (or you haven't unlocked it yet!)</b>
  if (data === null || vstate === "loading"){
    return loading_div
  }
  return <>
    <PuzzleHeader slug={slug} engine={engine} vdata={data}/>
    <view_module.default data={data} engine={engine}/>
   </>
}

function App() {
  const [tmp, setTmp] = useState(0)
  const [engine] = useState(new JsPuzzleEngine(setTmp));
  const [nav_data] = useData(engine, "nav", tmp);
  if (nav_data === null)
    return <div>Loading...</div>
  const nav:NavEntry[] = nav_data.nav_entries

  const RenderPuzzleNav: FunctionComponent<{puzzle:ViewData, indent?:boolean}> = ({puzzle, indent}) => {
    let label = puzzle.label
    if (puzzle.state.has_answers())
      label += ' - '+puzzle.state.answer_str()
    if (indent)
      label = '> '+label
    return <Link to={`/hunt/${puzzle.slug}`}>
      {label}
    </Link>
  }

  return (
    <Router>
      <FlexBox dir="row">
        <Link to="/">Home</Link>&nbsp;
        <Link to="/about">About</Link>&nbsp;
        <Link to="/hunt/start">Hunt</Link>
      </FlexBox>
      <FlexBox dir="row">
        <div style={{width:"200px", padding:"10px", margin:"10px", background:"lightgrey"}}>
          <h3>Hack Navigation</h3>
          <button onClick={()=>engine.unlock_all()}>Unlock all</button>
          <button onClick={()=>engine.unlock_restart()}>Relock unsolved</button>
          <FlexBox dir="column">
            <Link to="/hunt/start">Start</Link>
            {nav.map((round)=> <React.Fragment key={`nav-${round.slug}`}>
              <RenderPuzzleNav puzzle={round}/>
              {round.children.map((puzzle)=>
                <span key={`nav-${puzzle.slug}`}>
                  <RenderPuzzleNav puzzle={puzzle} indent/>
                </span>
                )}
                <hr/>
              </React.Fragment>
            )}
          </FlexBox>
        </div>
        <div style={{maxWidth:"600px"}}>
          <Switch>
            <Route path="/about">
              <h2> About This Hunt </h2>
              How about this hunt, eh?
            </Route>
            <Route path="/hunt/:slug">
              <PuzzleViewFromSlug engine={engine} version={tmp}/>
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
        </div>
      </FlexBox>
    </Router>
  );
}

export default App;
