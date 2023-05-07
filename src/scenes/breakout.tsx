import { makeScene2D } from "@motion-canvas/2d"
import { Circle, Icon, Line, Node, Rect, Txt } from "@motion-canvas/2d/lib/components"
import { all, any, chain, loop, waitFor, waitUntil } from "@motion-canvas/core/lib/flow"
import { Color, ColorSignal, Direction, Vector2 } from "@motion-canvas/core/lib/types"
import { createRef } from "@motion-canvas/core/lib/utils"
import { ranbowSignal } from "../effects"
import { BEAT } from "../timings"
import { SignalValue, SimpleSignal, createSignal } from "@motion-canvas/core/lib/signals"
import { PossibleCanvasStyle } from "@motion-canvas/2d/lib/partials"
import { random, setRandomSeed } from "../utils"
import {
  easeInCubic,
  easeInOutCubic,
  easeOutBounce,
  easeOutCubic,
  easeOutElastic,
  linear,
  tween,
} from "@motion-canvas/core/lib/tweening"
import { BGGray, CityMap, Gray, Whitish, groundY } from "./opening"
import { slideTransition } from "@motion-canvas/core/lib/transitions"
import { colorSignal } from "@motion-canvas/2d/lib/decorators"

function glitchText() {
  // return a glicthed String of 5 characters of A to Z and numbers
  let text = ""
  for (let i = 0; i < 5; i++) {
    text += String.fromCharCode(Math.floor(random() * 36) + 65)
  }
  return text
}

