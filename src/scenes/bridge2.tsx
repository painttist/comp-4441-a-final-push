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
import { Direction } from "@motion-canvas/core/lib/types"
import { slideTransition } from "@motion-canvas/core/lib/transitions"
import { createRef, finishScene, makeRef, range } from "@motion-canvas/core/lib/utils"
import { BGGray, Gray, LightGray, Whitish } from "./opening"
import {
  easeInBounce,
  easeInCubic,
  easeInOutBack,
  easeInOutCubic,
  easeOutBack,
  linear,
} from "@motion-canvas/core/lib/tweening"

const rects: Rect[] = []

let circleMain = createRef<Circle>()

export default makeScene2D(function* (view) {
  view.add(
    <Node>
      <Rect width={1920} height={810} y={270 / 2} offset={[0, 1]} fill={Gray}></Rect>
      {range(10).map((index) => (
        <Rect
          width={200}
          height={200}
          x={(index - 1) * (120 + 200) - 1920 / 2}
          y={270 / 2}
          fill={BGGray}
          offset={[1, 1]}
          ref={makeRef(rects, index)}
        />
      ))}
      <Circle ref={circleMain} size={200} offset={[1, 1]} fill={Whitish}></Circle>
    </Node>
  )

  yield* all(
    circleMain().position(rects[5].position, 0),
    rects[5].opacity(0, 0),
    slideTransition(Direction.Top, BEAT / 2)
  )

  yield* any(
    circleMain().fill(LightGray, BEAT * 7.5),
    chain(
      loop(3, () =>
        circleMain()
          .position(rects[5].position, 0)
          .to(rects[5].position().add([200, 0]), BEAT * 1.5, easeInOutCubic)
          .to(rects[5].position().add([0, 0]), BEAT / 2)
      ),
      waitFor(BEAT * 1.5),
      circleMain()
        .position(rects[5].position, 0)
        .to(rects[5].position().add([-200, 0]), BEAT / 2)
    ),
    ...rects.map((rect) =>
      chain(
        rect.rotation(0, 0).to(90, BEAT * 1.5),
        rect.offset([1, -1], BEAT / 2),
        rect.rotation(90, 0).to(180, BEAT * 1.5),
        rect.offset([-1, -1], BEAT / 2),
        rect.rotation(180, 0).to(270, BEAT * 1.5),
        rect.offset([-1, 1], BEAT / 2),
        rect.rotation(270, 0).to(360, BEAT * 1.5),
        rect.offset([1, 1], BEAT / 2)
      )
    )
  )

  // yield* waitFor(BEAT * 8)
})
