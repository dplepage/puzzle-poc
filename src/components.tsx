import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { ViewData } from './engine/interface'

// Stupid quick components, for anything real use bootstrap or material ui or
// maybe get an actual designer to help

export function Show({data}:{data:any}) {
  window.console.log("SHOW:", data)
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

type FlexProps = {
  dir: "row"|"column",
  lined?: boolean
}

export const FlexBox:FunctionComponent<FlexProps> = (({dir, children, lined}) => {
  const opts: React.CSSProperties = {
    display: "flex",
    flexDirection: dir,
    alignItems: 'stretch',
  };
  if (lined) {
    opts['border'] = '1px solid black';
  }
  return <div style={opts}>
    {children}
   </div>
})

export function GenericRound({ data, label }: { data: ViewData, label:string }) {
  return <div>
    <h1>{label}</h1>
    <ul>
      {data.children.map((item: any) =>
        <li key={item.slug}>
          <Link to={item.slug}>
            <label>
              {item.label}{item.solved ? " - " + item.answer : ""}
            </label>
          </Link>
        </li>
      )}
    </ul>
  </div>
}

export class ErrorBoundary extends React.Component {
  state = {
    hasError: false
  };

  componentDidCatch(error: Error, info: any): void {
    this.setState({hasError:true})
  }

  render() {
    if (this.state.hasError) {
      return <div>
        <h1>Site Failure</h1>
        <p>This puzzle has failed to load. This failure is not a puzzle.</p>
      </div>;
    }
    return this.props.children;
  }
}
