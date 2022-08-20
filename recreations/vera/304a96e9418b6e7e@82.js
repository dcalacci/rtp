// https://observablehq.com/@tmcw/copiable@82
function _1(md,copiable){return(
md`# Copiable

This notebook provides an affordance for copying text. You can use it like this, and click this import statement to copy it:

${copiable(md`
\`\`\`js
import {copiable, style} from "@tmcw/copiable"
\`\`\``)}

It uses [execCommand](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand) to do its thing.

---

\`\`\`
md\`
This is a chunk of text, with this bit copiable:

$\{copiable(md\`Some content\`)}
\`
\`\`\`


---

\`\`\`js
style
\`\`\`

(the style value is a stylesheet that adds the nice yellow hover indication when something is copiable/copied)

`
)}

function _copiable(copy){return(
element => {
  element.addEventListener('click', e => {
    copy(element.textContent.trim());
    element.classList.add('copied');
    setTimeout(() => element.classList.remove('copied'), 500);
  });
  element.classList.add('copiable');
  return element;
}
)}

function _copy(){return(
function copy(text) {
  const fakeElem = document.body.appendChild(document.createElement('textarea'));
  fakeElem.style.position = 'absolute';
  fakeElem.style.left = '-9999px';
  fakeElem.setAttribute('readonly', '');
  fakeElem.value = text;
  fakeElem.select();
  try {
    return document.execCommand('copy');
  } catch (err) {
    return false;
  } finally {
    fakeElem.parentNode.removeChild(fakeElem);
  }
}
)}

function _style(html){return(
html`<style>
.copiable {
  position:relative;
  cursor:pointer;
}
.copiable:hover::after {
  background: #FBF1A9;
  content: 'click to copy';
  padding: 0px 10px;
}
.copiable.copied:hover::after {
  content: 'copied!';
}
</style>`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md","copiable"], _1);
  main.variable(observer("copiable")).define("copiable", ["copy"], _copiable);
  main.variable(observer("copy")).define("copy", _copy);
  main.variable(observer("style")).define("style", ["html"], _style);
  return main;
}
