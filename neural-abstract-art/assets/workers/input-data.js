var MathUtils={lerp:function(t,e,n){return t+n*(e-t)}},getReturnValue=[function(t){return t},function(t,e){return e},function(t,e){return Math.sqrt(t*t+e*e)},function(t,e,n){return n}];self.addEventListener("message",function(t){var e=t.data.message,i=e.height,u=e.xOffset,l=e.yOffset,o=e.size,d=e.time,h=e.width,c=h/i,n=new Float32Array(o*o*4).fill(0).map(function(t,e){var n=Math.round(e/4),r=u+n%o,a=l+Math.floor(n/o),s=MathUtils.lerp(-1,1,r/(h-1))*c,f=MathUtils.lerp(-1,1,a/(i-1));return getReturnValue[e%4](s,f,d)});self.postMessage({id:t.data.id,message:{data:n,xOffset:u,yOffset:l}})});