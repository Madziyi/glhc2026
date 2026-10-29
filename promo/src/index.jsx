import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Opening} from './opening';
import {FullPromo} from './full';
import {Section2Concept,Section2Photos} from './section2';
import {Section3Sketch} from './section3';
import {RoughOpening} from './rough-opening';
registerRoot(()=><><Composition id="Opening" component={Opening} durationInFrames={450} fps={30} width={1920} height={1080}/><Composition id="FullPromo" component={FullPromo} durationInFrames={2250} fps={30} width={1920} height={1080}/><Composition id="Section2Concept" component={Section2Concept} durationInFrames={360} fps={30} width={1920} height={1080}/><Composition id="Section2Photos" component={Section2Photos} durationInFrames={360} fps={30} width={1920} height={1080}/><Composition id="Section3Sketch" component={Section3Sketch} durationInFrames={300} fps={30} width={1920} height={1080}/><Composition id="RoughOpening" component={RoughOpening} durationInFrames={405} fps={30} width={1920} height={1080}/></>);
