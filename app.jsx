const { useState, useRef, useEffect, useCallback } = React;

// ─── DATA ────────────────────────────────────────────────────────────────────
const PANELS = {
  "PBR Panel": { gauges: ["22","24","26","29"], desc: '36" coverage, 12" OC ribs, 1¼" rib height', trimCategory: "PBR", isStandingSeam: false },
  "PBU Panel": { gauges: ["24","26"], desc: '36" coverage, through-fastened', trimCategory: "PBR", isStandingSeam: false },
  "MaxPanel": { gauges: ["26","29"], desc: '36" coverage, 9" ribs, ¾" rib height', trimCategory: "Max Panel", isStandingSeam: false },
  "MaxStrong Panel": { gauges: ["26","29"], desc: "Through-fastened, classic look", trimCategory: "Max Panel", isStandingSeam: false },
  "MaxLoc100 Panel": { gauges: ["24","26"], desc: '16" coverage, 7/8" rib, concealed fastener', trimCategory: "Standing Seam", isStandingSeam: true },
  "MaxSeam175 Panel": { gauges: ["22","24"], desc: '14" coverage, 1¾" rib, hidden clip', trimCategory: "Standing Seam", isStandingSeam: true },
  "MaxSnap150 Panel": { gauges: ["22","24"], desc: "Hidden clip, snap-lock standing seam", trimCategory: "Standing Seam", isStandingSeam: true },
  "MaxMech150 Panel": { gauges: ["22","24"], desc: "Mechanical seam, concealed fasteners", trimCategory: "Standing Seam", isStandingSeam: true },
  "MaxMech200 Panel": { gauges: ["22","24"], desc: '2" mechanical seam, low-slope capable', trimCategory: "Standing Seam", isStandingSeam: true },
  "Board & Batten Panel": { gauges: ["26","29"], desc: '16" coverage, concealed fastener siding', trimCategory: "Max Panel", isStandingSeam: false },
  "5V Crimp": { gauges: ["26","29"], desc: "Traditional style, residential/agricultural", trimCategory: "Max Panel", isStandingSeam: false },
};

const SURFACE_VARIATIONS = ["Striations", "Flat Pan", "Two Bead", "Pencil Rib"];

const COLORS_BY_GAUGE = {
  "22": ["Acrylic Coated Galvalume","Charcoal Gray","Dark Bronze","Dove Gray","Mansard Brown","Matte Black","Medium Bronze","Regal White","Slate Gray"],
  "24": ["Acrylic Coated Galvalume","Ash Gray","Burgundy","Burnished Slate","Champagne","Charcoal Gray","Colonial Red","Copper","Cor-ten AZP Raw","Dark Bronze","Dove Gray","Evergreen","Hartford Green","Hemlock Green","Mansard Brown","Matte Black","Medium Bronze","Patina Green","Pre-Weathered Galvalume","Regal Blue","Regal Red","Regal White","Sandstone","Sierra Tan","Silver","Slate Blue","Slate Gray","Solar White","Stone White","Surrey Beige","Terra Cotta","TLG Black","TLG Charcoal Gray","TLG Dark Bronze","TLG Medium Bronze","TLG Moonstone","Vintage"],
  "26": ["Acrylic Coated Galvalume","Alamo White","Antique","Ash Gray","Black","Brite Red","Brilliant White","Brown","Burgundy","Burnished Slate","Charcoal","Charcoal Gray","Colonial Red","Copper Penny","Dark Bronze","Dark Gray","Dove Gray","Evergreen","Fern Green","Gallery Blue","Galvalume","Hunter Green","Light Stone","Mansard Brown","Medium Bronze","Ocean Blue","Pewter Gray","Polar White","Regal White","Rustic Red","Sandstone","Sierra Tan","Slate Gray","Tan","Taupe","Terra Cotta"],
  "29": ["Alamo White","Ash Gray","Black","Brite Red","Brilliant White","Brown","Burgundy","Burnished Slate","Charcoal","Copper Penny","Fern Green","Gallery Blue","Galvalume","Hunter Green","Light Stone","Ocean Blue","Pewter Gray","Polar White","Rustic Red","Tan","Taupe"],
};

const TRIM_BY_CATEGORY = {
  "Standing Seam": ["14Z Bar","16Z Bar","Box Rake","Cleat","Counter Flashing","End Wall","Flush Eave","Hip Cap","Offset Cleat","Pitch Change","Plumb Eave","Reglet Flashing","Side Wall","Single Slope Ridge","Square Eave","Step Rake 14","Step Rake 16","Step Ridge","Valley","Vent Retainer"],
  "PBR": ["Base Trim","Box Rake","Double Angle","End Wall","Flat Sheet","Formed Ridge Cap","Hi-Side Eave","Hi-Side Parapet","House Rake","Inside Corner","Inside Single Angle","J-Trim","Jamb Header","Jamb Trim","Long Eave Trim","Outside Corner","Outside Single Angle","Rake","Rat Guard","Short Eave","Side Wall","Skylight Trim","Tie-In","Universal Ridge","Valley","Wide Valley","Window Cap"],
  "Max Panel": ["Barn Rake","Barn Ridge","Door Edge","Door Jamb Wide","Door Post","Double Angle","End Wall","Fascia","Flat Sheet","Gable","Gutter Apron","Inside Corner","Inside Single Angle","J-Trim","Keystone","Large Corner","Lower Gambrel","Outside Single Angle","Overhead Door Jamb","OH Door Jamb w/ Drip Edge","Rat Guard","Residential Drip Edge","Residential Eave","Residential Hip Cap","Residential Rake","Residential Ridge Cap","Residential Valley","Round Track Cover","Side Wall","Small Corner","Soffit","Square Base","Square Track Cover Narrow","Upper Gambrel","Wide Ridgecap","Window Cap"],
};

// ─── TRIM IMAGE URLS (from metalmax.com/trim-ridge-vents/) ───────────────────
const CDN = "https://metalmax.com/wp-content/uploads/2026/01/";

