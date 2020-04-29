import React from 'react';
import { Link } from 'react-router-dom';
import { ViewProps } from '../engine/interface';
import { DynamicImage } from '../loading';
import { Space, Card } from 'antd';

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

    <Space direction="horizontal">
      {data.children.map((item: any) =>
        <Card key={item.slug} title={item.label}>
          <Link to={item.slug}>
            <DynamicImage src={item.image} alt={item.img_alt}/>
          </Link>
          <div style={{margin:"auto"}}>
            <Link to={item.slug}>
              <label>{item.label}</label>
            </Link>
          </div>
          <div style={{margin:"auto"}}>
            {item.state.has_answers() ? <label>Answer: {item.state.answer_str()}</label> : ""}
          </div>
        </Card>
      )}
    </Space>
  </div>
}

export default Component;
