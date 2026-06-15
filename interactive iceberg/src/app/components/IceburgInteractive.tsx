import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import svgPaths from "../../imports/IceburgGraphicDraft/svg-vahx66p5cf";

// ── Constants ──────────────────────────────────────────────────────────────────
const SVG_W = 783.572;
const SVG_H = 1100.08;
const RENDER_W = 420;
const RENDER_H = (RENDER_W / SVG_W) * SVG_H; // ≈ 590
const SCALE = RENDER_W / SVG_W;              // ≈ 0.5360

const CHIP_W = 106;
const CHIP_H = 30;
const CARD_X = RENDER_W + 68;               // x where cards begin
const CARD_W = 288;
const CARD_H = 158;

// ── Section definitions ────────────────────────────────────────────────────────
interface Section {
  id: string;
  label: string;
  paths: (keyof typeof svgPaths)[];
  fill: string;
  hoverFill: string;
  /** Centre in SVG coordinate space */
  svgCenter: { x: number; y: number };
  description: string;
}

const SECTIONS: Section[] = [
  {
    id: "scaleUp",
    label: "Scale-Up",
    paths: ["p2f172680"],
    fill: "#E84E2C",
    hoverFill: "#FF6B4A",
    svgCenter: { x: 500, y: 75 },
    description:
      "Scale-Up is the visible tip of the iceberg — where proven innovations reach full organizational deployment. Success here requires committed leadership, operational integration, and continuous performance measurement.",
  },
  {
    id: "pilot",
    label: "Pilot",
    paths: ["pb0e8c00", "p2cdc2b00", "p10363300"],
    fill: "#EFA842",
    hoverFill: "#FFC04D",
    svgCenter: { x: 490, y: 222 },
    description:
      "Piloting tests the most promising solutions under real-world conditions with real users. This phase closes the gap between prototype theory and operational reality, surfacing what must be refined before a full commitment.",
  },
  {
    id: "incubate",
    label: "Incubate",
    paths: ["p170aaff0"],
    fill: "#FAC773",
    hoverFill: "#FFD894",
    svgCenter: { x: 395, y: 354 },
    description:
      "Incubation gives dedicated teams the time, space, and resources to develop selected concepts into working solutions. Rapid iteration against real user feedback separates what works from what only sounds good.",
  },
  {
    id: "converge",
    label: "Converge",
    paths: ["pf02200"],
    fill: "#BFD5E2",
    hoverFill: "#D8EAF3",
    svgCenter: { x: 383, y: 488 },
    description:
      "Convergence transitions from broad exploration to focused action. Structured criteria, stakeholder input, and evidence from earlier research help select the concepts most worth investing in and developing further.",
  },
  {
    id: "explore",
    label: "Explore",
    paths: ["p21139780"],
    fill: "#277696",
    hoverFill: "#309AB8",
    svgCenter: { x: 354, y: 670 },
    description:
      "Exploration maps the real landscape — customer pain points, technology shifts, and adjacent market opportunities. Deep qualitative and quantitative research at this stage fuels every decision that follows above it.",
  },
  {
    id: "prepare",
    label: "Prepare",
    paths: ["p4f53f00"],
    fill: "#103753",
    hoverFill: "#1A5070",
    svgCenter: { x: 452, y: 855 },
    description:
      "Preparation builds the organizational foundation required to innovate consistently. This means aligning leadership around challenge spaces, assembling cross-functional teams, and creating conditions for psychological safety.",
  },
  {
    id: "ideate",
    label: "Ideate",
    paths: ["p26e57500"],
    fill: "#446D3D",
    hoverFill: "#5A8F51",
    svgCenter: { x: 474, y: 988 },
    description:
      "Ideation generates the raw material for innovation — a wide, unconstrained set of possibilities. Quantity and diversity of thinking matter most here; evaluation and narrowing come later. Great ideas rarely appear first.",
  },
];

type SectionId = string;

// ── Helpers ────────────────────────────────────────────────────────────────────
function chipScreenPos(s: Section) {
  return { x: s.svgCenter.x * SCALE, y: s.svgCenter.y * SCALE };
}

function cardY(s: Section) {
  const cy = chipScreenPos(s).y;
  return Math.max(8, Math.min(RENDER_H - CARD_H - 8, cy - CARD_H / 2));
}

function connectorPath(s: Section) {
  const { x, y } = chipScreenPos(s);
  const x0 = x + CHIP_W / 2 + 4;
  const y0 = y;
  const x1 = CARD_X;
  const y1 = cardY(s) + CARD_H / 2;
  const mx = (x0 + x1) / 2;
  return `M ${x0} ${y0} C ${mx} ${y0} ${mx} ${y1} ${x1} ${y1}`;
}

