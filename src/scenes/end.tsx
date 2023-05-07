import { makeScene2D } from "@motion-canvas/2d"
import { Circle, Node, Rect, Txt } from "@motion-canvas/2d/lib/components"
import { all, any, chain, loop, waitFor } from "@motion-canvas/core/lib/flow"
import { Color, ColorSignal, Direction, Vector2 } from "@motion-canvas/core/lib/types"
import { createRef } from "@motion-canvas/core/lib/utils"
import { ranbowSignal } from "../effects"
import { BEAT } from "../timings"
import { SignalValue, SimpleSignal, createSignal } from "@motion-canvas/core/lib/signals"
import { PossibleCanvasStyle } from "@motion-canvas/2d/lib/partials"
import { random, setRandomSeed } from "../utils"
import { easeInCubic, easeInOutCubic, easeOutCubic, linear } from "@motion-canvas/core/lib/tweening"
import { CityMap, Whitish, groundY } from "./opening"
import { slideTransition } from "@motion-canvas/core/lib/transitions"
import { Slides } from "@motion-canvas/core/lib/scenes"

export default makeScene2D(function* (view) {
  let camera = createRef<Node>()

  const rainBowColor = Color.createSignal("#e13238")

  const textFly = createRef<Txt>()

  const circleMain = createRef<Circle>()

  view.add(
    <Node ref={camera} y={0}>
      <Txt
        ref={textFly}
        text={"Fly Away"}
        opacity={0}
        width={1920}
        fill={rainBowColor}
        fontWeight={600}
        fontSize={256}
        lineHeight={700}
        textAlign={"center"}
        x={0}
        y={-200}
      />
      <Circle opacity={0} x={0} y={0} size={100} ref={circleMain} fill={rainBowColor} />
    </Node>
  )

  let offScreenY = 1080 / 2 + 200
  let flyIncrement = 50
  circleMain().position.y(offScreenY)

  yield* any(
    waitFor(0),
    loop(100, () => ranbowSignal(rainBowColor, BEAT * 2))
  )

  yield* slideTransition(Direction.Top, BEAT / 2)

  circleMain().opacity(1)

  yield* all(
    chain(
      chain(textFly().opacity(1, BEAT), textFly().opacity(0, BEAT), waitFor(BEAT * 2)),
      textFly().fontFamily("Playfair Display", 0),
      chain(textFly().opacity(1, BEAT), textFly().opacity(0, BEAT), waitFor(BEAT * 2)),
      textFly().fontFamily("Bruno Ace SC", 0),
      textFly().opacity(1, BEAT * 2),
      textFly().opacity(0, BEAT * 2),
      textFly().fontFamily("Darumadrop One", 0),
      waitFor(BEAT * 4),
      chain(textFly().opacity(1, BEAT), textFly().opacity(0, BEAT), waitFor(BEAT * 2)),
      textFly().fontFamily("Dancing Script", 0),
      chain(textFly().opacity(1, BEAT), textFly().opacity(0, BEAT), waitFor(BEAT * 2)),
      textFly().fontFamily("Pacifico", 0),
      textFly().opacity(1, BEAT * 2),
      textFly().opacity(0, BEAT * 2)
    ),
    chain(
      loop(7, (index) =>
        chain(
          circleMain()
            .position.y(offScreenY - index * flyIncrement, 0)
            .to(300 - index * flyIncrement, BEAT, easeOutCubic)
            .to(offScreenY - index * flyIncrement, BEAT * 3, easeInOutCubic),
          // waitFor(BEAT * 2)
        )
      ),
      circleMain().position.y(offScreenY - 7 * flyIncrement, 0).to(300 - 7 * flyIncrement, BEAT, easeOutCubic),
      waitFor(BEAT * 0.5),
      circleMain().size(0, BEAT * 0.5)      
    )
  )

  yield* waitFor(BEAT * 2)

})
