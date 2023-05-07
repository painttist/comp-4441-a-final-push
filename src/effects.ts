import { waitFor } from "@motion-canvas/core/lib/flow"
import { ColorSignal } from "@motion-canvas/core/lib/types"

export function* ranbowSignal<T>(signal: ColorSignal<T>, gap: number) {
  // let gap = BEAT * 2

  yield* signal("#e6a700", gap)
  yield* signal("#39b54a", gap)
  yield* signal("#00a1e9", gap)
  yield* signal("#9f4e9c", gap)
  yield* signal("#e13238", gap)
}