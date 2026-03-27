import{$b as e,Ax as t,BC as n,CC as r,Cb as i,Cx as a,Cy as o,DC as s,Db as c,Dx as l,EC as u,Eb as d,Ex as f,Hs as p,Ib as ee,JC as m,My as h,Nb as g,Ob as _,Ox as v,Pb as y,Py as te,SC as ne,Sb as re,Sx as ie,TC as b,Tx as x,VC as S,YC as C,_C as w,_x as T,bC as E,bb as D,bx as O,cC as k,dc as A,ex as j,gC as M,gb as N,gx as P,hc as F,hx as I,ix as L,jb as R,kb as z,kx as B,lc as V,mC as H,mx as U,my as ae,nx as W,pC as G,pc as K,px as q,rx as J,sC as oe,sc as se,tx as ce,vC as le,vb as ue,vx as de,wC as fe,wx as pe,xC as Y,xc as me,xx as he,xy as ge,yb as _e,yx as ve}from"./index-CHiGcwTe.js";W(),L(),l(),k(),H(),w(),E(),ne(),s(),S(),C(),ae(),F(),K(),A(),V(),ee(),y(),g(),R(),p(),se(),_(),z(),c();var X=`normalPixelShader`,Z=`precision highp float;uniform vec4 vEyePosition;uniform vec4 vDiffuseColor;varying vec3 vPositionW;
#ifdef NORMAL
varying vec3 vNormalW;
#endif
#ifdef LIGHTING
#include<helperFunctions>
#include<__decl__lightFragment>[0]
#include<__decl__lightFragment>[1]
#include<__decl__lightFragment>[2]
#include<__decl__lightFragment>[3]
#include<lightsFragmentFunctions>
#include<shadowsFragmentFunctions>
#endif
#ifdef DIFFUSE
varying vec2 vDiffuseUV;uniform sampler2D diffuseSampler;uniform vec2 vDiffuseInfos;
#endif
#include<clipPlaneFragmentDeclaration>
#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
varying float vViewDepth;
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
vec3 viewDirectionW=normalize(vEyePosition.xyz-vPositionW);vec4 baseColor=vec4(1.,1.,1.,1.);vec3 diffuseColor=vDiffuseColor.rgb;float alpha=vDiffuseColor.a;
#ifdef DIFFUSE
baseColor=texture2D(diffuseSampler,vDiffuseUV);
#ifdef ALPHATEST
if (baseColor.a<0.4)
discard;
#endif
#include<depthPrePass>
baseColor.rgb*=vDiffuseInfos.y;
#endif
#ifdef NORMAL
baseColor=mix(baseColor,vec4(vNormalW,1.0),0.5);
#endif
#ifdef NORMAL
vec3 normalW=normalize(vNormalW);
#else
vec3 normalW=vec3(1.0,1.0,1.0);
#endif
#ifdef LIGHTING
vec3 diffuseBase=vec3(0.,0.,0.);lightingInfo info;float shadow=1.;float glossiness=0.;float aggShadow=0.;float numLights=0.;
#include<lightFragment>[0]
#include<lightFragment>[1]
#include<lightFragment>[2]
#include<lightFragment>[3]
vec3 finalDiffuse=clamp(diffuseBase*diffuseColor,0.0,1.0)*baseColor.rgb;
#else
vec3 finalDiffuse= baseColor.rgb;
#endif
vec4 color=vec4(finalDiffuse,alpha);
#include<logDepthFragment>
#include<fogFragment>
gl_FragColor=color;
#include<imageProcessingCompatibility>
#define CUSTOM_FRAGMENT_MAIN_END
}`;m.ShadersStore[X]||(m.ShadersStore[X]=Z),C(),te(),h(),d(),re(),y(),i(),F(),K(),D(),o(),ge(),ue(),N(),_e(),me();var Q=`normalVertexShader`,ye=`precision highp float;attribute vec3 position;
#ifdef NORMAL
attribute vec3 normal;
#endif
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#ifdef VERTEXCOLOR
attribute vec4 color;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
uniform mat4 view;uniform mat4 viewProjection;
#ifdef DIFFUSE
varying vec2 vDiffuseUV;uniform mat4 diffuseMatrix;uniform vec2 vDiffuseInfos;
#endif
#ifdef POINTSIZE
uniform float pointSize;
#endif
varying vec3 vPositionW;
#ifdef NORMAL
varying vec3 vNormalW;
#endif
#include<clipPlaneVertexDeclaration>
#include<logDepthDeclaration>
#include<fogVertexDeclaration>
#include<__decl__lightFragment>[0..maxSimultaneousLights]
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
varying float vViewDepth;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(position,1.0);gl_Position=viewProjection*worldPos;vPositionW=vec3(worldPos);
#ifdef NORMAL
vNormalW=normalize(vec3(finalWorld*vec4(normal,0.0)));
#endif
#ifndef UV1
vec2 uv=vec2(0.,0.);
#endif
#ifndef UV2
vec2 uv2=vec2(0.,0.);
#endif
#ifdef DIFFUSE
if (vDiffuseInfos.x==0.)
{vDiffuseUV=vec2(diffuseMatrix*vec4(uv,1.0,0.0));}
else
{vDiffuseUV=vec2(diffuseMatrix*vec4(uv2,1.0,0.0));}
#endif
#include<clipPlaneVertex>
#include<logDepthVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#if defined(POINTSIZE) && !defined(WEBGPU)
gl_PointSize=pointSize;
#endif
#define CUSTOM_VERTEX_MAIN_END
}
`;m.ShadersStore[Q]||(m.ShadersStore[Q]=ye),j(),t(),pe();var be=class extends J{constructor(){super(),this.DIFFUSE=!1,this.CLIPPLANE=!1,this.CLIPPLANE2=!1,this.CLIPPLANE3=!1,this.CLIPPLANE4=!1,this.CLIPPLANE5=!1,this.CLIPPLANE6=!1,this.ALPHATEST=!1,this.DEPTHPREPASS=!1,this.POINTSIZE=!1,this.FOG=!1,this.LIGHT0=!1,this.LIGHT1=!1,this.LIGHT2=!1,this.LIGHT3=!1,this.SPOTLIGHT0=!1,this.SPOTLIGHT1=!1,this.SPOTLIGHT2=!1,this.SPOTLIGHT3=!1,this.HEMILIGHT0=!1,this.HEMILIGHT1=!1,this.HEMILIGHT2=!1,this.HEMILIGHT3=!1,this.DIRLIGHT0=!1,this.DIRLIGHT1=!1,this.DIRLIGHT2=!1,this.DIRLIGHT3=!1,this.POINTLIGHT0=!1,this.POINTLIGHT1=!1,this.POINTLIGHT2=!1,this.POINTLIGHT3=!1,this.SHADOW0=!1,this.SHADOW1=!1,this.SHADOW2=!1,this.SHADOW3=!1,this.SHADOWS=!1,this.SHADOWESM0=!1,this.SHADOWESM1=!1,this.SHADOWESM2=!1,this.SHADOWESM3=!1,this.SHADOWPOISSON0=!1,this.SHADOWPOISSON1=!1,this.SHADOWPOISSON2=!1,this.SHADOWPOISSON3=!1,this.SHADOWPCF0=!1,this.SHADOWPCF1=!1,this.SHADOWPCF2=!1,this.SHADOWPCF3=!1,this.SHADOWPCSS0=!1,this.SHADOWPCSS1=!1,this.SHADOWPCSS2=!1,this.SHADOWPCSS3=!1,this.NORMAL=!1,this.UV1=!1,this.UV2=!1,this.NUM_BONE_INFLUENCERS=0,this.BonesPerMesh=0,this.INSTANCES=!1,this.THIN_INSTANCES=!1,this.LIGHTING=!1,this.IMAGEPROCESSINGPOSTPROCESS=!1,this.SKIPFINALCOLORCLAMP=!1,this.LOGARITHMICDEPTH=!1,this.AREALIGHTSUPPORTED=!0,this.AREALIGHTNOROUGHTNESS=!0,this.rebuild()}},$=class t extends ce{constructor(e,t){super(e,t),this.diffuseColor=new le(1,1,1),this._disableLighting=!1,this._maxSimultaneousLights=4}needAlphaBlending(){return this.alpha<1}needAlphaBlendingForMesh(e){return this.needAlphaBlending()||e.visibility<1}needAlphaTesting(){return!1}getAlphaTestTexture(){return null}isReadyForSubMesh(t,n,r){let i=n._drawWrapper;if(this.isFrozen&&i.effect&&i._wasPreviouslyReady&&i._wasPreviouslyUsingInstances===r)return!0;n.materialDefines||=new be;let o=n.materialDefines,s=this.getScene();if(this._isReadyForSubMesh(n))return!0;let c=s.getEngine();if(o._areTexturesDirty&&(o._needUVs=!1,s.texturesEnabled&&this._diffuseTexture&&f.DiffuseTextureEnabled))if(this._diffuseTexture.isReady())o._needUVs=!0,o.DIFFUSE=!0;else return!1;if(ie(t,s,this._useLogarithmicDepth,this.pointsCloud,this.fogEnabled,this.needAlphaTestingForMesh(t),o,void 0,void 0,void 0,this._isVertexOutputInvariant),o._needNormals=!0,he(s,t,o,!1,this._maxSimultaneousLights,this._disableLighting),O(s,c,this,o,!!r,null,n.getRenderingMesh().hasThinInstances),o.LIGHTING=!this._disableLighting,ve(t,o,!0,!0),o.isDirty){o.markAsProcessed(),s.resetCachedMaterial();let r=new e;o.FOG&&r.addFallback(1,`FOG`),P(o,r),o.NUM_BONE_INFLUENCERS>0&&r.addCPUSkinningFallback(0,t),o.IMAGEPROCESSINGPOSTPROCESS=s.imageProcessingConfiguration.applyByPostProcess;let i=[G.PositionKind];o.NORMAL&&i.push(G.NormalKind),o.UV1&&i.push(G.UVKind),o.UV2&&i.push(G.UV2Kind),T(i,t,o,r),de(i,o);let l=o.toString(),u=[`world`,`view`,`viewProjection`,`vEyePosition`,`vLightsType`,`vDiffuseColor`,`vFogInfos`,`vFogColor`,`pointSize`,`vDiffuseInfos`,`mBones`,`diffuseMatrix`,`logarithmicDepthConstant`],d=[`diffuseSampler`,`areaLightsLTC1Sampler`,`areaLightsLTC2Sampler`],f=[];v(u),a({uniformsNames:u,uniformBuffersNames:f,samplers:d,defines:o,maxSimultaneousLights:4}),n.setEffect(s.getEngine().createEffect(`normal`,{attributes:i,uniformsNames:u,uniformBuffersNames:f,samplers:d,defines:l,fallbacks:r,onCompiled:this.onCompiled,onError:this.onError,indexParameters:{maxSimultaneousLights:4}},c),o,this._materialContext)}if(o.AREALIGHTUSED){for(let e=0;e<t.lightSources.length;e++)if(!t.lightSources[e]._isReady())return!1}return!n.effect||!n.effect.isReady()?!1:(o._renderId=s.getRenderId(),i._wasPreviouslyReady=!0,i._wasPreviouslyUsingInstances=!!r,!0)}bindForSubMesh(e,t,n){let r=this.getScene(),i=n.materialDefines;if(!i)return;let a=n.effect;a&&(this._activeEffect=a,this.bindOnlyWorldMatrix(e),this._activeEffect.setMatrix(`viewProjection`,r.getTransformMatrix()),q(t,this._activeEffect),this._mustRebind(r,a,n)&&(this.diffuseTexture&&f.DiffuseTextureEnabled&&(this._activeEffect.setTexture(`diffuseSampler`,this.diffuseTexture),this._activeEffect.setFloat2(`vDiffuseInfos`,this.diffuseTexture.coordinatesIndex,this.diffuseTexture.level),this._activeEffect.setMatrix(`diffuseMatrix`,this.diffuseTexture.getTextureMatrix())),B(a,this,r),this.pointsCloud&&this._activeEffect.setFloat(`pointSize`,this.pointSize),this._useLogarithmicDepth&&x(i,a,r),r.bindEyePosition(a)),this._activeEffect.setColor4(`vDiffuseColor`,this.diffuseColor,this.alpha*t.visibility),r.lightsEnabled&&!this.disableLighting&&I(r,t,this._activeEffect,i),r.fogEnabled&&t.applyFog&&r.fogMode!==oe.FOGMODE_NONE&&this._activeEffect.setMatrix(`view`,r.getViewMatrix()),U(r,t,this._activeEffect),this._afterBind(t,this._activeEffect,n))}getAnimatables(){let e=[];return this.diffuseTexture&&this.diffuseTexture.animations&&this.diffuseTexture.animations.length>0&&e.push(this.diffuseTexture),e}getActiveTextures(){let e=super.getActiveTextures();return this._diffuseTexture&&e.push(this._diffuseTexture),e}hasTexture(e){return!!(super.hasTexture(e)||this.diffuseTexture===e)}dispose(e){this.diffuseTexture&&this.diffuseTexture.dispose(),super.dispose(e)}clone(e){return M.Clone(()=>new t(e,this.getScene()),this)}serialize(){let e=super.serialize();return e.customType=`BABYLON.NormalMaterial`,e}getClassName(){return`NormalMaterial`}static Parse(e,n,r){return M.Parse(()=>new t(e.name,n),e,n,r)}};u([b(`diffuseTexture`)],$.prototype,`_diffuseTexture`,void 0),u([Y(`_markAllSubMeshesAsTexturesDirty`)],$.prototype,`diffuseTexture`,void 0),u([fe()],$.prototype,`diffuseColor`,void 0),u([r(`disableLighting`)],$.prototype,`_disableLighting`,void 0),u([Y(`_markAllSubMeshesAsLightsDirty`)],$.prototype,`disableLighting`,void 0),u([r(`maxSimultaneousLights`)],$.prototype,`_maxSimultaneousLights`,void 0),u([Y(`_markAllSubMeshesAsLightsDirty`)],$.prototype,`maxSimultaneousLights`,void 0),n(`BABYLON.NormalMaterial`,$);export{$ as NormalMaterial};