(this["webpackJsonpreact-puzzles"]=this["webpackJsonpreact-puzzles"]||[]).push([[59],{160:function(t,e,n){"use strict";n.r(e),n.d(e,"Show",(function(){return f})),n.d(e,"FlexBox",(function(){return s})),n.d(e,"GenericRound",(function(){return p})),n.d(e,"ErrorBoundary",(function(){return y}));var r=n(42),o=n(58),u=n(313),c=n(312),i=n(0),l=n.n(i),a=n(31);function f(t){var e=t.data;return window.console.log("SHOW:",e),l.a.createElement("pre",null,JSON.stringify(e,null,2))}var s=function(t){var e=t.dir,n=t.children,r={display:"flex",flexDirection:e,alignItems:"stretch"};return t.lined&&(r.border="1px solid black"),l.a.createElement("div",{style:r},n)};function p(t){var e=t.data,n=t.label;return l.a.createElement("div",null,l.a.createElement("h1",null,n),l.a.createElement("ul",null,e.children.map((function(t){return l.a.createElement("li",{key:t.slug},l.a.createElement(a.b,{to:t.slug},l.a.createElement("label",null,t.label,t.solved?" - "+t.answer:"")))}))))}var y=function(t){Object(u.a)(n,t);var e=Object(c.a)(n);function n(){var t;Object(r.a)(this,n);for(var o=arguments.length,u=new Array(o),c=0;c<o;c++)u[c]=arguments[c];return(t=e.call.apply(e,[this].concat(u))).state={hasError:!1},t}return Object(o.a)(n,[{key:"componentDidCatch",value:function(t,e){this.setState({hasError:!0})}},{key:"render",value:function(){return this.state.hasError?l.a.createElement("div",null,l.a.createElement("h1",null,"Site Failure"),l.a.createElement("p",null,"This puzzle has failed to load. This failure is not a puzzle.")):this.props.children}}]),n}(l.a.Component)},312:function(t,e,n){"use strict";function r(t){return(r=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function o(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}function u(t){return(u="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"===typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function c(t,e){return!e||"object"!==u(e)&&"function"!==typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function i(t){return function(){var e,n=r(t);if(o()){var u=r(this).constructor;e=Reflect.construct(n,arguments,u)}else e=n.apply(this,arguments);return c(this,e)}}n.d(e,"a",(function(){return i}))},313:function(t,e,n){"use strict";function r(t,e){return(r=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function o(t,e){if("function"!==typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&r(t,e)}n.d(e,"a",(function(){return o}))}}]);
//# sourceMappingURL=59.e47aa4a7.chunk.js.map