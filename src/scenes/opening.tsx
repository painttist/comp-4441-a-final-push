import { makeScene2D } from "@motion-canvas/2d"
import { Circle, Line, Node, Rect } from "@motion-canvas/2d/lib/components"
import { all, any, chain, loop, waitFor } from "@motion-canvas/core/lib/flow"
import { Color, ColorSignal, Vector2 } from "@motion-canvas/core/lib/types"
import { createRef } from "@motion-canvas/core/lib/utils"
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
      <Rect width={1920*2} height={1080} y={groundY} offset={[0, -1]} fill={color}></Rect>
    </>
  )
}

export const Gray = "#3f3f46"
export const LightGray = "#9ca3af"
export const BGGray = "#18181b"
export const Whitish = "#f4f4f5"

export default makeScene2D(function* (view) {
  let camera = createRef<Node>()
  let colorMask = createRef<Circle>()
  let circleStart = createRef<Circle>()
  let circleGrey = createRef<Circle>()

  let circlePos = Vector2.createSignal([0, groundY])
  let obstacleOpacity = createSignal(0)
  let obstacleCageSize = Vector2.createSignal([1080, 1080 + 32])

  let wallRight = createRef<Line>()
  let wallLeft = createRef<Line>()

  const rainBowColor = Color.createSignal("#e13238")

  const cityX = createSignal(0)

  let cloud = createRef<Node>()

  view.add(
    <Node ref={camera} y={1080}>
      <Node>
        <CityMap xOffset={cityX} color={rainBowColor} />;
        <Circle size={160} position={circlePos} offset={[0, 1]} fill={rainBowColor} />
        <Circle
          ref={colorMask}
          size={0}
          y={groundY}
          fill={"lightseagreen"}
          compositeOperation={"destination-in"}
        />
        <Rect
          fill={"#ffffff"}
          opacity={obstacleOpacity}
          size={obstacleCageSize}
          compositeOperation={"destination-out"}
        ></Rect>
        <Rect
          stroke={"#ffffff"}
          lineWidth={32}
          opacity={obstacleOpacity}
          size={obstacleCageSize}
        ></Rect>
        <Line
          ref={wallRight}
          stroke={"#ffffff"}
          lineWidth={32}
          opacity={0}
          y={-1080 * 1.5}
          x={1080 / 2}
          points={[Vector2.zero, () => Vector2.up.scale(1080)]}
        ></Line>
        <Line
          ref={wallLeft}
          stroke={"#ffffff"}
          lineWidth={32}
          opacity={0}
          y={1080 * 1.5}
          x={-1080 / 2}
          points={[Vector2.zero, () => Vector2.up.scale(1080)]}
        ></Line>
      </Node>

      <Node compositeOperation={"destination-over"}>
        <Circle
          ref={circleGrey}
          opacity={0}
          size={160}
          position={circlePos}
          offset={[0, 1]}
          fill={Gray}
        />
        <CityMap xOffset={cityX} color={Gray} />
      </Node>

      <Circle ref={circleStart} size={160} y={-1080} offset={[0, 1]} fill={rainBowColor} />

      <Node ref={cloud} x={1400}>
        <Rect
          width={220}
          scale={[0, 0]}
          height={160}
          fill={Whitish}
          opacity={0}
          x={-700}
          y={-1180}
        ></Rect>
        <Rect
          width={230}
          scale={[0, 0]}
          height={120}
          fill={Whitish}
          opacity={0}
          x={-790}
          y={-1100}
        ></Rect>
        <Rect
          width={150}
          scale={[0, 0]}
          height={145}
          fill={Whitish}
          opacity={0}
          x={-630}
          y={-1100}
        ></Rect>
      </Node>
    </Node>
  )

  yield* any(
    waitFor(0),
    loop(100, () => ranbowSignal(rainBowColor, BEAT * 2)),

    cloud()
      .children()[0]
      .scale([1, 1], BEAT * 1.5, easeInOutQuad),
    cloud()
      .children()[1]
      .scale([1, 1], BEAT * 2, easeInOutQuad),
    cloud()
      .children()[2]
      .scale([1, 1], BEAT * 0.75, easeInOutQuad),

    cloud()
      .children()[0]
      .opacity(0.6, BEAT * 1.5, easeInOutQuad),
    cloud()
      .children()[1]
      .opacity(0.2, BEAT * 2, easeInOutQuad),
    cloud()
      .children()[2]
      .opacity(0.8, BEAT * 0.75, easeInOutQuad)
  )

  yield* circleStart()
    .size(0, 0)
    .to(160, BEAT * 2)

  let hitGroundYPrepare = 120

  yield* all(
    circleStart()
      .position.y(-1080, 0)
      .to(groundY - hitGroundYPrepare, BEAT * 2, easeInOutQuad),
    chain(
      waitFor(0.1),
      camera()
        .position.y(1080, 0)
        .to(0, BEAT * 2, easeInOutQuad)
    )
  )

  yield* all(
    circleStart()
      .position.y(groundY - hitGroundYPrepare, 0)
      .to(groundY, BEAT / 2, easeInCubic),
    chain(
      waitFor(BEAT / 4),
      colorMask()
        .size(0, 0)
        .to(1920 / 4, BEAT * 1.75),
      waitFor(BEAT * 10),
      colorMask()
        .size(1920 / 4, 0)
        .to(1920 * 2, BEAT * 12)
    ),
    cityX(0, 0).to(1920, BEAT * 24, easeInCubic)
  )

  circleStart().opacity(0)
  circleGrey().opacity(1)
  wallRight().opacity(1)
  wallLeft().opacity(1)

  yield* all(
    circlePos.x(0, 0).to(120, BEAT / 2, easeOutBack),
    wallRight()
      .position.y(-1080 * 1.5, 0)
      .to(-1080 * 0.5, BEAT / 2)
  )
  yield* waitFor(BEAT / 2)

  yield* all(
    circlePos.x(120, 0).to(-120, BEAT / 2, easeOutBack),
    wallLeft()
      .position.y(1080 * 1.5, 0)
      .to(-1080 * 0.5, BEAT / 2)
  )
  yield* waitFor(BEAT / 2)

  yield* chain(
    obstacleOpacity(0, 0).to(1, BEAT / 2),
    wallRight().opacity(0, 0),
    wallLeft().opacity(0, 0)
  )

  yield* waitFor(BEAT / 2)
  yield* any(
    circlePos.x(-120, 0).to(0, BEAT, easeOutCubic),
    obstacleCageSize([1080, 1080 + 32], 0).to([720, 720], BEAT / 2)
  )
  yield* waitFor(BEAT / 2)
})
