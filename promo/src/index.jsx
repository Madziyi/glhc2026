import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Opening} from './opening';
import {FullPromo} from './full';
registerRoot(()=><><Composition id="Opening" component={Opening} durationInFrames={450} fps={30} width={1920} height={1080}/><Composition id="FullPromo" component={FullPromo} durationInFrames={2250} fps={30} width={1920} height={1080}/></>);