// Standing Seam trim images — keyed by trim name
const SS_IMAGES = {
  "14Z Bar": CDN+"Standing-Seam-Trim-Spec-SS-14Z-Bar.png",
  "16Z Bar": CDN+"Standing-Seam-Trim-Spec-SS-16Z-Bar.png",
  "Box Rake": CDN+"Standing-Seam-Trim-Spec-SS-Box-Rake.png",
  "Cleat": CDN+"Standing-Seam-Trim-Spec-SS-Cleat.png",
  "Counter Flashing": CDN+"Standing-Seam-Trim-Spec-SS-Counter-Flashing.png",
  "End Wall": CDN+"Standing-Seam-Trim-Spec-SS-End-Wall.png",
  "Flush Eave": CDN+"Standing-Seam-Trim-Spec-SS-Flush-Eave.png",
  "Hip Cap": CDN+"Standing-Seam-Trim-Spec-SS-Hip-Cap.png",
  "Offset Cleat": CDN+"Standing-Seam-Trim-Spec-SS-Offset-Cleat.png",
  "Pitch Change": CDN+"Standing-Seam-Trim-Spec-SS-Pitch-Change-1.png",
  "Plumb Eave": CDN+"Standing-Seam-Trim-Spec-SS-Plumb-Eave-1.png",
  "Reglet Flashing": CDN+"Standing-Seam-Trim-Spec-SS-Reglet-Flashing-1.png",
  "Side Wall": CDN+"Standing-Seam-Trim-Spec-SS-Side-Wall-1.png",
  "Single Slope Ridge": CDN+"Standing-Seam-Trim-Spec-SS-Single-Slope-Ridge.png",
  "Square Eave": CDN+"Standing-Seam-Trim-Spec-SS-Square-Eave.png",
  "Step Rake 14": CDN+"Standing-Seam-Trim-Spec-SS-Step-Rake-14.png",
  "Step Rake 16": CDN+"Standing-Seam-Trim-Spec-SS-Step-Rake-16.png",
  "Step Ridge": CDN+"Standing-Seam-Trim-Spec-SS-Step-Ridge.png",
  "Valley": CDN+"Standing-Seam-Trim-Spec-SS-Valley.png",
  "Vent Retainer": CDN+"Standing-Seam-Trim-Spec-SS-Vent-Retainer.png",
};

// PBR trim images
const PBR_IMAGES = {
  "Base Trim": CDN+"PBR-Panel-Trim-R-Base-Trim.png",
  "Box Rake": CDN+"PBR-Panel-Trim-R-Box-Rake-Trim.png",
  "Double Angle": CDN+"PBR-Panel-Trim-R-Double-Angle.png",
  "End Wall": CDN+"PBR-Panel-Trim-R-Endwall.png",
  "Flat Sheet": CDN+"PBR-Panel-Trim-R-Flat-Sheet.png",
  "Formed Ridge Cap": CDN+"PBR-Panel-Trim-R-formed-ridge-cap.png",
  "Hi-Side Eave": CDN+"PBR-Panel-Trim-R-Hi-Side-Eave-Trim.png",
  "Hi-Side Parapet": CDN+"PBR-Panel-Trim-R-Hi-Side-Parapet-Trim.png",
  "House Rake": CDN+"PBR-Panel-Trim-R-House-Rake-Trim.png",
  "Inside Corner": CDN+"PBR-Panel-Trim-R-Inside-Corner.png",
  "Inside Single Angle": CDN+"PBR-Panel-Trim-R-Inside-Single-Angle.png",
  "J-Trim": CDN+"PBR-Panel-Trim-R-J-Trim.png",
  "Jamb Header": CDN+"PBR-Panel-Trim-R-Jamb-Header.png",
  "Jamb Trim": CDN+"PBR-Panel-Trim-R-Jamb-Trim.png",
  "Long Eave Trim": CDN+"PBR-Panel-Trim-R-Long-Eave-Trim.png",
  "Outside Corner": CDN+"PBR-Panel-Trim-R-Outside-Corner.png",
  "Outside Single Angle": CDN+"PBR-Panel-Trim-R-Outside-Single-Angle.png",
  "Rake": CDN+"PBR-Panel-Trim-R-Rake-Trim.png",
  "Rat Guard": CDN+"PBR-Panel-Trim-R-Rat-Guard.png",
  "Short Eave": CDN+"PBR-Panel-Trim-R-Short-Eave-Trim.png",
  "Side Wall": CDN+"PBR-Panel-Trim-R-Sidewall.png",
  "Skylight Trim": CDN+"PBR-Panel-Trim-R-Skylight-Trim.png",
  "Tie-In": CDN+"PBR-Panel-Trim-R-Tie-In-Trim.png",
  "Universal Ridge": CDN+"PBR-Panel-Trim-R-Universal-Ridge.png",
  "Valley": CDN+"PBR-Panel-Trim-R-Valley.png",
  "Wide Valley": CDN+"PBR-Panel-Trim-R-Wide-Valley.png",
  "Window Cap": CDN+"PBR-Panel-Trim-R-Window-Cap.png",
};

// Max Panel trim images
const MAX_IMAGES = {
  "Barn Rake": CDN+"max-panel-trim-spec-Barn-Rake-1.png",
  "Barn Ridge": CDN+"max-panel-trim-spec-Barn-Ridge.png",
  "Door Edge": CDN+"max-panel-trim-spec-Door-Edge.png",
  "Door Jamb Wide": CDN+"max-panel-trim-spec-Door-Jamb-Wide.png",
  "Door Post": CDN+"max-panel-trim-spec-Door-Post.png",
  "Double Angle": CDN+"max-panel-trim-spec-Double-Angle.png",
  "End Wall": CDN+"max-panel-trim-spec-End-Wall.png",
  "Fascia": CDN+"max-panel-trim-spec-Fascia.png",
  "Flat Sheet": CDN+"max-panel-trim-spec-Flat-Sheet.png",
  "Gable": CDN+"max-panel-trim-spec-Gable.png",
  "Gutter Apron": CDN+"max-panel-trim-spec-Gutter-Apron.png",
  "Inside Corner": CDN+"max-panel-trim-spec-Inside-Corner.png",
  "Inside Single Angle": CDN+"max-panel-trim-spec-Inside-Single-Angle.png",
  "J-Trim": CDN+"max-panel-trim-spec-J-Trim.png",
  "Keystone": CDN+"max-panel-trim-spec-Keystone.png",
  "Large Corner": CDN+"max-panel-trim-spec-large-corner.png",
  "Lower Gambrel": CDN+"max-panel-trim-spec-Lower-Gambrel.png",
  "Outside Single Angle": CDN+"max-panel-trim-spec-Outside-Single-Angle.png",
  "Overhead Door Jamb": CDN+"max-panel-trim-spec-Overhead-Door-Jamb.png",
  "OH Door Jamb w/ Drip Edge": CDN+"max-panel-trim-overhead-door-jamb-with-drip-edge.png",
  "Rat Guard": CDN+"max-panel-trim-spec-Rat-Guard.png",
  "Residential Drip Edge": CDN+"max-panel-trim-spec-Residential-Drip-Edge.png",
  "Residential Eave": CDN+"max-panel-trim-spec-Residential-Eave.png",
  "Residential Hip Cap": CDN+"max-panel-trim-spec-Residential-Hip-Cap.png",
  "Residential Rake": CDN+"max-panel-trim-spec-Residential-Rake.png",
  "Residential Ridge Cap": CDN+"max-panel-trim-spec-Residential-Ridge-Cap.png",
  "Residential Valley": CDN+"max-panel-trim-spec-Residential-Valley.png",
  "Round Track Cover": CDN+"max-panel-trim-spec-Round-Track-Cover.png",
  "Side Wall": CDN+"max-panel-trim-spec-Side-Wall.png",
  "Small Corner": CDN+"max-panel-trim-spec-small-corner.png",
  "Soffit": CDN+"max-panel-trim-spec-Soffit.png",
  "Square Base": CDN+"max-panel-trim-square-base.png",
  "Square Track Cover Narrow": CDN+"max-panel-trim-spec-Square-Track-Cover-Narrow.png",
  "Upper Gambrel": CDN+"max-panel-trim-spec-Upper-Gambrel.png",
  "Wide Ridgecap": CDN+"max-panel-trim-spec-Wide-Ridgecap.png",
  "Window Cap": CDN+"max-panel-trim-spec-Window-Cap.png",
};

