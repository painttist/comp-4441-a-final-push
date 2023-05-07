import { makeScene2D } from "@motion-canvas/2d"
import { Circle, Icon, Node, Rect } from "@motion-canvas/2d/lib/components"
import { all, any, chain, loop, waitFor } from "@motion-canvas/core/lib/flow"
import { Color, ColorSignal, Vector2 } from "@motion-canvas/core/lib/types"
import { createRef } from "@motion-canvas/core/lib/utils"
import { ranbowSignal } from "../effects"
import { BEAT } from "../timings"
import { SignalValue, SimpleSignal, createSignal } from "@motion-canvas/core/lib/signals"
import { PossibleCanvasStyle } from "@motion-canvas/2d/lib/partials"
import { random, setRandomSeed } from "../utils"
import { easeInCubic, easeOutCubic, linear } from "@motion-canvas/core/lib/tweening"
import { BGGray, CityMap, Gray, Whitish, groundY } from "./opening"

export default makeScene2D(function* (view) {
  let camera = createRef<Node>()

  let heartRef = createRef<Icon>()
  let heartBrokenRef = createRef<Icon>()

  let curtainRef = createRef<Rect>()

  let groundRef = createRef<Rect>()

  const rainBowColor = Color.createSignal("#e13238")

  let cloud = createRef<Node>()

  view.add(
    <Node ref={camera}>
      <Rect y={0} ref={curtainRef} fill={Gray} width={"100%"} height={"100%"} opacity={1}></Rect>
      <Icon
        ref={heartRef}
        width={200}
        height={200}
        x={0}
        y={0}
        scale={3}
        color={BGGray}
        icon={"material-symbols:favorite"}
      ></Icon>
      <Icon
        ref={heartBrokenRef}
        width={200}
        height={200}
        x={0}
        y={-10}
        scale={3}
        color={Gray}
        icon={"material-symbols:heart-broken"}
      ></Icon>

      <Node ref={cloud} scale={1.5} x={800}>
        <Rect width={220} height={160} fill={Whitish} opacity={0.8} x={0} y={-100}></Rect>
        <Rect width={230} height={120} fill={Whitish} opacity={0.2} x={-90} y={-20}></Rect>
        <Rect width={150} height={145} fill={Whitish} opacity={0.6} x={70} y={-20}></Rect>
      </Node>

      <Rect y={270} ref={groundRef} fill={Gray} width={"200%"} height={"100%"} offsetY={-1}></Rect>
    </Node>
  )

  cloud().position.y(1080)

  yield* any(
    waitFor(0),
    loop(100, () => ranbowSignal(rainBowColor, BEAT * 2))
  )

  heartBrokenRef().opacity(0).rotation(24)
  groundRef().position.y(1080 / 2 + 10)

  yield* all(
    heartRef()
      .position.y(-800, 0)
      .to(-100, BEAT / 2)
      .to(0, BEAT * 15.5, linear),
    heartRef().rotation(24, BEAT * 16, easeInCubic),

    chain(
      waitFor(BEAT * 2),
      cloud().scale([-1, 1], 0),
      cloud().position.x(-800, 0),
      cloud().position.y(-1080, BEAT * 3, linear)
    ),
    chain(
      waitFor(BEAT * 8),
      cloud().scale([1.5, 1.5], 0),
      cloud().position.x(800, 0),
      cloud()
        .position.y(1080, 0)
        .to(-1080, BEAT * 2, linear)
    )
  )

  yield* all(
    curtainRef()
      .position.y(0, 0)
      .to(-1080, BEAT / 2).to(-2000, 0),
    heartRef().opacity(0, BEAT / 2),
    heartBrokenRef().opacity(1, BEAT / 2)
  )

  yield* all(
    heartBrokenRef()
      .position.y(-10, 0)
      .to(100, BEAT * 15.0, linear)
      .to(-200, BEAT * 0.5, linear),
    heartBrokenRef().rotation(48, BEAT * 15.0, easeOutCubic).to(186, BEAT * 0.5, linear),
    chain(waitFor(BEAT * 14.5), groundRef().position.y(270, BEAT * 0.5, easeInCubic)),
    // chain(waitFor(BEAT * 15.0), all(heartBrokenRef().color(BGGray, 0)))
    chain(waitFor(BEAT * 15.0), camera().scale(0.9, BEAT * 0.25))
  )

  // yield* waitFor(BEAT * 32)
})
