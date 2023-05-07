import { makeScene2D } from "@motion-canvas/2d"
import {
  Txt,
  Node,
  Rect,
  Polygon,
  PolygonProps,
  Layout,
  Circle,
} from "@motion-canvas/2d/lib/components"
import { all, any, chain, loop, waitFor } from "@motion-canvas/core/lib/flow"
import { BEAT } from "../timings"
import { Color, Direction, Vector2 } from "@motion-canvas/core/lib/types"
import { slideTransition } from "@motion-canvas/core/lib/transitions"
import { createRef, makeRef, range } from "@motion-canvas/core/lib/utils"
import { Gray, LightGray, Whitish } from "./opening"
import { TimingFunction, easeInOutBack, easeInOutCubic } from "@motion-canvas/core/lib/tweening"
import { ranbowSignal } from "../effects"

class PolygonMorph extends Polygon {
  public constructor(props: PolygonProps) {
    super({ ...props })
  }

  public *morphSides(sides: number, duration: number) {
    yield* this.sides(6, duration)
      .to(5, duration)
      .to(4, duration)
      .to(5, duration)
      .to(6, duration)
      .to(5, duration)
      .to(4, duration)
  }
}

const polygons: PolygonMorph[] = []

let circleMain = createRef<Circle>()

export default makeScene2D(function* (view) {
  const rainBowColor = Color.createSignal("#e13238")

  view.add(
    <Node>
      <Layout layout wrap={"wrap"} width={1200} gap={20} scale={1}>
        {range(60).map((index) => (
          <PolygonMorph
            width={100}
            height={100}
            fill={Gray}
            sides={5}
            ref={makeRef(polygons, index)}
          />
        ))}
      </Layout>
      <Circle ref={circleMain} size={90} fill={LightGray}></Circle>
    </Node>
  )

  yield* any(
    waitFor(0),
    loop(100, () => ranbowSignal(rainBowColor, BEAT * 2))
  )

  yield polygons[33].opacity(0, 0)

  circleMain().position(polygons[33].position)

  yield* slideTransition(Direction.Top, BEAT / 2)

  function slideCircleToPos(
    from: number,
    to: number,
    time: number = BEAT * 2,
    ease: TimingFunction = easeInOutBack
  ) {
    return all(
      polygons[from].opacity(1, time),
      polygons[to].opacity(0, time),
      circleMain().position(polygons[to].position, time, ease)
    )
  }

  yield* all(
    // waitFor(BEAT * 15.5),

    ...polygons.map((polygon) => polygon.morphSides(6, BEAT * 2)),
    chain(
      slideCircleToPos(33, 34, BEAT * 2, easeInOutCubic),
      slideCircleToPos(34, 33, BEAT * 2, easeInOutCubic),
      waitFor(BEAT * 3),
      all(circleMain().fill(rainBowColor, BEAT), circleMain().size(100, BEAT)),
      slideCircleToPos(33, 42, BEAT * 2, easeInOutCubic),
      slideCircleToPos(42, 51, BEAT * 2, easeInOutCubic),
      all(
        polygons[51].opacity(1, BEAT * 2),
        chain(
          circleMain().position(polygons[51].position().addY(120).addX(120), BEAT * 2, easeInOutCubic),
          circleMain().position(polygons[51].position().addY(120 * 3).addX(120 * 3), BEAT * 1.5, easeInOutCubic)
        )
      )
    )

    // circleMain().fill(LightGray, BEAT * 7.5)
  )

  // yield* waitFor(BEAT * 8)
})
