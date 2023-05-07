import { makeProject } from "@motion-canvas/core"

import opening from "./scenes/opening?scene"

import chorus from "./scenes/chorus?scene"

import bridge from './scenes/bridge?scene'
import bridge2 from './scenes/bridge2?scene'

import bgm from "../bgm.mp3"

import bridge3 from "./scenes/bridge3?scene"
import bridge4 from "./scenes/bridge4?scene"
import chorus2 from "./scenes/chorus2?scene"
import hype from "./scenes/hype?scene"
import bridge5 from "./scenes/bridge5?scene"
import breakout from "./scenes/breakout?scene"
import end from "./scenes/end?scene"
import bridge6 from "./scenes/bridge6?scene"

import './global.css';

export default makeProject({
  audio: bgm,
  scenes: [opening, bridge, bridge2, bridge3, bridge4, chorus, chorus2, hype, bridge6, bridge5, breakout, end],
})
