import { makeScene2D } from "@motion-canvas/2d"
import { Circle, Img, Node, Rect, Icon } from "@motion-canvas/2d/lib/components"
import { all, any, chain, loop, waitFor } from "@motion-canvas/core/lib/flow"
import { Color, ColorSignal, Vector2 } from "@motion-canvas/core/lib/types"
import { createRef, makeRef } from "@motion-canvas/core/lib/utils"
import { ranbowSignal } from "../effects"
import { BEAT } from "../timings"
import { SignalValue, SimpleSignal, createSignal } from "@motion-canvas/core/lib/signals"
import { Filter, PossibleCanvasStyle } from "@motion-canvas/2d/lib/partials"
import { random, setRandomSeed } from "../utils"
import { easeInCubic, linear } from "@motion-canvas/core/lib/tweening"
import { CityMap, Gray, Whitish, groundY } from "./opening"

import heart from "../../images/heart.svg"

const iconSources = [
  "material-symbols:android-camera",
  "material-symbols:alarm",
  "material-symbols:airport-shuttle",
  "material-symbols:auto-stories",
  "material-symbols:browse-activity",
  "material-symbols:emoji-food-beverage",
  "material-symbols:no-drinks",
  "material-symbols:garden-cart",
  "material-symbols:hardware",
  "material-symbols:gleaf",
  "material-symbols:hotel",
  "material-symbols:stadia-controller",
]

let iconRefs: Icon[] = []

export default makeScene2D(function* (view) {
  let camera = createRef<Node>()

  let heartRef = createRef<Icon>()

  let curtainRef = createRef<Rect>()
  
  

  const rainBowColor = Color.createSignal("#e13238")

  let iconN = 50

  let min = 0
  let max = 11
  // generate an array of 20 random integers ranged from min to max
  setRandomSeed(1123)
  let randomIconID = Array.from(
    { length: iconN },
    () => Math.floor(random() * (max - min + 1)) + min
  )

  let xMin = -960
  let xMax = 960

  let yMin = -1620
  let yMax = -540

  let randomIconX = Array.from(
    { length: iconN },
    () => Math.floor(random() * (xMax - xMin + 1)) + xMin
  )
  let randomIconY = Array.from(
    { length: iconN },
    () => Math.floor(random() * (yMax - yMin + 1)) + yMin
  )

  // generate an array filled with 1 to 100, but in random order
  let randomAppearOrder = Array.from({ length: iconN }, (_, i) => i + 1).sort(() => random() - 0.5)

  view.add(
    <Node ref={camera} y={1080}>
      <Icon
        ref={heartRef}
        width={200}
        height={200}
        x={0}
        y={-1080}
        scale={0}
        color={rainBowColor}
        icon={"material-symbols:favorite"}
      ></Icon>

      <Rect
        y={-1080}
        ref={curtainRef}
        fill={Gray}
        width={"100%"}
        height={"100%"}
        opacity={0}
      ></Rect>

      <Node x={0} y={0}>
        {randomIconID.map((id, index) => {
          return (
            <Icon
              width={200}
              height={200}
              x={xMin + 192 * (index % 10)}
              y={yMin + 192 * (index / 10)}
              scale={3}
              color={Gray}
              icon={iconSources[id]}
              opacity={0}
              ref={makeRef(iconRefs, index)}
            ></Icon>
          )
        })}
      </Node>

      
    </Node>
  )

  yield* any(
    waitFor(0),
    loop(100, () => ranbowSignal(rainBowColor, BEAT * 2))
  )

  yield* chain(
    heartRef()
      .scale(0, 0)
      .to(3, BEAT * 2)
  )

  yield* any(
    waitFor(BEAT * 6),
    loop(15, () =>
      chain(
        heartRef()
          .scale(2, BEAT / 2)
          .to(3, BEAT / 2),
        waitFor(BEAT)
      )
    )
  )

  yield* any(
    chain(waitFor(BEAT * 16), curtainRef().opacity(1, BEAT * 8)),
    chain(
      ...randomAppearOrder.map((order, index) =>
        any(
          waitFor((BEAT * 24) / iconN),
          iconRefs[order - 1].opacity(0.8, BEAT / 2).to(1, BEAT * 4)
        )
      )
    )
  )

  // yield* waitFor(BEAT * 32)
})
