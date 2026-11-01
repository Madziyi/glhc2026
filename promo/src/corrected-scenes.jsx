import React from 'react';
import {Freeze,useCurrentFrame} from 'remotion';
import timeline from './corrected-timeline.json';
import {narrationTimeMap} from './narration-time-map.mjs';
import {RoughOpening} from './rough-opening';
import {RoughScience} from './rough-science';
import {RoughWaterfront} from './rough-waterfront';
import {RoughRoundOne} from './rough-round-one';
import {RoughRoundTwo} from './rough-round-two';
import {RoughClosing} from './rough-closing';
const components=[RoughOpening,RoughScience,RoughWaterfront,RoughRoundOne,RoughRoundTwo,RoughClosing];
const maps=timeline.scenes.map(s=>narrationTimeMap(s.from,s.to));
export function CorrectedScene({index}){
 const f=useCurrentFrame(),Component=components[index];
 return <Freeze frame={maps[index](f)}><Component production revision assembled/></Freeze>;
}