export default makeScene2D(function* (view) {
  let camera = createRef<Node>()
  let colorMask = createRef<Circle>()
  let circleStart = createRef<Circle>()
  let circleGrey = createRef<Circle>()
  let circleRainbow = createRef<Circle>()

  let circlePos = Vector2.createSignal([0, groundY])
  let obstacleOpacity = createSignal(0)
  let obstacleCageSize = Vector2.createSignal([1080, 1080 + 32])

  let wallRight = createRef<Line>()
  let wallLeft = createRef<Line>()

  const rainBowColor = Color.createSignal("#e13238")

  const cityX = createSignal(1920)

  let iconGrabHand = createRef<Icon>()
  let iconNormalHand = createRef<Icon>()

  let curtain = createRef<Rect>()

  let textSOS = createRef<Txt>()
  let textSOSStrike = createRef<Rect>()

  view.add(
    <Node ref={camera} y={0}>
      <Node>
        <CityMap xOffset={cityX} color={rainBowColor} />;
        <Txt
          ref={textSOS}
          text={"SOS"}
          opacity={0}
          fill={Whitish}
          fontWeight={600}
          fontSize={640}
          x={0}
          y={-200}
        />
        <Rect
          fill={Whitish}
          width={1200}
          height={100}
          ref={textSOSStrike}
          // opacity={0}
          y={-250}
          x={600}
          offset={[1, 0]}
        ></Rect>
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
        <CityMap xOffset={cityX} color={Gray} />
        <Circle
          ref={circleGrey}
          opacity={0}
          size={160}
          position={circlePos}
          offset={[0, 1]}
          fill={Gray}
        />
        <Circle
          ref={circleRainbow}
          opacity={0}
          size={160}
          position={circlePos}
          offset={[0, 1]}
          fill={rainBowColor}
        />
      </Node>

      <Rect
        fill={"#71717a"}
        opacity={obstacleOpacity}
        width={480}
        height={1400}
        x={1920 / 2}
        offset={[-1, 0]}
      >
        <Txt
          text={() =>
            circlePos().x <= -263
              ? "x: " + glitchText()
              : "x: " + circlePos().x.toFixed(2).toString()
          }
          fill={() => circlePos().x <= -263 ? rainBowColor() : Whitish}
          fontWeight={600}
          fontSize={64}
          x={-200}
          textAlign={"left"}
          offset={[-1, 0]}
          y={-340}
        />
        <Rect fill={"#d1d5db"} width={400} height={20} x={0} y={-280}></Rect>
        <Rect
          fill={Whitish}
          width={() => (circlePos().x / 262 + 1) * 200}
          offsetX={-1}
          height={20}
          x={-200}
          y={-280}
        ></Rect>
        <Circle size={64} fill={BGGray} y={-280} x={() => (circlePos().x / 262) * 200}></Circle>
        <Icon
          ref={iconGrabHand}
          icon={"akar-icons:pointer-hand"}
          size={64}
          y={-280}
          offset={[-0.2, -1]}
          x={() => (circlePos().x / 262) * 200}
        ></Icon>

        <Icon
          ref={iconNormalHand}
          icon={"radix-icons:cursor-arrow"}
          size={64}
          y={-280}
          offset={[-0.25, -1]}
          x={() => (circlePos().x / 262) * 200}
        ></Icon>

        <Txt
          text={() => "y: " + circlePos().y.toFixed(2).toString()}
          fill={Whitish}
          fontWeight={600}
          fontSize={64}
          x={-200}
          textAlign={"left"}
          offset={[-1, 0]}
          y={-340 + 300}
        />
        <Rect fill={"#d1d5db"} width={400} height={20} x={0} y={-280 + 300}></Rect>
        <Rect
          fill={Whitish}
          width={() => (circlePos().y / 400 + 1) * 200}
          offsetX={-1}
          height={20}
          x={-200}
          y={-280 + 300}
        ></Rect>
        <Circle
          size={64}
          fill={BGGray}
          y={-280 + 300}
          x={() => (circlePos().y / 400) * 200}
        ></Circle>
      </Rect>

      <Rect ref={curtain} fill={BGGray} width={"200%"} height={"100%"} opacity={0}>
        {" "}
      </Rect>
    </Node>
  )

  // Init
  iconNormalHand().opacity(0)

  circleGrey().opacity(1)
  obstacleOpacity(1)
  obstacleCageSize([720, 720])
  colorMask().size(1920 * 2)

  textSOSStrike().width(0)

  yield* slideTransition(Direction.Bottom, BEAT / 2)
  yield* any(
    waitFor(0),
    loop(100, () => ranbowSignal(rainBowColor, BEAT * 2))
  )

  yield* all(
    colorMask().opacity(0.01, BEAT * 16),
    chain(
      circlePos
        .x(262, BEAT * 2)
        .to(-262, BEAT * 4)
        .to(0, BEAT * 2)
        .to(60, BEAT * 1.5)
        .to(-262, BEAT * 0.5, easeOutBounce),
      waitFor(BEAT * 0.5),
      circlePos.x(60, BEAT * 1.5, easeOutCubic).to(-262, BEAT * 0.5, easeOutBounce),
      waitFor(BEAT * 0.5),
      circlePos.x(60, BEAT * 1.5, easeOutCubic).to(-262, BEAT * 0.5, easeOutBounce),
      waitFor(BEAT * 0.5),
      circlePos.x(60, BEAT * 1.5, easeOutCubic).to(-262, BEAT * 0.5, easeOutBounce),
      waitFor(BEAT * 0.5),
      circlePos.x(0, BEAT * 2, easeOutCubic),
      iconGrabHand().opacity(0, 0),
      iconNormalHand().opacity(1, 0),
      waitFor(BEAT * 0.5),
      tween(BEAT * 2, (v) =>
        iconNormalHand().position(
          Vector2.arcLerp(iconGrabHand().position(), new Vector2(500, 700), easeInOutCubic(v))
        )
      ),
      all(circleGrey().opacity(0, BEAT * 2), circleRainbow().opacity(1, BEAT * 2))
    ),
    chain(
      waitFor(BEAT * 12),
      all(camera().scale(0.8, BEAT * 4), camera().position.x(-384 / 2, BEAT * 4))
    ),
    chain(
      waitUntil("Glitch"),
      circlePos
        .x(100, BEAT, easeOutCubic)
        .to(-360, BEAT, easeOutCubic)
        .to(-440, BEAT * 30.5, linear)
        .to(-550, BEAT * 0.5, easeOutCubic),
      waitFor(BEAT * 0.5),
      all(
        camera().scale(1, BEAT),
        camera().position([0, 0], BEAT),
        colorMask().opacity(1, BEAT),
        obstacleCageSize([0, 0], BEAT)
      ),

      all(
        loop(32, (index) =>
          chain(
            circlePos.y(groundY - 50 - index * 24, BEAT / 2, easeOutCubic),
            circlePos.y(groundY, BEAT / 2, easeInCubic)
          )
        ),

        cityX(1920 * 2, BEAT * 16, easeInOutCubic),

        chain(
          waitFor(BEAT * 16),
          textSOS().opacity(1, BEAT * 2),
          textSOSStrike().width(1200, BEAT / 2),
          waitFor(BEAT / 2),
          all(textSOS().opacity(0, BEAT / 2), textSOSStrike().width(0, BEAT / 2), textSOSStrike().position.x(-600, BEAT / 2)),
        )
      )
    ),
    chain(waitUntil("Curtain On"), curtain().opacity(1, BEAT / 2)),
    chain(waitUntil("Curtain Off"), curtain().opacity(0, BEAT / 2)),
    chain(
      waitUntil("Zoom In"),
      all(
        camera().scale(1, BEAT / 4, easeOutCubic),
        camera().position.x(0, BEAT / 4, easeOutCubic)
      ),
      all(
        camera().scale(1.2, BEAT * 26, linear),
        camera().position.x(500, BEAT * 26, easeOutCubic)
      ),
      camera().scale(1.26, 0)
    )
  )

  // yield* waitFor(BEAT * 64)
})
