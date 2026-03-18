import{JC as e,YC as t,ny as n,sw as r,ty as i}from"./index-CHiGcwTe.js";var a,o,s;r((()=>{t(),n(),i(),a=`volumetricLightingRenderVolumeVertexShader`,o=`#include<sceneUboDeclaration>
#include<meshUboDeclaration>
attribute position : vec3f;varying vWorldPos: vec4f;@vertex
fn main(input : VertexInputs)->FragmentInputs {let worldPos=mesh.world*vec4f(vertexInputs.position,1.0);vertexOutputs.vWorldPos=worldPos;vertexOutputs.position=scene.viewProjection*worldPos;}
`,e.ShadersStoreWGSL[a]||(e.ShadersStoreWGSL[a]=o),s={name:a,shader:o}}))();export{s as volumetricLightingRenderVolumeVertexShaderWGSL};