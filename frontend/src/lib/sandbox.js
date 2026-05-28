export function buildSandboxHtml(code, runId) {
  const encoded = JSON.stringify(code).replace(/<\/script>/gi, '<\\/script>')
  return `<!DOCTYPE html><html><body><script>
(function(){
  var id=${runId};
  function send(t,m){try{parent.postMessage({__runId:id,type:t,msg:m},'*')}catch(_){}}
  function fmt(args){
    return Array.prototype.slice.call(args).map(function(x){
      return (x!==null&&typeof x==='object')?JSON.stringify(x,null,2):String(x);
    }).join(' ');
  }
  console.log=function(){send('log',fmt(arguments))};
  console.error=function(){send('err',fmt(arguments))};
  console.warn=function(){send('warn',fmt(arguments))};
  console.info=function(){send('log',fmt(arguments))};
  window.onerror=function(msg,_,__,___,err){send('err',err?err.toString():msg);return true};
  window.addEventListener('unhandledrejection',function(e){
    var r=e.reason;
    send('err','Unhandled rejection: '+(r&&r.message?r.message:String(r)));
  });
  try{(0,eval)(${encoded})}catch(e){send('err',e.toString())}
  send('__done__',null);
}());
<\/script></body></html>`
}