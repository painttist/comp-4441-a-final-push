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
import { Color, Direction } from "@motion-canvas/core/lib/types"
import { slideTransition } from "@motion-canvas/core/lib/transitions"
import { createRef, finishScene, makeRef, range } from "@motion-canvas/core/lib/utils"
import { BGGray, Gray, LightGray, Whitish } from "./opening"
import {
  easeInBounce,
  easeInCubic,
  easeInOutBack,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  linear,
} from "@motion-canvas/core/lib/tweening"
import { ranbowSignal } from "../effects"

// class PolygonMorph extends Polygon {
//   public constructor(props: PolygonProps) {
//     super({ ...props })
//   }

//   public *morphSides(sides: number, duration: number) {
//     yield* this.sides(6, duration).to(5, duration).to(4, duration).to(5, duration)
//   }
// }

const rects: Rect[] = []

let circleMain = createRef<Circle>()

export default makeScene2D(function* (view) {
  const rainBowColor = Color.createSignal("#e13238")

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
      <Circle ref={circleMain} size={200} offset={[-1, 1]} fill={rainBowColor}></Circle>
    </Node>
  )

  circleMain().position.x(1920 / 2)
  circleMain().position.y(270 / 2)

  yield* all(
    // rects[5].opacity(0, 0),
    slideTransition(Direction.Top, BEAT / 2)
  )

  yield* any(
    waitFor(0),
    loop(100, () => ranbowSignal(rainBowColor, BEAT * 2))
  )

  yield* any(
    waitFor(BEAT * 15.5),
    ...rects.map((rect) =>
      chain(
        rect.rotation(0, 0).to(90, BEAT * 1.5),
        rect.offset([1, -1], BEAT / 2),
        rect.rotation(90, 0).to(180, BEAT * 1.5),
        rect.offset([-1, -1], BEAT / 2),
        rect.rotation(180, 0).to(270, BEAT * 1.5),
        rect.offset([-1, 1], BEAT / 2),
        rect.rotation(270, 0).to(360, BEAT * 1.5),
        rect.offset([1, 1], BEAT / 2),

        rect.rotation(0, 0).to(90, BEAT * 1.5),
        rect.offset([1, -1], BEAT / 2),
        rect.rotation(90, 0).to(180, BEAT * 1.5),
        rect.offset([-1, -1], BEAT / 2),
        rect.rotation(180, 0).to(270, BEAT * 1.5),
        rect.offset([-1, 1], BEAT / 2),
        rect.rotation(270, 0).to(360, BEAT * 1.5),
        rect.offset([1, 1], BEAT / 2)
      )
    ),
    chain(
      waitFor(BEAT * 4),
      all(
        circleMain()
          .position.x(1920 / 2, 0)
          .to(-1920 / 2, BEAT * 12, linear),
        loop(8, () =>
          circleMain()
            .position.y(270 / 2, 0)
            .to(270 / 2 - 270, BEAT, easeOutCubic)
            .to(270 / 2, BEAT, easeInCubic)
        )
      )
    )
  )

  // yield* waitFor(BEAT * 8)
})
