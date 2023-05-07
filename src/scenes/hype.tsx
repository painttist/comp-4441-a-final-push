import { makeScene2D } from "@motion-canvas/2d"
import { Circle, Line, Node, Rect, Txt } from "@motion-canvas/2d/lib/components"
import { all, any, chain, loop, waitFor, waitUntil } from "@motion-canvas/core/lib/flow"
import { Color, ColorSignal, Direction, Vector2 } from "@motion-canvas/core/lib/types"
import { createRef, makeRef } from "@motion-canvas/core/lib/utils"
import { ranbowSignal } from "../effects"
import { BEAT } from "../timings"
import { DEFAULT, SignalValue, SimpleSignal, createSignal } from "@motion-canvas/core/lib/signals"
import { PossibleCanvasStyle } from "@motion-canvas/2d/lib/partials"
import { random, setRandomSeed } from "../utils"
import {
  easeInCubic,
  easeInOutBack,
  easeInOutCubic,
  easeInOutQuad,
  easeOutBack,
  easeOutCubic,
  easeOutElastic,
  easeOutQuad,
  linear,
} from "@motion-canvas/core/lib/tweening"
import { vector2Signal } from "@motion-canvas/2d/lib/decorators"
import { slideTransition } from "@motion-canvas/core/lib/transitions"

export const groundY = 270

export function CityMap({
  xOffset,
  color,
}: {
  xOffset: SimpleSignal<number>
  color: SignalValue<PossibleCanvasStyle>
}) {
  let min = 50
  let max = 280
  // generate an array of 20 random integers ranged from min to max
  setRandomSeed(1123)
  let randomHeights = Array.from({ length: 20 }, () => Math.floor(random() * (max - min + 1)) + min)

  let minDistances = 6
  let maxDistances = 10

  let randomDistances = Array.from(
    { length: 20 },
    () => Math.floor(random() * (maxDistances - minDistances + 1)) + minDistances
  )

  let blockWidth = (1920 * 2) / randomHeights.length
  return (
    <>
      {randomHeights.map((value, index) => {
        let scale = randomDistances[index] / 10
        let x = createSignal(
          () => index * blockWidth - 1920 / 2 - (xOffset() - 1920 / 2) * (scale + 1)
        )
        return (
          <Rect
            x={x}
            y={groundY}
            width={blockWidth}
            height={value}
            offset={[-1, 1]}
            fill={color}
            scale={[scale, scale]}
            opacity={0.5}
          ></Rect>
        )
      })}
      <Rect width={1920} height={1080} y={groundY} offset={[0, -1]} fill={color}></Rect>
    </>
  )
}

export const Gray = "#3f3f46"
export const LightGray = "#9ca3af"
export const BGGray = "#18181b"
export const Whitish = "#f4f4f5"

export default makeScene2D(function* (view) {
  let camera = createRef<Node>()
  let circle = createRef<Circle>()
  let crowd: Circle[] = []

  // generate an array of random positions from 0 to 1920
  setRandomSeed(1111)
  let randomXs = Array.from({ length: 20 }, () => Math.floor(random() * 2200))

  // generate an array of random targets from 50 to 200, with 50% being -50 to -200
  let randomMovements = Array.from(
    { length: 20 },
    () => Math.floor(random() * 200) + 50 * (random() > 0.5 ? -1 : 1)
  )

  const rainBowColor = Color.createSignal("#e13238")

  let textSOS = createRef<Txt>()

  view.add(
    <Node ref={camera} y={0} scale={0.9}>
      <Rect width={"200%"} height={1080} y={groundY} offset={[0, -1]} fill={Gray}></Rect>
      {randomXs.map((value, index) => {
        return (
          <Circle
            size={150}
            fill={rainBowColor}
            x={value - 2200 / 2}
            y={groundY}
            offsetY={1}
            opacity={0.8}
            ref={makeRef(crowd, index)}
          ></Circle>
        )
      })}
      <Circle
        size={150}
        fill={Whitish}
        x={0}
        y={groundY}
        offsetY={1}
        opacity={1}
        ref={circle}
      ></Circle>
      <Txt
        ref={textSOS}
        text={"SOS"}
        fill={Whitish}
        fontWeight={600}
        fontSize={640}
        x={0}
        y={-200}
      />
    </Node>
  )

  textSOS().opacity(0)

  circle().position.x(-400)

  yield* any(
    waitFor(0),
    loop(100, () => ranbowSignal(rainBowColor, BEAT * 2))
  )

  yield* all(
    ...crowd.map((circle, index) => {
      return circle.position.x(circle.position.x() + randomMovements[index] * 4, BEAT * 16, linear)
    }),
    chain(waitFor(BEAT * 8), all(...crowd.map((circle, index) => circle.opacity(0, BEAT * 4)))),
    chain(
      circle()
        .position.x(-400, 0)
        .to(0, BEAT * 14, easeOutCubic),
      circle()
        .position.x(0, 0)
        .to(-100, BEAT / 2),
      waitFor(BEAT / 2),
      circle()
        .position.x(-100, 0)
        .to(100, BEAT / 2),
      waitFor(BEAT / 2),
      circle()
        .position.x(100, 0)
        .to(0, BEAT / 2)
    ),
    chain(waitFor(BEAT * 16), textSOS().opacity(1, BEAT / 2)),
    chain(waitFor(BEAT * 20), textSOS().opacity(0, BEAT / 2)),
    chain(
      waitFor(BEAT * 20),
      loop(8, (index) =>
        circle()
          .position.y(groundY, 0)
          .to(groundY - 100 * (1 - (index) / 8), BEAT / 2, easeOutCubic)
          .to(groundY, BEAT / 2, easeInCubic)
      )
    ),
    chain(waitFor(BEAT * 24), circle().opacity(0, BEAT * 5))
  )

  // yield* slideTransition(Direction.Right, BEAT / 2)

  yield* waitFor(BEAT * (32 - 28.5))
})
