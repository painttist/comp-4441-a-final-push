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
import { all, any, chain, waitFor } from "@motion-canvas/core/lib/flow"
import { BEAT } from "../timings"
import { Direction } from "@motion-canvas/core/lib/types"
import { slideTransition } from "@motion-canvas/core/lib/transitions"
import { createRef, makeRef, range } from "@motion-canvas/core/lib/utils"
import { Gray, LightGray, Whitish } from "./opening"
import { TimingFunction, easeInOutBack, easeInOutCubic } from "@motion-canvas/core/lib/tweening"

class PolygonMorph extends Polygon {
  public constructor(props: PolygonProps) {
    super({ ...props })
  }

  public *morphSides(sides: number, duration: number) {
    yield* this.sides(6, duration).to(5, duration).to(4, duration).to(5, duration)
  }
}

const polygons: PolygonMorph[] = []

let circleMain = createRef<Circle>()

export default makeScene2D(function* (view) {
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
      <Circle ref={circleMain} size={90} fill={Whitish}></Circle>
    </Node>
  )

  yield polygons[22].opacity(0, 0)

  circleMain().position(polygons[22].position)

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

  yield* any(
    ...polygons.map((polygon) => polygon.morphSides(6, BEAT * 2)),
    chain(
      slideCircleToPos(22, 23),
      slideCircleToPos(23, 33),
      slideCircleToPos(33, 34, BEAT * 2, easeInOutCubic),
      slideCircleToPos(34, 33, BEAT * 2, easeInOutCubic)
    ),
    circleMain().fill(LightGray, BEAT * 7.5)
  )
})