const TRIM_IMAGE_MAP = { "Standing Seam": SS_IMAGES, "PBR": PBR_IMAGES, "Max Panel": MAX_IMAGES };

function getTrimImage(name, categories) {
  for (const cat of categories) {
    if (TRIM_IMAGE_MAP[cat] && TRIM_IMAGE_MAP[cat][name]) return TRIM_IMAGE_MAP[cat][name];
  }
  return null;
}

const PIPE_BOOT_SIZES = ['1"','1.5"','2"','3"','4"','6"'];
const RIVET_COLORS = ["Matching Panel Color","Matching Trim Color","Galvalume","White","Black","Brown"];

const FEET_OPTIONS = Array.from({ length: 51 }, (_, i) => i);
const INCHES_OPTIONS = Array.from({ length: 12 }, (_, i) => i);

const newPanel = (defaults = {}) => ({ id: Date.now() + Math.random(), panel: "", gauge: "", color: "", surface: "", pieceCount: 0, feet: "", inches: "", ...defaults });

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function NumberPad({ value, onChange, label }) {
  const [show, setShow] = useState(false);
  const [tempVal, setTempVal] = useState(String(value || ""));
  const handleKey = (k) => {
    if (k === "DEL") setTempVal((v) => v.slice(0, -1));
    else if (k === "OK") { onChange(parseInt(tempVal) || 0); setShow(false); }
    else setTempVal((v) => (v.length < 4 ? v + k : v));
  };
  useEffect(() => { if (show) setTempVal(String(value || "")); }, [show]);
  return (
    <div>
      <label style={styles.label}>{label}</label>
      <div style={styles.numDisplay} onClick={() => setShow(true)}>{value || 0}</div>
      {show && (
        <div style={styles.overlay} onClick={() => setShow(false)}>
          <div style={styles.numPadModal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.numPadDisplay}>{tempVal || "0"}</div>
            <div style={styles.numPadGrid}>
              {["1","2","3","4","5","6","7","8","9","DEL","0","OK"].map((k) => (
                <button key={k} onClick={() => handleKey(k)}
                  style={{ ...styles.numPadBtn, ...(k === "OK" ? styles.numPadOk : {}), ...(k === "DEL" ? styles.numPadDel : {}) }}>{k}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Picker({ label, options, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label style={styles.label}>{label}</label>
      <div style={{ ...styles.pickerBtn, ...(value ? {} : { color: "#999" }) }} onClick={() => setShow(true)}>
        {value || placeholder || "Select..."}<span style={styles.chevron}>▾</span>
      </div>
      {show && (
        <div style={styles.overlay} onClick={() => setShow(false)}>
          <div style={styles.pickerModal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.pickerTitle}>{label}</div>
            <div style={styles.pickerScroll}>
              {options.map((o) => (
                <div key={o} onClick={() => { onChange(String(o)); setShow(false); }}
                  style={{ ...styles.pickerItem, ...(String(o) === String(value) ? styles.pickerItemActive : {}) }}>{o}</div>
              ))}
            </div>
            <button style={styles.pickerClose} onClick={() => setShow(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <div style={styles.checkRow} onClick={() => onChange(!checked)}>
      <div style={{ ...styles.checkbox, ...(checked ? styles.checkboxChecked : {}) }}>{checked && "✓"}</div>
      <span style={styles.checkLabel}>{label}</span>
    </div>
  );
}

function RadioGroup({ label, options, value, onChange }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={styles.label}>{label}</label>
      <div style={styles.radioRow}>
        {options.map((o) => (
          <div key={o} style={{ ...styles.radioOption, ...(value === o ? styles.radioOptionActive : {}) }} onClick={() => onChange(o)}>
            <div style={{ ...styles.radioCircle, ...(value === o ? styles.radioCircleActive : {}) }}>
              {value === o && <div style={styles.radioDot} />}
            </div>
            <span>{o}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SketchPad({ canvasRef }) {
  const [drawing, setDrawing] = useState(false);
  const getPos = (e) => { const rect = canvasRef.current.getBoundingClientRect(); const touch = e.touches ? e.touches[0] : e; return { x: touch.clientX - rect.left, y: touch.clientY - rect.top }; };
  const start = (e) => { e.preventDefault(); setDrawing(true); const ctx = canvasRef.current.getContext("2d"); const pos = getPos(e); ctx.beginPath(); ctx.moveTo(pos.x, pos.y); };
  const draw = (e) => { e.preventDefault(); if (!drawing) return; const ctx = canvasRef.current.getContext("2d"); const pos = getPos(e); ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.strokeStyle = "#1a1a2e"; ctx.lineTo(pos.x, pos.y); ctx.stroke(); };
  const end = (e) => { e.preventDefault(); setDrawing(false); };
  const clear = () => { const ctx = canvasRef.current.getContext("2d"); ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <label style={styles.label}>Custom Trim Sketch</label>
        <button onClick={clear} style={styles.clearBtn}>Clear</button>
      </div>
      <canvas ref={canvasRef} width={340} height={220} style={styles.canvas}
        onMouseDown={start} onMouseMove={draw} onMouseUp={end} onMouseLeave={end}
        onTouchStart={start} onTouchMove={draw} onTouchEnd={end} />
      <p style={{ fontSize: 11, color: "#888", margin: "4px 0 0" }}>Draw with your finger or mouse</p>
    </div>
  );
}

function SectionHeader({ number, title, subtitle }) {
  return (
    <div style={styles.sectionHeader}>
      <div style={styles.sectionBadge}>{number}</div>
      <div><div style={styles.sectionTitle}>{title}</div>{subtitle && <div style={styles.sectionSubtitle}>{subtitle}</div>}</div>
    </div>
  );
}

// ─── PANEL ENTRY CARD ────────────────────────────────────────────────────────

function PanelEntryCard({ entry, index, total, onUpdate, onRemove }) {
  const availableGauges = entry.panel ? PANELS[entry.panel]?.gauges || [] : [];
  const availableColors = entry.gauge ? (COLORS_BY_GAUGE[entry.gauge] || []).sort() : [];
  const needsSurface = entry.panel && PANELS[entry.panel]?.isStandingSeam;

  const update = (field, value) => {
    const updated = { ...entry, [field]: value };
    if (field === "panel") { updated.gauge = ""; updated.color = ""; updated.surface = ""; }
    if (field === "gauge") { updated.color = ""; }
    onUpdate(updated);
  };

  const isComplete = entry.panel && entry.gauge && entry.color && entry.pieceCount > 0 && entry.feet !== "" && (!needsSurface || entry.surface);

  return (
    <div style={styles.panelCard}>
      <div style={styles.panelCardHeader}>
        <div style={styles.panelCardNum}>Panel {index + 1}</div>
        {isComplete && <span style={styles.panelCardCheck}>✓</span>}
        {total > 1 && <button style={styles.panelCardRemove} onClick={() => onRemove(entry.id)}>✕ Remove</button>}
      </div>
      <Picker label="Panel Type *" options={Object.keys(PANELS)} value={entry.panel} onChange={(v) => update("panel", v)} placeholder="Select panel..." />
      {entry.panel && <p style={styles.panelDesc}>{PANELS[entry.panel].desc}</p>}
      {needsSurface && (
        <Picker label="Surface Variation *" options={SURFACE_VARIATIONS} value={entry.surface} onChange={(v) => update("surface", v)} placeholder="Select surface..." />
      )}
      {entry.panel && <Picker label="Gauge *" options={availableGauges} value={entry.gauge} onChange={(v) => update("gauge", v)} placeholder="Select gauge..." />}
      {entry.gauge && <Picker label="Color *" options={availableColors} value={entry.color} onChange={(v) => update("color", v)} placeholder="Select color..." />}
      {entry.color && (
        <>
          <NumberPad label="Piece Count *" value={entry.pieceCount} onChange={(v) => update("pieceCount", v)} />
          <div style={styles.row}>
            <div style={{ flex: 1 }}><Picker label="Feet *" options={FEET_OPTIONS} value={entry.feet} onChange={(v) => update("feet", v)} placeholder="Ft" /></div>
            <div style={{ flex: 1 }}><Picker label="Inches" options={INCHES_OPTIONS} value={entry.inches} onChange={(v) => update("inches", v)} placeholder="In" /></div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

function MetalMaxOrderForm() {
  const canvasRef = useRef(null);
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);

  // Step 1: Customer Info
  const [customerName, setCustomerName] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [orderType, setOrderType] = useState("Sales Order");

  // Step 2: Panels
  const [panelEntries, setPanelEntries] = useState([newPanel()]);

  // Step 3: Trim
  const [sameColorTrim, setSameColorTrim] = useState(true);
  const [trimColor, setTrimColor] = useState("");
  const [trimItems, setTrimItems] = useState([]);

  // Step 4: Accessories
  const [closureStrips, setClosureStrips] = useState(false);
  const [screws, setScrews] = useState(false);
  const [solarSeal, setSolarSeal] = useState(false);
  const [butylTape, setButylTape] = useState(false);
  const [pipeBoots, setPipeBoots] = useState(false);
  const [pipeBootSize, setPipeBootSize] = useState("");
  const [pipeBootQty, setPipeBootQty] = useState(0);
  const [rivets, setRivets] = useState(false);
  const [rivetColor, setRivetColor] = useState("");
  const [rivetQty, setRivetQty] = useState(0);

  // Step 5: Custom Trim + Comments
  const [hasCustomTrim, setHasCustomTrim] = useState(false);
  const [comments, setComments] = useState("");

  // Derived
  const firstComplete = panelEntries.find((p) => p.panel && p.gauge && p.color);
  const allTrimCategories = [...new Set(panelEntries.filter((p) => p.panel).map((p) => PANELS[p.panel]?.trimCategory).filter(Boolean))];
  const availableTrim = allTrimCategories.reduce((acc, cat) => { (TRIM_BY_CATEGORY[cat] || []).forEach((t) => { if (!acc.includes(t)) acc.push(t); }); return acc; }, []);
  const trimGauge = firstComplete?.gauge;
  const trimColorOptions = trimGauge ? (COLORS_BY_GAUGE[trimGauge] || []).sort() : [];

  const updatePanelEntry = (updated) => setPanelEntries((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  const removePanelEntry = (id) => setPanelEntries((prev) => prev.filter((p) => p.id !== id));
  const addPanelEntry = () => {
    const last = panelEntries[panelEntries.length - 1];
    setPanelEntries((prev) => [...prev, newPanel({ panel: last?.panel || "", gauge: last?.gauge || "", color: last?.color || "", surface: last?.surface || "" })]);
  };

  const allPanelsValid = panelEntries.length > 0 && panelEntries.every((p) => {
    const needs = p.panel && PANELS[p.panel]?.isStandingSeam;
    return p.panel && p.gauge && p.color && p.pieceCount > 0 && p.feet !== "" && (!needs || p.surface);
  });

  const toggleTrim = (t) => { setTrimItems((prev) => { const ex = prev.find((i) => i.name === t); if (ex) return prev.filter((i) => i.name !== t); return [...prev, { name: t, qty: 1, feet: "", inches: "" }]; }); };
  const updateTrimItem = (name, field, value) => { setTrimItems((prev) => prev.map((i) => (i.name === name ? { ...i, [field]: value } : i))); };

  const STEPS = [
    { title: "Customer Info", valid: customerName.trim() && orderType },
    { title: "Panel Selection", valid: allPanelsValid },
    { title: "Trim Pieces", valid: true },
    { title: "Accessories", valid: true },
    { title: "Custom Trim & Notes", valid: true },
  ];

  // ─── PDF ─────────────────────────────────────────────────────────────────────
  const generatePDF = async () => {
    setGenerating(true);
    const fp = panelEntries[0];
    const trimColorDisplay = sameColorTrim ? `Same as panel (${fp?.color || "N/A"})` : trimColor;
    const trimListHTML = trimItems.length > 0
      ? trimItems.map((t) => `<tr><td style="padding:6px 10px;border-bottom:1px solid #ddd">${t.name}</td><td style="padding:6px 10px;border-bottom:1px solid #ddd;text-align:center">${t.qty}</td><td style="padding:6px 10px;border-bottom:1px solid #ddd;text-align:center">${t.feet || 0}'${t.inches ? ` ${t.inches}"` : ""}</td></tr>`).join("")
      : '<tr><td colspan="3" style="padding:10px;color:#999;text-align:center">No trim selected</td></tr>';

    const acc = [];
    if (closureStrips) acc.push("Closure Strips");
    if (screws) acc.push("Screws");
    if (solarSeal) acc.push("Solar Seal");
    if (butylTape) acc.push("Butyl Tape");
    if (pipeBoots && pipeBootSize) acc.push(`Pipe Boots: ${pipeBootSize} × ${pipeBootQty}`);
    if (rivets && rivetColor) acc.push(`Rivets: ${rivetColor} × ${rivetQty}`);

    let sketchDataUrl = "";
    if (hasCustomTrim && canvasRef.current) sketchDataUrl = canvasRef.current.toDataURL("image/png");

    const panelsHTML = panelEntries.map((p, i) => {
      const surf = PANELS[p.panel]?.isStandingSeam && p.surface ? `<br><small style="color:#666">${p.surface}</small>` : "";
      return `<tr><td style="padding:6px 10px;border-bottom:1px solid #ddd">${i+1}</td><td style="padding:6px 10px;border-bottom:1px solid #ddd">${p.panel}${surf}</td><td style="padding:6px 10px;border-bottom:1px solid #ddd;text-align:center">${p.gauge}ga</td><td style="padding:6px 10px;border-bottom:1px solid #ddd">${p.color}</td><td style="padding:6px 10px;border-bottom:1px solid #ddd;text-align:center">${p.pieceCount}</td><td style="padding:6px 10px;border-bottom:1px solid #ddd;text-align:center">${p.feet}'${p.inches?` ${p.inches}"`:""}</td></tr>`;
    }).join("");

    const headerTitle = orderType === "Quote" ? "METALMAX QUOTE" : "METALMAX SALES ORDER";
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${headerTitle} - ${customerName}</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Helvetica Neue',Arial,sans-serif;padding:30px;color:#1a1a2e;font-size:13px}.header{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #c0392b;padding-bottom:15px;margin-bottom:20px}.header h1{font-size:22px;color:#c0392b;letter-spacing:1px}.header .date{font-size:12px;color:#666}.section{margin-bottom:18px}.section-title{font-size:14px;font-weight:700;color:#c0392b;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #eee}.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px 20px}.info-row{display:flex;gap:6px}.info-label{font-weight:600;min-width:100px}table{width:100%;border-collapse:collapse}th{background:#c0392b;color:#fff;padding:8px 10px;text-align:left;font-size:12px}.acc-list{display:flex;gap:15px;flex-wrap:wrap}.acc-item{padding:5px 12px;background:#f8f8f8;border:1px solid #ddd;border-radius:4px;font-size:12px}.sketch-img{max-width:100%;border:1px solid #ccc;margin-top:8px}.comments-box{background:#f8f8f8;border:1px solid #ddd;border-radius:4px;padding:10px;white-space:pre-wrap;font-size:12px;min-height:40px}@media print{body{padding:15px}}</style></head><body>
      <div class="header"><h1>${headerTitle}</h1><div class="date">${new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}</div></div>
      <div class="section"><div class="section-title">Customer Information</div><div class="info-grid">
        <div class="info-row"><span class="info-label">Customer:</span> ${customerName}</div>
        <div class="info-row"><span class="info-label">PO #:</span> ${poNumber||"N/A"}</div>
        <div class="info-row"><span class="info-label">Contact:</span> ${customerContact||"N/A"}</div>
        <div class="info-row"><span class="info-label">Type:</span> ${orderType}</div>
      </div></div>
      <div class="section"><div class="section-title">Panel Order${panelEntries.length>1?` (${panelEntries.length} panels)`:""}</div>
        <table><thead><tr><th>#</th><th>Panel</th><th style="text-align:center">Gauge</th><th>Color</th><th style="text-align:center">Qty</th><th style="text-align:center">Length</th></tr></thead><tbody>${panelsHTML}</tbody></table></div>
      <div class="section"><div class="section-title">Trim Pieces</div>
        <div class="info-row" style="margin-bottom:8px"><span class="info-label">Trim Color:</span> ${trimColorDisplay||"N/A"}</div>
        <table><thead><tr><th>Trim Piece</th><th style="text-align:center">Qty</th><th style="text-align:center">Length</th></tr></thead><tbody>${trimListHTML}</tbody></table></div>
      <div class="section"><div class="section-title">Accessories</div>
        ${acc.length?`<div class="acc-list">${acc.map(a=>`<div class="acc-item">✓ ${a}</div>`).join("")}</div>`:'<p style="color:#999">None selected</p>'}</div>
      ${hasCustomTrim&&sketchDataUrl?`<div class="section"><div class="section-title">Custom Trim Sketch</div><img src="${sketchDataUrl}" class="sketch-img" /></div>`:""}
      ${comments.trim()?`<div class="section"><div class="section-title">Additional Notes / Measurements</div><div class="comments-box">${comments.replace(/</g,"&lt;").replace(/\n/g,"<br>")}</div></div>`:""}
    </body></html>`;
    const w = window.open("","_blank");
    if(w){w.document.write(html);w.document.close();setTimeout(()=>{w.print();setGenerating(false)},500)}
    else{alert("Please allow popups to generate the PDF.");setGenerating(false)}
  };

  const headerLabel = orderType === "Quote" ? "Quote Entry" : "Order Entry";

  return (
    <div style={styles.wrapper}>
      <div style={styles.topBar}>
        <div style={styles.logo}><span style={styles.logoM}>METAL</span><span style={styles.logoMax}>MAX</span></div>
        <div style={styles.topBarSub}>{headerLabel}</div>
      </div>

      <div style={styles.stepBar}>
        {STEPS.map((s, i) => (
          <div key={i} onClick={() => setStep(i)}
            style={{ ...styles.stepDot, ...(i === step ? styles.stepDotActive : i < step ? styles.stepDotDone : {}) }}>
            {i < step ? "✓" : i + 1}
          </div>
        ))}
      </div>
      <div style={styles.stepName}>{STEPS[step].title}</div>

      <div style={styles.content}>
        {/* ─── STEP 0: CUSTOMER INFO ─── */}
        {step === 0 && (
          <div style={styles.section}>
            <SectionHeader number="1" title="Customer Information" subtitle="Name, PO, contact & order type" />
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Customer Name *</label>
              <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} style={styles.input} placeholder="Enter customer name" />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>PO Number</label>
              <input type="text" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} style={styles.input} placeholder="Enter PO number" />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Customer Contact (Email or Phone)</label>
              <input type="text" value={customerContact} onChange={(e) => setCustomerContact(e.target.value)} style={styles.input} placeholder="email@example.com or (555) 123-4567" />
            </div>
            <div style={styles.divider} />
            <RadioGroup label="Order Type *" options={["Sales Order","Quote"]} value={orderType} onChange={setOrderType} />
          </div>
        )}

        {/* ─── STEP 1: PANEL SELECTION ─── */}
        {step === 1 && (
          <div style={styles.section}>
            <SectionHeader number="2" title="Panel Selection" subtitle={`${panelEntries.length} panel${panelEntries.length > 1 ? "s" : ""} on this order`} />
            {panelEntries.map((entry, idx) => (
              <PanelEntryCard key={entry.id} entry={entry} index={idx} total={panelEntries.length} onUpdate={updatePanelEntry} onRemove={removePanelEntry} />
            ))}
            <button style={styles.addPanelBtn} onClick={addPanelEntry}>
              <span style={styles.addPanelIcon}>+</span> Add Another Panel
            </button>
          </div>
        )}

        {/* ─── STEP 2: TRIM ─── */}
        {step === 2 && (
          <div style={styles.section}>
            <SectionHeader number="3" title="Trim Pieces" subtitle={allTrimCategories.length > 0 ? allTrimCategories.join(" + ") + " Trim" : "Select a panel first"} />
            {availableTrim.length === 0 ? (
              <p style={styles.noPanel}>Please select a panel first to see available trim.</p>
            ) : (
              <>
                <Checkbox label={`Same color as panel (${firstComplete?.color || "none"})`} checked={sameColorTrim} onChange={setSameColorTrim} />
                {!sameColorTrim && <Picker label="Trim Color" options={trimColorOptions} value={trimColor} onChange={setTrimColor} placeholder="Select trim color..." />}
                <div style={styles.divider} />
                <label style={styles.label}>Select Trim Pieces</label>
                <div style={styles.trimGrid}>
                  {availableTrim.map((t) => {
                    const selected = trimItems.find((i) => i.name === t);
                    const imgUrl = getTrimImage(t, allTrimCategories);
                    return (
                      <div key={t}>
                        <div style={{ ...styles.trimChip, ...(selected ? styles.trimChipActive : {}) }} onClick={() => toggleTrim(t)}>
                          <span style={styles.trimCheck}>{selected ? "✓" : ""}</span>
                          {imgUrl && <img src={imgUrl} alt={t} style={styles.trimThumb} onError={(e) => { e.target.style.display = "none"; }} />}
                          <span style={{ flex: 1 }}>{t}</span>
                        </div>
                        {selected && (
                          <div style={styles.trimDetail}>
                            <div style={{ flex: "0 0 60px" }}><NumberPad label="Qty" value={selected.qty} onChange={(v) => updateTrimItem(t, "qty", v)} /></div>
                            <div style={{ flex: 1 }}><Picker label="Ft" options={FEET_OPTIONS} value={selected.feet} onChange={(v) => updateTrimItem(t, "feet", v)} placeholder="Ft" /></div>
                            <div style={{ flex: 1 }}><Picker label="In" options={INCHES_OPTIONS} value={selected.inches} onChange={(v) => updateTrimItem(t, "inches", v)} placeholder="In" /></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ─── STEP 3: ACCESSORIES ─── */}
        {step === 3 && (
          <div style={styles.section}>
            <SectionHeader number="4" title="Accessories" subtitle="Select additional supplies" />
            <div style={styles.accGrid}>
              <Checkbox label="Closure Strips" checked={closureStrips} onChange={setClosureStrips} />
              <Checkbox label="Screws" checked={screws} onChange={setScrews} />
              <Checkbox label="Solar Seal" checked={solarSeal} onChange={setSolarSeal} />
              <Checkbox label="Butyl Tape" checked={butylTape} onChange={setButylTape} />
              <div style={styles.divider} />
              <Checkbox label="Pipe Boots" checked={pipeBoots} onChange={setPipeBoots} />
              {pipeBoots && (
                <div style={styles.accSubSection}>
                  <Picker label="Pipe Boot Size" options={PIPE_BOOT_SIZES} value={pipeBootSize} onChange={setPipeBootSize} placeholder="Select size..." />
                  <NumberPad label="Quantity" value={pipeBootQty} onChange={setPipeBootQty} />
                </div>
              )}
              <Checkbox label="Rivets" checked={rivets} onChange={setRivets} />
              {rivets && (
                <div style={styles.accSubSection}>
                  <Picker label="Rivet Color" options={RIVET_COLORS} value={rivetColor} onChange={setRivetColor} placeholder="Select color..." />
                  <NumberPad label="Quantity" value={rivetQty} onChange={setRivetQty} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── STEP 4: CUSTOM TRIM + COMMENTS ─── */}
        {step === 4 && (
          <div style={styles.section}>
            <SectionHeader number="5" title="Custom Trim & Notes" subtitle="Sketch and additional info" />
            <Checkbox label="I need custom trim" checked={hasCustomTrim} onChange={setHasCustomTrim} />
            {hasCustomTrim && <div style={{ marginTop: 12 }}><SketchPad canvasRef={canvasRef} /></div>}
            <div style={styles.divider} />
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Additional Notes / Measurements</label>
              <textarea value={comments} onChange={(e) => setComments(e.target.value)} style={styles.textarea}
                placeholder="Enter any extra measurements, special instructions, notes for the office..." rows={5} />
            </div>
            <div style={styles.divider} />
            <div style={styles.summaryBox}>
              <div style={styles.summaryTitle}>{orderType === "Quote" ? "Quote" : "Order"} Summary</div>
              <div style={styles.summaryRow}><span>Customer:</span><strong>{customerName||"—"}</strong></div>
              <div style={styles.summaryRow}><span>PO #:</span><strong>{poNumber||"—"}</strong></div>
              <div style={styles.summaryRow}><span>Contact:</span><strong>{customerContact||"—"}</strong></div>
              <div style={styles.summaryRow}><span>Type:</span><strong>{orderType}</strong></div>
              <div style={styles.summaryDivider} />
              {panelEntries.map((p, i) => (
                <div key={p.id}>
                  <div style={styles.summaryRow}><span style={{fontWeight:600}}>Panel {i+1}:</span><strong>{p.panel||"—"}{p.surface?` (${p.surface})`:""}</strong></div>
                  <div style={styles.summaryRowSub}>
                    <span>{p.gauge?`${p.gauge}ga`:"—"} / {p.color||"—"}</span>
                    <span>{p.pieceCount} pcs × {p.feet||0}'{p.inches?` ${p.inches}"`:""}</span>
                  </div>
                </div>
              ))}
              <div style={styles.summaryDivider} />
              <div style={styles.summaryRow}><span>Trim Pieces:</span><strong>{trimItems.length}</strong></div>
              <div style={styles.summaryRow}><span>Accessories:</span><strong>
                {[closureStrips&&"Closure",screws&&"Screws",solarSeal&&"Solar Seal",butylTape&&"Butyl",
                  pipeBoots&&`Boots(${pipeBootQty})`,rivets&&`Rivets(${rivetQty})`].filter(Boolean).join(", ")||"None"}
              </strong></div>
              {comments.trim() && (
                <div style={styles.summaryRow}><span>Notes:</span><strong style={{maxWidth:180,textAlign:"right"}}>{comments.length>50?comments.slice(0,50)+"...":comments}</strong></div>
              )}
            </div>
          </div>
        )}
      </div>

      <div style={styles.navBar}>
        {step > 0 && <button style={styles.navBack} onClick={() => setStep(step-1)}>← Back</button>}
        <div style={{flex:1}} />
        {step < 4 ? (
          <button style={{...styles.navNext,...(!STEPS[step].valid?styles.navDisabled:{})}}
            disabled={!STEPS[step].valid} onClick={() => setStep(step+1)}>Next →</button>
        ) : (
          <button style={styles.navGenerate} onClick={generatePDF} disabled={generating}>
            {generating ? "Generating..." : "📄 Generate PDF"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = {
  wrapper: { maxWidth:420,margin:"0 auto",minHeight:"100vh",background:"#f5f5f0",display:"flex",flexDirection:"column",fontFamily:"'Segoe UI',-apple-system,sans-serif" },
  topBar: { background:"linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)",color:"white",padding:"16px 20px 12px",textAlign:"center" },
  logo: { fontSize:24,fontWeight:800,letterSpacing:2 },
  logoM: { color:"#fff" },
  logoMax: { color:"#e74c3c" },
  topBarSub: { fontSize:12,color:"#aab",letterSpacing:3,textTransform:"uppercase",marginTop:2 },
  stepBar: { display:"flex",justifyContent:"center",gap:8,padding:"14px 20px 4px",background:"#fff",borderBottom:"1px solid #e8e8e4" },
  stepDot: { width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,background:"#e8e8e4",color:"#999",cursor:"pointer",transition:"all 0.2s" },
  stepDotActive: { background:"#e74c3c",color:"#fff",boxShadow:"0 2px 8px rgba(231,76,60,0.35)" },
  stepDotDone: { background:"#27ae60",color:"#fff" },
  stepName: { textAlign:"center",fontSize:13,fontWeight:600,color:"#555",padding:"6px 0 10px",background:"#fff",borderBottom:"1px solid #e8e8e4" },
  content: { flex:1,padding:"12px 16px 100px",overflowY:"auto" },
  section: {},
  sectionHeader: { display:"flex",alignItems:"center",gap:10,marginBottom:16 },
  sectionBadge: { width:30,height:30,borderRadius:"50%",background:"#e74c3c",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:14,flexShrink:0 },
  sectionTitle: { fontSize:17,fontWeight:700,color:"#1a1a2e" },
  sectionSubtitle: { fontSize:12,color:"#888" },
  fieldGroup: { marginBottom:14 },
  label: { display:"block",fontSize:12,fontWeight:700,color:"#555",marginBottom:4,textTransform:"uppercase",letterSpacing:0.5 },
  input: { width:"100%",padding:"12px 14px",border:"2px solid #ddd",borderRadius:10,fontSize:16,background:"#fff",outline:"none",boxSizing:"border-box" },
  textarea: { width:"100%",padding:"12px 14px",border:"2px solid #ddd",borderRadius:10,fontSize:15,background:"#fff",outline:"none",boxSizing:"border-box",resize:"vertical",fontFamily:"inherit",minHeight:100,lineHeight:1.5 },
  panelDesc: { fontSize:12,color:"#888",margin:"-4px 0 12px",fontStyle:"italic" },
  row: { display:"flex",gap:10 },
  divider: { height:1,background:"#e0e0dc",margin:"14px 0" },
  // Radio
  radioRow: { display:"flex",gap:10 },
  radioOption: { flex:1,display:"flex",alignItems:"center",gap:8,padding:"12px 14px",border:"2px solid #ddd",borderRadius:10,background:"#fff",cursor:"pointer",fontSize:14,fontWeight:600 },
  radioOptionActive: { borderColor:"#e74c3c",background:"#fef5f4" },
  radioCircle: { width:20,height:20,borderRadius:"50%",border:"2px solid #ccc",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 },
  radioCircleActive: { borderColor:"#e74c3c" },
  radioDot: { width:10,height:10,borderRadius:"50%",background:"#e74c3c" },
  // Panel card
  panelCard: { background:"#fff",border:"2px solid #e0e0dc",borderRadius:12,padding:14,marginBottom:12 },
  panelCardHeader: { display:"flex",alignItems:"center",gap:8,marginBottom:10 },
  panelCardNum: { fontSize:14,fontWeight:800,color:"#1a1a2e",flex:1 },
  panelCardCheck: { fontSize:14,fontWeight:700,color:"#27ae60",background:"#e8f8ef",borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center" },
  panelCardRemove: { fontSize:12,fontWeight:700,color:"#e74c3c",background:"#fef5f4",border:"1px solid #f5ccc8",borderRadius:6,padding:"4px 10px",cursor:"pointer" },
  addPanelBtn: { width:"100%",padding:"14px",border:"2px dashed #c0c0b8",borderRadius:12,background:"transparent",fontSize:15,fontWeight:700,color:"#888",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:4 },
  addPanelIcon: { width:26,height:26,borderRadius:"50%",background:"#e74c3c",color:"#fff",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700 },
  // Picker
  pickerBtn: { width:"100%",padding:"12px 14px",border:"2px solid #ddd",borderRadius:10,fontSize:15,background:"#fff",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,boxSizing:"border-box" },
  chevron: { fontSize:18,color:"#999" },
  overlay: { position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center" },
  pickerModal: { background:"#fff",borderRadius:"18px 18px 0 0",maxHeight:"60vh",width:"100%",maxWidth:420,display:"flex",flexDirection:"column" },
  pickerTitle: { fontSize:15,fontWeight:700,textAlign:"center",padding:"14px 0 8px",borderBottom:"1px solid #eee",color:"#1a1a2e" },
  pickerScroll: { flex:1,overflowY:"auto",padding:"4px 0" },
  pickerItem: { padding:"12px 20px",fontSize:15,cursor:"pointer",borderBottom:"1px solid #f5f5f5" },
  pickerItemActive: { background:"#fde8e6",color:"#e74c3c",fontWeight:700 },
  pickerClose: { padding:"14px",borderTop:"1px solid #eee",background:"none",fontSize:15,color:"#e74c3c",fontWeight:700,cursor:"pointer",border:"none" },
  // Number pad
  numDisplay: { padding:"12px 14px",border:"2px solid #ddd",borderRadius:10,fontSize:20,fontWeight:700,background:"#fff",textAlign:"center",cursor:"pointer",marginBottom:12 },
  numPadModal: { background:"#fff",borderRadius:"18px 18px 0 0",width:"100%",maxWidth:420,padding:"16px 20px 24px" },
  numPadDisplay: { fontSize:32,fontWeight:700,textAlign:"center",padding:"10px",borderBottom:"2px solid #eee",marginBottom:12,color:"#1a1a2e" },
  numPadGrid: { display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8 },
  numPadBtn: { padding:"16px",fontSize:20,fontWeight:700,border:"1px solid #ddd",borderRadius:10,background:"#f8f8f5",cursor:"pointer",color:"#1a1a2e" },
  numPadOk: { background:"#27ae60",color:"#fff",border:"none" },
  numPadDel: { background:"#eee",color:"#e74c3c",border:"none",fontSize:14 },
  // Checkbox
  checkRow: { display:"flex",alignItems:"center",gap:10,padding:"10px 0",cursor:"pointer" },
  checkbox: { width:26,height:26,borderRadius:6,border:"2px solid #ccc",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#fff",background:"#fff",transition:"all 0.15s",flexShrink:0 },
  checkboxChecked: { background:"#e74c3c",borderColor:"#e74c3c" },
  checkLabel: { fontSize:15,color:"#333" },
  // Trim
  trimGrid: { display:"flex",flexDirection:"column",gap:4 },
  trimChip: { padding:"8px 12px",background:"#fff",border:"2px solid #e0e0dc",borderRadius:8,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",gap:8 },
  trimChipActive: { borderColor:"#e74c3c",background:"#fef5f4" },
  trimCheck: { width:20,height:20,borderRadius:4,border:"2px solid #ccc",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#e74c3c",flexShrink:0 },
  trimThumb: { width:44,height:44,objectFit:"contain",borderRadius:4,background:"#f5f5f0",flexShrink:0,border:"1px solid #eee" },
  trimDetail: { display:"flex",gap:8,padding:"8px 12px 12px",background:"#fef5f4",borderRadius:"0 0 8px 8px",marginTop:-2,borderLeft:"2px solid #e74c3c",borderRight:"2px solid #e74c3c",borderBottom:"2px solid #e74c3c" },
  accGrid: { display:"flex",flexDirection:"column",gap:2 },
  accSubSection: { paddingLeft:36,paddingBottom:8 },
  noPanel: { color:"#999",fontStyle:"italic",padding:20,textAlign:"center" },
  // Summary
  summaryBox: { background:"#fff",border:"2px solid #e0e0dc",borderRadius:12,padding:16 },
  summaryTitle: { fontSize:14,fontWeight:800,color:"#e74c3c",textTransform:"uppercase",letterSpacing:1,marginBottom:10 },
  summaryRow: { display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #f5f5f5",fontSize:13 },
  summaryRowSub: { display:"flex",justifyContent:"space-between",padding:"2px 0 6px 12px",fontSize:12,color:"#777" },
  summaryDivider: { height:1,background:"#eee",margin:"6px 0" },
  // Canvas
  canvas: { width:"100%",height:220,border:"2px solid #ddd",borderRadius:10,background:"#fff",touchAction:"none" },
  clearBtn: { padding:"5px 12px",fontSize:12,fontWeight:700,background:"#eee",border:"none",borderRadius:6,color:"#e74c3c",cursor:"pointer" },
  // Nav
  navBar: { position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:420,display:"flex",padding:"10px 16px",background:"#fff",borderTop:"1px solid #e0e0dc",gap:10,boxSizing:"border-box",zIndex:100 },
  navBack: { padding:"12px 20px",borderRadius:10,border:"2px solid #ddd",background:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",color:"#555" },
  navNext: { padding:"12px 24px",borderRadius:10,border:"none",background:"#e74c3c",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer" },
  navDisabled: { opacity:0.4,cursor:"not-allowed" },
  navGenerate: { padding:"12px 24px",borderRadius:10,border:"none",background:"#27ae60",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer" },
};
