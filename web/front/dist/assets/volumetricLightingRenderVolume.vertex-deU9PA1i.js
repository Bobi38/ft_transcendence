import{JC as e,Tb as t,YC as n,dl as r,hy as i,sw as a,wb as o}from"./index-CHiGcwTe.js";var s,c,l;a((()=>{n(),t(),o(),r(),i(),s=`volumetricLightingRenderVolumeVertexShader`,c=`#include<__decl__sceneVertex>
#include<__decl__meshVertex>
attribute vec3 position;varying vec4 vWorldPos;void main(void) {vec4 worldPos=world*vec4(position,1.0);vWorldPos=worldPos;gl_Position=viewProjection*worldPos;}
`,e.ShadersStore[s]||(e.ShadersStore[s]=c),l={name:s,shader:c}}))();export{l as volumetricLightingRenderVolumeVertexShader};