// ── Component ──────────────────────────────────────────────────────────────────
export function IceburgInteractive() {
  const [hovered, setHovered] = useState<SectionId | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const enter = useCallback((id: SectionId) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setHovered(id);
  }, []);

  const leave = useCallback(() => {
    leaveTimer.current = setTimeout(() => setHovered(null), 140);
  }, []);

  const active = SECTIONS.find((s) => s.id === hovered) ?? null;

  const totalW = CARD_X + CARD_W + 8;

  return (
    <div
      className="relative select-none"
      style={{ width: totalW, height: RENDER_H, flexShrink: 0 }}
    >
      {/* ── Iceberg SVG ────────────────────────────────────────── */}
      <svg
        width={RENDER_W}
        height={RENDER_H}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="absolute left-0 top-0"
        style={{ overflow: "visible" }}
      >
        {/* Black structural shapes */}
        <path d={svgPaths.p1f4efdf2} fill="black" style={{ pointerEvents: "none" }} />
        <path d={svgPaths.p3a1e5300} fill="black" style={{ pointerEvents: "none" }} />

        {/* Colored section bands */}
        {SECTIONS.map((s) => {
          const isHot = hovered === s.id;
          const isDim = hovered !== null && !isHot;
          return (
            <g
              key={s.id}
              onMouseEnter={() => enter(s.id)}
              onMouseLeave={leave}
              style={{ cursor: "pointer" }}
            >
              {s.paths.map((p) => (
                <path
                  key={p}
                  d={svgPaths[p]}
                  fill={isHot ? s.hoverFill : s.fill}
                  style={{
                    opacity: isDim ? 0.38 : 1,
                    filter: isHot
                      ? `brightness(1.12) drop-shadow(0 0 14px ${s.fill}88)`
                      : "none",
                    transition:
                      "opacity 250ms ease-out, fill 200ms ease-out, filter 250ms ease-out",
                  }}
                />
              ))}
            </g>
          );
        })}

        {/* Waterline */}
        <line
          x1="8"
          y1="409.931"
          x2="775"
          y2="409.931"
          stroke="white"
          strokeWidth="11"
          strokeLinecap="round"
          opacity="0.88"
          style={{ pointerEvents: "none" }}
        />

        {/* Waterline label */}
        <text
          x="778"
          y="415"
          fill="rgba(255,255,255,0.55)"
          fontSize="22"
          fontFamily="Inter, sans-serif"
          fontWeight="600"
          style={{ pointerEvents: "none" }}
        >
          waterline
        </text>

        {/* Outline */}
        <path
          d={svgPaths.p312c1920}
          stroke="black"
          strokeWidth="3.52477"
          fill="none"
          style={{ pointerEvents: "none" }}
        />
      </svg>

      {/* ── Label chips ────────────────────────────────────────── */}
      {SECTIONS.map((s) => {
        const { x, y } = chipScreenPos(s);
        const isHot = hovered === s.id;
        const isDim = hovered !== null && !isHot;
        return (
          <div
            key={s.id}
            onMouseEnter={() => enter(s.id)}
            onMouseLeave={leave}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: CHIP_W,
              height: CHIP_H,
              transform: "translate(-50%, -50%)",
              zIndex: 10,
              opacity: isDim ? 0.38 : 1,
              transition: "opacity 250ms ease-out",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.68)",
                border: `1px solid ${isHot ? s.fill : "rgba(255,255,255,0.65)"}`,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: 12.5,
                color: "white",
                letterSpacing: "0.03em",
                whiteSpace: "nowrap",
                transition: "border-color 200ms ease-out",
              }}
            >
              {s.label}
            </div>
          </div>
        );
      })}

      {/* ── Connector + card ───────────────────────────────────── */}
      <AnimatePresence>
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 20,
            }}
          >
            {/* Bezier connector */}
            <svg
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                overflow: "visible",
              }}
            >
              <motion.path
                d={connectorPath(active)}
                stroke={active.fill}
                strokeWidth={1.6}
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.75 }}
                exit={{ pathLength: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              />
              {/* Dot at card end */}
              <motion.circle
                cx={CARD_X}
                cy={cardY(active) + CARD_H / 2}
                r={3.5}
                fill={active.fill}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.9 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut", delay: 0.18 }}
              />
            </svg>

            {/* Description card */}
            <motion.div
              onMouseEnter={() => enter(active.id)}
              onMouseLeave={leave}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.25, ease: "easeOut", delay: 0.06 }}
              style={{
                position: "absolute",
                left: CARD_X + 4,
                top: cardY(active),
                width: CARD_W,
                pointerEvents: "all",
                background: "rgba(8, 12, 18, 0.94)",
                borderLeft: `3px solid ${active.fill}`,
                borderRadius: "0 8px 8px 0",
                padding: "14px 18px 16px",
                boxShadow: `0 4px 28px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06), 0 0 20px ${active.fill}18`,
              }}
            >
              <p
                style={{
                  margin: "0 0 8px",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: active.fill,
                  letterSpacing: "0.02em",
                  borderBottom: `1px solid ${active.fill}44`,
                  paddingBottom: 8,
                }}
              >
                {active.label}
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                {active.description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
