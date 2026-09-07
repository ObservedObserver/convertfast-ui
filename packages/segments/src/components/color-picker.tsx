"use client"

import * as React from "react"
import { HexAlphaColorPicker, HexColorPicker } from "react-colorful"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const DEFAULT_COLOR = "#7C3AED"
const DEFAULT_PRESETS = ["#EF4444", "#F97316", "#EAB308", "#22C55E", "#06B6D4", "#3B82F6", "#8B5CF6", "#EC4899"]

function normalizeHexColor(value: string, showAlpha: boolean) {
  const hex = value.trim().replace(/^#/, "")
  const expanded = hex.length === 3 || hex.length === 4
    ? hex.split("").map((character) => character + character).join("")
    : hex

  if (!/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(expanded)) return null
  const normalized = expanded.toUpperCase()
  return `#${showAlpha ? normalized.padEnd(8, "F") : normalized.slice(0, 6)}`
}

export interface ColorPickerProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  presets?: string[]
  showAlpha?: boolean
  disabled?: boolean
  name?: string
  className?: string
  "aria-label"?: string
}

export function ColorPicker({
  value,
  defaultValue = DEFAULT_COLOR,
  onValueChange,
  presets = DEFAULT_PRESETS,
  showAlpha = false,
  disabled = false,
  name,
  className,
  "aria-label": ariaLabel = "Choose a color",
}: ColorPickerProps) {
  const fallback = normalizeHexColor(defaultValue, showAlpha) ?? normalizeHexColor(DEFAULT_COLOR, showAlpha)!
  const controlledColor = value === undefined ? undefined : normalizeHexColor(value, showAlpha) ?? fallback
  const [uncontrolledColor, setUncontrolledColor] = React.useState(fallback)
  const color = controlledColor ?? uncontrolledColor
  const [draft, setDraft] = React.useState(color)
  const inputId = React.useId()

  React.useEffect(() => setDraft(color), [color])

  function updateColor(nextColor: string) {
    const normalized = normalizeHexColor(nextColor, showAlpha)
    if (!normalized) return
    if (value === undefined) setUncontrolledColor(normalized)
    setDraft(normalized)
    onValueChange?.(normalized)
  }

  function commitDraft() {
    const normalized = normalizeHexColor(draft, showAlpha)
    if (normalized) updateColor(normalized)
    else setDraft(color)
  }

  return (
    <div className={cn("inline-flex", className)}>
      {name ? <input type="hidden" name={name} value={color} disabled={disabled} /> : null}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-[152px] justify-start gap-2 px-3 font-mono font-normal"
            disabled={disabled}
            aria-label={`${ariaLabel}: ${color}`}
          >
            <span
              className="h-4 w-4 shrink-0 rounded-sm border border-black/10 shadow-sm"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
            <span>{color}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 space-y-3 p-3" align="start">
          {showAlpha ? (
            <HexAlphaColorPicker color={color} onChange={updateColor} style={{ width: "100%", height: 180 }} />
          ) : (
            <HexColorPicker color={color} onChange={updateColor} style={{ width: "100%", height: 180 }} />
          )}

          <div className="flex items-center gap-2">
            <span
              className="h-8 w-8 shrink-0 rounded-md border border-black/10 shadow-sm"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
            <label className="sr-only" htmlFor={inputId}>Hex color</label>
            <input
              id={inputId}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onBlur={commitDraft}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  commitDraft()
                }
                if (event.key === "Escape") setDraft(color)
              }}
              spellCheck={false}
              maxLength={showAlpha ? 9 : 7}
              className="h-8 min-w-0 flex-1 rounded-md border border-input bg-background px-2 font-mono text-sm uppercase shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          {presets.length > 0 ? (
            <div className="grid grid-cols-8 gap-1.5" aria-label="Color presets">
              {presets.map((preset, index) => {
                const normalized = normalizeHexColor(preset, showAlpha)
                if (!normalized) return null
                return (
                  <button
                    type="button"
                    key={`${normalized}-${index}`}
                    className="h-5 w-5 rounded-sm border border-black/10 shadow-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    style={{ backgroundColor: normalized }}
                    aria-label={`Use ${normalized}`}
                    aria-pressed={color === normalized}
                    onClick={() => updateColor(normalized)}
                  />
                )
              })}
            </div>
          ) : null}
        </PopoverContent>
      </Popover>
    </div>
  )
}
