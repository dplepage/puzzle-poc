(this["webpackJsonpreact-puzzles"]=this["webpackJsonpreact-puzzles"]||[]).push([[9],{38:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),r=a(7),u=a(15);t.default=function(e){var t=e.data;return l.a.createElement("div",null,l.a.createElement("h1",null,"Welcome to the hunt!"),l.a.createElement("p",null," Note that if you toggle lock states in the sidebar, the page updates instantaneously."),l.a.createElement("p",null," This page demos the idea of having custom data returned by the server based on what's unlocked."),l.a.createElement("p",null," This view's data is a round link AND an extra image for each round; the images won't be sent out by the server unless that round is unlocked. For example, if you haven't yet unlocked round 2, the image file \"round2.plan.gif\" won't have been requested. If there were a real server providing the loading, it would refuse to load anything starting with 'round2.' until you'd unlocked round 2, so even if somehow you guessed the name of that file you wouldn't be able to load it."),l.a.createElement(u.a,{dir:"row"},t.children.map((function(e){return l.a.createElement(u.a,{dir:"column",lined:!0,key:e.slug},l.a.createElement(r.b,{to:e.slug},l.a.createElement("img",{src:e.image,alt:"A man",width:"200px"}),l.a.createElement("br",null),l.a.createElement("label",null,e.label),e.state.has_answers()?l.a.createElement(l.a.Fragment,null,l.a.createElement("br",null),l.a.createElement("label",null,"Answer: ",e.state.answer_str())):""))}))))}}}]);
//# sourceMappingURL=start.3e6a89a5.chunk.js.map