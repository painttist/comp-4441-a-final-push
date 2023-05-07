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
import { fadeTransition, slideTransition } from "@motion-canvas/core/lib/transitions"
import { createRef, makeRef, range } from "@motion-canvas/core/lib/utils"
import { BGGray, Gray, LightGray, Whitish } from "./opening"
import {
  easeInBounce,
  easeInCubic,
  easeInOutBack,
  easeInOutCubic,
  easeOutBack,
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

const layers: Rect[] = []

let circleMain = createRef<Circle>()

export default makeScene2D(function* (view) {
  const rainBowColor = Color.createSignal("#e13238")

  yield* any(
    waitFor(0),
    loop(100, () => ranbowSignal(rainBowColor, BEAT * 2))
  )

  view.add(
    <Node>
      <Rect fill={Gray} width={"100%"} height={"100%"}></Rect>
      <Rect layout gap={50} y={-270} ref={makeRef(layers, 0)}>
        {range(10).map((index) => (
          <Circle
            width={200}
            height={200}
            x={(index - 1) * (120 + 200) - 1920 / 2}
            fill={rainBowColor}
            offset={[1, 1]}
            // ref={makeRef(rects, index)}
          />
        ))}
      </Rect>
      <Rect layout gap={50} y={0} ref={makeRef(layers, 1)} alignItems={'center'}>
        {range(10).map((index) => (
          <Circle
            width={200}
            height={200}
            x={(index - 1) * (120 + 200) - 1920 / 2}
            fill={rainBowColor}
            offset={[1, 1]}
            ref={makeRef(rects, index)}
          />
        ))}
      </Rect>
      <Rect layout gap={50} y={270} ref={makeRef(layers, 2)}>
        {range(10).map((index) => (
          <Circle
            width={200}
            height={200}
            x={(index - 1) * (120 + 200) - 1920 / 2}
            fill={rainBowColor}
            offset={[1, 1]}
            // ref={makeRef(rects, index)}
          />
        ))}
      </Rect>
    </Node>
  )

  rects[6].fill(BGGray)

  yield* fadeTransition(BEAT / 2)

  yield* any(
    waitFor(BEAT * 7.5),
    loop(4, () =>
      chain(
        rects[6]
          .size(200, 0)
          .to(180, BEAT * 2)
          .to(200, BEAT * 2)
      )
    ),
    ...layers.map((layer) => {
      return loop(4, () =>
        chain(
          layer.position
            .x(0, 0)
            .to(-200, BEAT * 2)
            .to(0, BEAT * 2)
        )
      )
    })
  )
})
