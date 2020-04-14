import React from 'react';
import { Link } from 'react-router-dom';
import { ViewProps } from '../engine/interface';
import { FlexBox } from '../components';

// import x from "./round1.man.png";
function Component({ data }: ViewProps) {
  return <div>
    <h1>Welcome to the hunt!</h1>

    <p> Note that if you toggle lock states in the sidebar, the page updates
    instantaneously.</p>

    <p> This page demos the idea of having custom data returned by the server
    based on what's unlocked.</p>

    <p> This view's data is a round link AND an extra image for each round; the
    images won't be sent out by the server unless that round is unlocked. For
    example, if you haven't yet unlocked round 2, the image file
    "round2.plan.gif" won't have been requested. If there were a real server
    providing the loading, it would refuse to load anything starting with
    'round2.' until you'd unlocked round 2, so even if somehow you guessed the
    name of that file you wouldn't be able to load it.</p>

    <FlexBox dir="row">
      {data.children.map((item: any) =>
        <FlexBox dir="column" lined key={item.slug}>
          <Link to={item.slug}>
            <img src={item.image} alt="A man" width="200px" /><br />
            <label>{item.label}</label>
            {item.state.has_answers() ? <><br/><label>Answer: {item.state.answer_str()}</label></> : ""}
          </Link>
        </FlexBox>
      )}
    </FlexBox>
  </div>
}

export default Component;
