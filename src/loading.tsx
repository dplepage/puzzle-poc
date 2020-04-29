import React, { useState, useEffect } from 'react';

export type loadState = "loading" | "notfound" | "error" | "loaded";

export function useLoading<T>(loader:()=>Promise<T>, version:any[]):[T|null, loadState] {
  // React hook to load data from an arbitrary callable. The version is a bit of
  // a hack - changing anything in it causes the data to be reloaded, otherwise
  // it won't be. Don't pass in something that's different on every render, or
  // you'll get an infinite loop of reloading data over and over again.
  //
  // Usage looks like const [data, state] = useLoading(()=>load(...), [v1, v2])
  // state will be a loadState and data will be either null or the most recently
  // loaded data.
  //
  // Note: data will be null if it's never been loaded; if you reload it
  // (because any of the versioning arguments changes), the state will change to
  // loading but the data won't change until the load succeeds - use the state
  // to determine if it's currently (re)loading and use data === null to tell if
  // it hasn't ever loaded yet.
  const [data, setData] = useState<T|null>(null);
  const [state, setState] = useState<loadState>("loading");
  useEffect(()=>{
    async function load_data() {
      setState("loading");
      try {
        const data = await loader()
        setData(data)
        setState("loaded")
      } catch(err) {
        setState("error")
      }
    }
    load_data();
  }, [...version]);
  return [data, state];
}

export function DynamicImage(props:React.ImgHTMLAttributes<{}>) {
  // React component that loads an image dynamically. The src should be the path
  // to the image relative to the location of this file. This is a bit of a hack
  // - it's mainly important for Round pages, where you may have image elements
  // that only show under certain circumstances (i.e. when specific subpuzzles
  // are unlocked). If this gets too clunky to use, just use a dynamically
  // loaded component that includes the images normally.
  const {src} = props
  const [img, setImg] = useState<React.ReactElement>(<span/>);
  useEffect(()=>{
    let visible = true
    // ''+src works but just src doesn't - must be a webpack special case
    import(''+src).then((mod)=>{
      // gate by visibility so if this changes as you leave the page we don't
      // try to setState after the component is unmounted.
      if (visible) {
        setImg(<img {...props} src={mod.default}/>)
      }
    })
    return () => {visible = false};
  }, [src, props])
  return img
}

