/**
 * Builds a compact human-readable summary of a treatment group's stimulation parameters.
 * Used in the Treatment Assignment flow so admins can identify protocols confidently
 * without opening the full protocol editor.
 *
 * Example output:
 *   "5 stimulations · 1.6 mA · 30 min · Slide on · Not sham · L/R variants"
 *   "3 stimulations · Mixed mA (1.0–2.0) · Mixed duration (20–35 min) · Slide varies · Includes sham · Mixed montages"
 */

const fmt = (secs) => Math.round(secs / 60) + " min"

export function buildTreatmentSignature(interventions) {
  if (!interventions || interventions.length === 0) return ""

  const stims = interventions
    .map(iv => iv.tes_stimulation ?? iv.stimulation)
    .filter(Boolean)

  if (stims.length === 0) return ""

  const params = stims.map(s => {
    const tdcs = s.tes_stimulations_tdcs_parameters?.[0]?.tdcs_parameter ?? {}
    return {
      current: tdcs.current ?? null,
      duration: tdcs.duration ?? null,
      anode: tdcs.anode ?? null,
      isSham: s.is_sham ?? false,
      isSlide: s.allow_update_electric_current ?? false,
    }
  })

  const parts = []

  // Count
  parts.push(`${stims.length} stimulation${stims.length !== 1 ? "s" : ""}`)

  // Current
  const currents = params.map(p => p.current).filter(c => c !== null)
  if (currents.length > 0) {
    const min = Math.min(...currents)
    const max = Math.max(...currents)
    parts.push(min === max ? `${min} mA` : `Mixed mA (${min}–${max})`)
  }

  // Duration
  const durations = params.map(p => p.duration).filter(d => d !== null)
  if (durations.length > 0) {
    const minD = Math.min(...durations)
    const maxD = Math.max(...durations)
    parts.push(minD === maxD ? fmt(minD) : `Mixed duration (${fmt(minD)}–${fmt(maxD)})`)
  }

  // Slide
  const slideOn = params.filter(p => p.isSlide).length
  if (slideOn === 0) parts.push("Slide off")
  else if (slideOn === params.length) parts.push("Slide on")
  else parts.push("Slide varies")

  // Sham
  const shamCount = params.filter(p => p.isSham).length
  parts.push(shamCount > 0 ? "Includes sham" : "Not sham")

  // Montage / anode variety
  const anodes = [...new Set(params.map(p => p.anode).filter(Boolean))]
  if (anodes.length === 0) {
    // no anode info
  } else if (anodes.length === 1) {
    const label = { L: "L montage", R: "R montage", B: "Back montage" }[anodes[0]] ?? anodes[0]
    parts.push(label)
  } else if (anodes.length === 2 && anodes.includes("L") && anodes.includes("R")) {
    parts.push("L/R variants")
  } else {
    parts.push("Mixed montages")
  }

  return parts.join(" · ")
}
