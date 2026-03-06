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
  "Standing Seam": ["14Z Bar","16Z Bar","Box Rake","Cleat","Counter Flashing","End Wall","Flush Eave","Hip Cap","Offset Cleat","Pitch Change/Transition","Plumb Eave","Reglet Flashing","Side Wall","Single Slope Ridge","Square Eave","Step Rake 14","Step Rake 16","Step Ridge","Valley","Vent Retainer"],
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
  "Pitch Change/Transition": CDN+"Standing-Seam-Trim-Spec-SS-Pitch-Change-1.png",
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

const PIPE_BOOT_SIZES = ['#101 - .75" to 2.75"','#3 - .25" to 5" GRAY','#3 - .25" to 4" RED HI-TEMP','#5 - 4.25" to 7.25"','#8 - 7" to 13"','Other (specify size)'];

// ─── PITCH OPTIONS ───────────────────────────────────────────────────────────
const PITCH_OPTIONS = Array.from({ length: 18 }, (_, i) => `${i + 1}/12`);

// Which trim pieces need a pitch field, keyed by category
const NEEDS_PITCH = {
  "Standing Seam": ["End Wall","Flush Eave","Hip Cap","Pitch Change/Transition","Plumb Eave","Single Slope Ridge","Valley","Vent Retainer"],
  "PBR": ["End Wall","Hi-Side Parapet","Universal Ridge","Valley","Wide Valley"],
  "Max Panel": ["End Wall","Fascia","Residential Eave","Residential Hip Cap","Residential Ridge Cap","Residential Valley","Upper Gambrel"],
};

// Special trim behaviors
const NEEDS_TRANSITION_PITCH = ["Pitch Change/Transition"]; // needs a second "transition to" pitch
const NEEDS_CLEATED = { "Standing Seam": ["Valley"] }; // Valley in SS gets a "cleated" checkbox

// Exposed fastener panel categories (for ridge vent type)
const EXPOSED_FASTENER_CATS = ["PBR", "Max Panel"];
const HIDDEN_FASTENER_CATS = ["Standing Seam"];

function trimNeedsPitch(name, categories) {
  return categories.some(cat => (NEEDS_PITCH[cat] || []).includes(name));
}
function trimNeedsTransitionPitch(name) {
  return NEEDS_TRANSITION_PITCH.includes(name);
}
function trimNeedsCleated(name, categories) {
  return categories.some(cat => (NEEDS_CLEATED[cat] || []).includes(name));
}
const RIVET_COLORS = ["Matching Panel Color","Matching Trim Color","Galvalume","White","Black","Brown"];

// ─── VOICE: NICKNAME DICTIONARIES ────────────────────────────────────────────
// Maps spoken shorthand → exact product names. Speech API transcribes to text,
// then we fuzzy-match against these + the real names. Corrections get saved
// to localStorage so the app learns your lingo over time.

const PANEL_NICKNAMES = {
  // PBR
  "pbr": "PBR Panel", "p b r": "PBR Panel", "p.b.r.": "PBR Panel",
  "r panel": "PBR Panel", "are panel": "PBR Panel", "r-panel": "PBR Panel",
  // PBU
  "pbu": "PBU Panel", "p b u": "PBU Panel", "p.b.u.": "PBU Panel",
  // MaxPanel
  "max panel": "MaxPanel", "max rib": "MaxPanel", "rib panel": "MaxPanel",
  // MaxStrong
  "max strong": "MaxStrong Panel", "strong panel": "MaxStrong Panel",
  // MaxLoc
  "max loc": "MaxLoc100 Panel", "maxloc": "MaxLoc100 Panel", "max lock": "MaxLoc100 Panel",
  "loc 100": "MaxLoc100 Panel", "lock 100": "MaxLoc100 Panel",
  // MaxSeam
  "max seam": "MaxSeam175 Panel", "maxseam": "MaxSeam175 Panel", "seam 175": "MaxSeam175 Panel",
  // MaxSnap
  "max snap": "MaxSnap150 Panel", "maxsnap": "MaxSnap150 Panel", "snap lock": "MaxSnap150 Panel",
  "snap 150": "MaxSnap150 Panel",
  // MaxMech150
  "mech 150": "MaxMech150 Panel", "max mech 150": "MaxMech150 Panel",
  "mechanical 150": "MaxMech150 Panel", "mech seam": "MaxMech150 Panel",
  "mechanical seam": "MaxMech150 Panel",
  // MaxMech200
  "mech 200": "MaxMech200 Panel", "max mech 200": "MaxMech200 Panel",
  "mechanical 200": "MaxMech200 Panel",
  // Board & Batten
  "board and batten": "Board & Batten Panel", "board & batten": "Board & Batten Panel",
  "bat and board": "Board & Batten Panel", "batten": "Board & Batten Panel",
  "b&b": "Board & Batten Panel", "b and b": "Board & Batten Panel",
  // 5V
  "5v": "5V Crimp", "five v": "5V Crimp", "5v crimp": "5V Crimp",
  "five v crimp": "5V Crimp", "5 v": "5V Crimp",
};

const COLOR_NICKNAMES = {
  "galvy": "Galvalume", "galv": "Galvalume", "galvalume": "Galvalume",
  "acg": "Acrylic Coated Galvalume", "acrylic galv": "Acrylic Coated Galvalume",
  "coated galv": "Acrylic Coated Galvalume",
  "charcoal": "Charcoal", "char": "Charcoal",
  "charcoal gray": "Charcoal Gray", "char gray": "Charcoal Gray",
  "dark gray": "Dark Gray",
  "dove": "Dove Gray", "dove gray": "Dove Gray",
  "slate": "Slate Gray", "slate gray": "Slate Gray",
  "slate blue": "Slate Blue",
  "dark bronze": "Dark Bronze", "bronze": "Dark Bronze",
  "medium bronze": "Medium Bronze", "med bronze": "Medium Bronze",
  "mansard": "Mansard Brown", "mansard brown": "Mansard Brown",
  "matte black": "Matte Black", "black matte": "Matte Black",
  "regal white": "Regal White",
  "regal blue": "Regal Blue",
  "regal red": "Regal Red",
  "polar white": "Polar White", "polar": "Polar White",
  "brilliant white": "Brilliant White",
  "alamo white": "Alamo White", "alamo": "Alamo White",
  "solar white": "Solar White", "solar": "Solar White",
  "stone white": "Stone White",
  "ash gray": "Ash Gray", "ash": "Ash Gray",
  "pewter gray": "Pewter Gray", "pewter": "Pewter Gray",
  "burnished slate": "Burnished Slate", "burnished": "Burnished Slate",
  "burgundy": "Burgundy",
  "colonial red": "Colonial Red", "colonial": "Colonial Red",
  "brite red": "Brite Red", "bright red": "Brite Red",
  "rustic red": "Rustic Red", "rustic": "Rustic Red",
  "terra cotta": "Terra Cotta", "terracotta": "Terra Cotta",
  "hunter green": "Hunter Green", "hunter": "Hunter Green",
  "evergreen": "Evergreen",
  "fern green": "Fern Green", "fern": "Fern Green",
  "hartford green": "Hartford Green", "hartford": "Hartford Green",
  "hemlock green": "Hemlock Green", "hemlock": "Hemlock Green",
  "patina green": "Patina Green", "patina": "Patina Green",
  "ocean blue": "Ocean Blue", "ocean": "Ocean Blue",
  "gallery blue": "Gallery Blue", "gallery": "Gallery Blue",
  "copper": "Copper", "copper penny": "Copper Penny",
  "sandstone": "Sandstone", "sand": "Sandstone",
  "sierra tan": "Sierra Tan", "sierra": "Sierra Tan",
  "surrey beige": "Surrey Beige", "surrey": "Surrey Beige",
  "light stone": "Light Stone",
  "champagne": "Champagne",
  "taupe": "Taupe", "tan": "Tan", "brown": "Brown",
  "black": "Black", "silver": "Silver", "antique": "Antique",
  "vintage": "Vintage",
  "cor-ten": "Cor-ten AZP Raw", "corten": "Cor-ten AZP Raw", "raw": "Cor-ten AZP Raw",
  "pre-weathered": "Pre-Weathered Galvalume", "pre weathered": "Pre-Weathered Galvalume",
  "tlg black": "TLG Black", "tlg charcoal": "TLG Charcoal Gray",
  "tlg bronze": "TLG Dark Bronze", "tlg medium bronze": "TLG Medium Bronze",
  "tlg moonstone": "TLG Moonstone", "moonstone": "TLG Moonstone",
};

const TRIM_NICKNAMES = {
  // Shorthand for common trims
  "z bar": "14Z Bar", "14 z": "14Z Bar", "14 z bar": "14Z Bar",
  "16 z": "16Z Bar", "16 z bar": "16Z Bar",
  "box rake": "Box Rake",
  "cleat": "Cleat",
  "counter flash": "Counter Flashing", "counter flashing": "Counter Flashing",
  "end wall": "End Wall", "endwall": "End Wall",
  "flush eave": "Flush Eave",
  "hip cap": "Hip Cap", "hip": "Hip Cap",
  "offset cleat": "Offset Cleat",
  "pitch change": "Pitch Change/Transition", "transition": "Pitch Change/Transition",
  "pitch transition": "Pitch Change/Transition",
  "plumb eave": "Plumb Eave", "plumb": "Plumb Eave",
  "reglet": "Reglet Flashing", "reglet flashing": "Reglet Flashing",
  "side wall": "Side Wall", "sidewall": "Side Wall",
  "single slope": "Single Slope Ridge", "single slope ridge": "Single Slope Ridge",
  "square eave": "Square Eave",
  "step rake 14": "Step Rake 14", "step rake 16": "Step Rake 16",
  "step ridge": "Step Ridge",
  "valley": "Valley",
  "vent retainer": "Vent Retainer", "retainer": "Vent Retainer",
  // PBR trims
  "base trim": "Base Trim", "base": "Base Trim",
  "double angle": "Double Angle",
  "flat sheet": "Flat Sheet", "flat": "Flat Sheet",
  "ridge cap": "Formed Ridge Cap", "formed ridge": "Formed Ridge Cap",
  "ridge": "Formed Ridge Cap",
  "hi side eave": "Hi-Side Eave", "high side eave": "Hi-Side Eave",
  "hi side parapet": "Hi-Side Parapet", "high side parapet": "Hi-Side Parapet",
  "parapet": "Hi-Side Parapet",
  "house rake": "House Rake",
  "inside corner": "Inside Corner",
  "inside angle": "Inside Single Angle", "inside single angle": "Inside Single Angle",
  "j trim": "J-Trim", "j-trim": "J-Trim", "jay trim": "J-Trim",
  "jamb header": "Jamb Header",
  "jamb trim": "Jamb Trim", "jamb": "Jamb Trim",
  "long eave": "Long Eave Trim", "long eave trim": "Long Eave Trim",
  "outside corner": "Outside Corner",
  "outside angle": "Outside Single Angle", "outside single angle": "Outside Single Angle",
  "rake": "Rake", "rake trim": "Rake",
  "rat guard": "Rat Guard",
  "short eave": "Short Eave",
  "skylight": "Skylight Trim", "skylight trim": "Skylight Trim",
  "tie in": "Tie-In", "tie-in": "Tie-In", "tyin": "Tie-In",
  "universal ridge": "Universal Ridge", "uni ridge": "Universal Ridge",
  "wide valley": "Wide Valley",
  "window cap": "Window Cap", "window": "Window Cap",
  // Max Panel trims
  "barn rake": "Barn Rake",
  "barn ridge": "Barn Ridge",
  "door edge": "Door Edge",
  "door jamb": "Door Jamb Wide", "door jamb wide": "Door Jamb Wide",
  "door post": "Door Post",
  "fascia": "Fascia",
  "gable": "Gable",
  "gutter apron": "Gutter Apron", "gutter": "Gutter Apron",
  "keystone": "Keystone",
  "large corner": "Large Corner",
  "lower gambrel": "Lower Gambrel", "gambrel": "Lower Gambrel",
  "overhead door jamb": "Overhead Door Jamb", "overhead jamb": "Overhead Door Jamb",
  "oh door jamb": "OH Door Jamb w/ Drip Edge", "oh jamb drip": "OH Door Jamb w/ Drip Edge",
  "drip edge": "Residential Drip Edge", "res drip edge": "Residential Drip Edge",
  "res eave": "Residential Eave", "residential eave": "Residential Eave",
  "res hip cap": "Residential Hip Cap", "residential hip": "Residential Hip Cap",
  "res rake": "Residential Rake", "residential rake": "Residential Rake",
  "res ridge cap": "Residential Ridge Cap", "residential ridge": "Residential Ridge Cap",
  "res ridge": "Residential Ridge Cap",
  "res valley": "Residential Valley", "residential valley": "Residential Valley",
  "round track": "Round Track Cover", "round track cover": "Round Track Cover",
  "small corner": "Small Corner",
  "soffit": "Soffit",
  "square base": "Square Base",
  "square track": "Square Track Cover Narrow",
  "upper gambrel": "Upper Gambrel",
  "wide ridge": "Wide Ridgecap", "wide ridgecap": "Wide Ridgecap", "wide ridge cap": "Wide Ridgecap",
};

const GAUGE_NICKNAMES = {
  "22 gauge": "22", "22 ga": "22", "twenty two": "22", "twenty-two": "22",
  "24 gauge": "24", "24 ga": "24", "twenty four": "24", "twenty-four": "24",
  "26 gauge": "26", "26 ga": "26", "twenty six": "26", "twenty-six": "26",
  "29 gauge": "29", "29 ga": "29", "twenty nine": "29", "twenty-nine": "29",
};

const SURFACE_NICKNAMES = {
  "striations": "Striations", "striated": "Striations",
  "flat pan": "Flat Pan", "flat": "Flat Pan",
  "two bead": "Two Bead", "2 bead": "Two Bead",
  "pencil rib": "Pencil Rib", "pencil": "Pencil Rib",
};

// ─── VOICE: FUZZY MATCHING ENGINE ────────────────────────────────────────────

// Load learned corrections from localStorage
function loadLearnedCorrections() {
  try { return JSON.parse(localStorage.getItem("mm_voice_corrections") || "{}"); } catch { return {}; }
}
function saveCorrection(spoken, correctedTo, category) {
  try {
    const corrections = loadLearnedCorrections();
    if (!corrections[category]) corrections[category] = {};
    corrections[category][spoken.toLowerCase()] = correctedTo;
    localStorage.setItem("mm_voice_corrections", JSON.stringify(corrections));
  } catch {}
}

// Levenshtein distance for fuzzy matching
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      d[i][j] = a[i-1] === b[j-1] ? d[i-1][j-1] : 1 + Math.min(d[i-1][j], d[i][j-1], d[i-1][j-1]);
    }
  }
  return d[m][n];
}

// Find best match from a list of options + nickname dict + learned corrections
function fuzzyMatch(spoken, options, nicknames = {}, category = "") {
  const s = spoken.toLowerCase().trim();
  if (!s) return { match: null, confidence: 0, alternatives: [] };

  // 1. Check learned corrections first (highest priority)
  const learned = loadLearnedCorrections();
  if (learned[category] && learned[category][s]) {
    const m = learned[category][s];
    if (options.includes(m)) return { match: m, confidence: 1, alternatives: [] };
  }

  // 2. Exact match in options
  const exactOpt = options.find(o => o.toLowerCase() === s);
  if (exactOpt) return { match: exactOpt, confidence: 1, alternatives: [] };

  // 3. Exact match in nicknames
  if (nicknames[s] && options.includes(nicknames[s])) return { match: nicknames[s], confidence: 1, alternatives: [] };

  // 4. Partial/contains match in nicknames
  const nickEntries = Object.entries(nicknames);
  for (const [nick, val] of nickEntries) {
    if (options.includes(val) && (s.includes(nick) || nick.includes(s))) {
      return { match: val, confidence: 0.85, alternatives: [] };
    }
  }

  // 5. Fuzzy match against options and nicknames
  const scored = options.map(o => {
    const dist = levenshtein(s, o.toLowerCase());
    const maxLen = Math.max(s.length, o.length);
    const score = 1 - dist / maxLen;
    return { option: o, score };
  });

  // Also check nicknames with fuzzy
  for (const [nick, val] of nickEntries) {
    if (!options.includes(val)) continue;
    const dist = levenshtein(s, nick);
    const maxLen = Math.max(s.length, nick.length);
    const score = 1 - dist / maxLen;
    scored.push({ option: val, score: score + 0.05 }); // slight bonus for nickname match
  }

  // Deduplicate and sort
  const seen = new Set();
  const unique = scored.filter(x => { if (seen.has(x.option)) return false; seen.add(x.option); return true; });
  unique.sort((a, b) => b.score - a.score);

  const best = unique[0];
  if (!best) return { match: null, confidence: 0, alternatives: [] };

  const alts = unique.slice(1, 4).filter(x => x.score > 0.4).map(x => x.option);

  if (best.score > 0.7) return { match: best.option, confidence: best.score, alternatives: alts };
  if (best.score > 0.5) return { match: best.option, confidence: best.score, alternatives: alts };
  return { match: null, confidence: 0, alternatives: unique.slice(0, 4).map(x => x.option) };
}

// Parse numbers from speech text
function extractNumber(text) {
  const numWords = { zero:0, one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8, nine:9, ten:10,
    eleven:11, twelve:12, thirteen:13, fourteen:14, fifteen:15, sixteen:16, seventeen:17, eighteen:18,
    nineteen:19, twenty:20, thirty:30, forty:40, fifty:50 };
  // Try direct number
  const numMatch = text.match(/\d+/);
  if (numMatch) return parseInt(numMatch[0]);
  // Try word numbers
  const words = text.toLowerCase().split(/\s+/);
  for (const w of words) { if (numWords[w] !== undefined) return numWords[w]; }
  // Compound: "twenty six" etc
  for (let i = 0; i < words.length - 1; i++) {
    const tens = numWords[words[i]];
    const ones = numWords[words[i+1]];
    if (tens >= 20 && ones >= 1 && ones <= 9) return tens + ones;
  }
  return null;
}

// ─── VOICE: SPEECH RECOGNITION HOOK ─────────────────────────────────────────

function useSpeechRecognition() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Speech recognition is not supported on this browser."); return; }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setListening(false);
    };
    recognition.onerror = () => { setListening(false); };
    recognition.onend = () => { setListening(false); };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
    setTranscript("");
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setListening(false);
  }, []);

  return { listening, transcript, startListening, stopListening, setTranscript };
}

// ─── VOICE: "DID YOU MEAN?" CONFIRMATION COMPONENT ─────────────────────────

function VoiceConfirm({ label, match, confidence, alternatives, onAccept, onPickAlt, onDismiss, spokenText, category }) {
  if (!match && alternatives.length === 0) return null;
  const uncertain = confidence < 0.85;
  return (
    <div style={styles.voiceConfirm}>
      <div style={styles.voiceConfirmHeader}>
        <span style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
        <button onClick={onDismiss} style={styles.voiceConfirmX}>✕</button>
      </div>
      {match ? (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: uncertain && alternatives.length > 0 ? 8 : 0 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: uncertain ? "#e67e22" : "#27ae60" }}>{match}</span>
            {uncertain && <span style={{ fontSize: 11, color: "#e67e22" }}>(?)</span>}
            <button onClick={() => { onAccept(match); if (spokenText && category) saveCorrection(spokenText, match, category); }}
              style={styles.voiceConfirmAccept}>Yes</button>
          </div>
          {uncertain && alternatives.length > 0 && (
            <div>
              <span style={{ fontSize: 11, color: "#888" }}>Did you mean: </span>
              {alternatives.map(a => (
                <button key={a} onClick={() => { onPickAlt(a); if (spokenText && category) saveCorrection(spokenText, a, category); }}
                  style={styles.voiceConfirmAlt}>{a}</button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <span style={{ fontSize: 13, color: "#999" }}>No match found. Did you mean:</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
            {alternatives.map(a => (
              <button key={a} onClick={() => { onPickAlt(a); if (spokenText && category) saveCorrection(spokenText, a, category); }}
                style={styles.voiceConfirmAlt}>{a}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MicButton({ listening, onClick, style: extraStyle }) {
  return (
    <button onClick={onClick}
      style={{ ...styles.micBtn, ...(listening ? styles.micBtnActive : {}), ...extraStyle }}>
      {listening ? "..." : "🎤"}
    </button>
  );
}

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
  const [ridgeVent, setRidgeVent] = useState(false);
  const [flexProQty, setFlexProQty] = useState(0);
  const [snapZQty, setSnapZQty] = useState(0);

  // Step 4: Accessories
  const [closureStrips, setClosureStrips] = useState(false);
  const [screws, setScrews] = useState(false);
  const [solarSeal, setSolarSeal] = useState(false);
  const [butylTape, setButylTape] = useState(false);
  const [pipeBoots, setPipeBoots] = useState(false);
  const [pipeBootEntries, setPipeBootEntries] = useState([{ id: 1, size: "", qty: 0 }]);
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
  const hasExposed = allTrimCategories.some(c => EXPOSED_FASTENER_CATS.includes(c));
  const hasHidden = allTrimCategories.some(c => HIDDEN_FASTENER_CATS.includes(c));

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

  const toggleTrim = (t) => { setTrimItems((prev) => { const ex = prev.find((i) => i.name === t); if (ex) return prev.filter((i) => i.name !== t); return [...prev, { name: t, qty: 1, feet: "10", inches: "6", pitch: "", pitchTo: "", cleated: false }]; }); };
  const updateTrimItem = (name, field, value) => { setTrimItems((prev) => prev.map((i) => (i.name === name ? { ...i, [field]: value } : i))); };

  // ─── VOICE ──────────────────────────────────────────────────────────────────
  const voice = useSpeechRecognition();
  const [voiceMode, setVoiceMode] = useState(null); // "panel", "trim", or null
  const [voiceParsed, setVoiceParsed] = useState(null); // parsed results awaiting confirmation

  // Parse panel dictation: "PBR 26 gauge charcoal 12 pieces 18 foot 6 inches"
  useEffect(() => {
    if (!voice.transcript || voiceMode !== "panel") return;
    const raw = voice.transcript.toLowerCase();
    const parts = raw.replace(/,/g, "").replace(/\./g, "");
    const panelNames = Object.keys(PANELS);
    const panelMatch = fuzzyMatch(parts, panelNames, PANEL_NICKNAMES, "panel");

    // Find gauge
    let gaugeVal = null;
    const gMatch = parts.match(/(\d{2})\s*(gauge|ga\b)/);
    if (gMatch) gaugeVal = gMatch[1];
    else { for (const [nick, val] of Object.entries(GAUGE_NICKNAMES)) { if (parts.includes(nick)) { gaugeVal = val; break; } } }

    // Find color - try longest nickname match first
    let colorVal = null;
    const allColors = [...new Set(Object.values(COLORS_BY_GAUGE).flat())];
    const sortedColorNicks = Object.entries(COLOR_NICKNAMES).sort((a, b) => b[0].length - a[0].length);
    for (const [nick, val] of sortedColorNicks) { if (parts.includes(nick) && allColors.includes(val)) { colorVal = val; break; } }
    if (!colorVal) {
      // Try matching against actual color names
      const sortedColors = [...allColors].sort((a, b) => b.length - a.length);
      for (const c of sortedColors) { if (parts.includes(c.toLowerCase())) { colorVal = c; break; } }
    }

    // Find piece count: "12 pieces" or "12 pcs" or just a standalone number after color context
    let pieceCount = null;
    const pcMatch = parts.match(/(\d+)\s*(piece|pieces|pcs|pc|count)/);
    if (pcMatch) pieceCount = parseInt(pcMatch[1]);

    // Find length: "18 foot/feet" and "6 inch/inches"
    let feet = null, inches = null;
    const ftMatch = parts.match(/(\d+)\s*(foot|feet|ft)/);
    if (ftMatch) feet = ftMatch[1];
    const inMatch = parts.match(/(\d+)\s*(inch|inches|in\b)/);
    if (inMatch) inches = inMatch[1];

    // Surface variation for standing seam
    let surface = null;
    if (panelMatch.match && PANELS[panelMatch.match]?.isStandingSeam) {
      const surfMatch = fuzzyMatch(parts, SURFACE_VARIATIONS, SURFACE_NICKNAMES, "surface");
      if (surfMatch.match && surfMatch.confidence > 0.6) surface = surfMatch.match;
    }

    // Color match refinement with available colors for matched gauge
    let colorConfidence = colorVal ? 0.9 : 0;
    let colorAlts = [];
    if (colorVal && gaugeVal) {
      const available = (COLORS_BY_GAUGE[gaugeVal] || []).sort();
      if (!available.includes(colorVal)) {
        // Color exists but not in this gauge — find closest match in gauge
        const reMatch = fuzzyMatch(colorVal.toLowerCase(), available, COLOR_NICKNAMES, "color");
        colorVal = reMatch.match;
        colorConfidence = reMatch.confidence;
        colorAlts = reMatch.alternatives;
      }
    }

    setVoiceParsed({
      type: "panel",
      raw: voice.transcript,
      panel: panelMatch,
      gauge: gaugeVal,
      color: { match: colorVal, confidence: colorConfidence, alternatives: colorAlts, spoken: raw },
      pieces: pieceCount,
      feet, inches, surface
    });
  }, [voice.transcript, voiceMode]);

  // Parse trim dictation: "valley" or "ridge cap" or "inside corner"
  useEffect(() => {
    if (!voice.transcript || voiceMode !== "trim") return;
    const raw = voice.transcript.toLowerCase().replace(/,/g, "").replace(/\./g, "");
    const trimMatch = fuzzyMatch(raw, availableTrim, TRIM_NICKNAMES, "trim");
    setVoiceParsed({ type: "trim", raw: voice.transcript, trim: trimMatch });
  }, [voice.transcript, voiceMode]);

  const startPanelVoice = () => { setVoiceMode("panel"); setVoiceParsed(null); voice.startListening(); };
  const startTrimVoice = () => { setVoiceMode("trim"); setVoiceParsed(null); voice.startListening(); };
  const dismissVoice = () => { setVoiceParsed(null); voice.setTranscript(""); };

  const applyPanelVoice = (parsed, overrides = {}) => {
    const last = panelEntries[panelEntries.length - 1];
    const updated = { ...last };
    if (overrides.panel || parsed.panel?.match) updated.panel = overrides.panel || parsed.panel.match;
    if (parsed.gauge) updated.gauge = parsed.gauge;
    if (overrides.color || parsed.color?.match) updated.color = overrides.color || parsed.color.match;
    if (parsed.surface) updated.surface = parsed.surface;
    if (parsed.pieces) updated.pieceCount = parsed.pieces;
    if (parsed.feet) updated.feet = parsed.feet;
    if (parsed.inches) updated.inches = parsed.inches;
    // Reset dependent fields if panel changed
    if (updated.panel !== last.panel) { updated.gauge = parsed.gauge || ""; updated.color = ""; updated.surface = ""; }
    if (updated.gauge !== last.gauge) { updated.color = overrides.color || parsed.color?.match || ""; }
    updatePanelEntry({ ...updated, id: last.id });
    setVoiceParsed(null);
    voice.setTranscript("");
  };

  const applyTrimVoice = (trimName) => {
    if (!trimItems.find(i => i.name === trimName)) toggleTrim(trimName);
    setVoiceParsed(null);
    voice.setTranscript("");
  };

  const STEPS = [
    { title: "Customer Info", valid: customerName.trim() && orderType },
    { title: "Panel Selection", valid: allPanelsValid },
    { title: "Trim Pieces", valid: true },
    { title: "Accessories", valid: true },
    { title: "Custom Trim & Notes", valid: true },
  ];

  // ─── RESET ────────────────────────────────────────────────────────────────────
  const resetOrder = () => {
    if (!window.confirm("Start a new order? This will clear all current data.")) return;
    setStep(0);
    setCustomerName(""); setPoNumber(""); setCustomerContact(""); setOrderType("Sales Order");
    setPanelEntries([newPanel()]);
    setSameColorTrim(true); setTrimColor(""); setTrimItems([]);
    setRidgeVent(false); setFlexProQty(0); setSnapZQty(0);
    setClosureStrips(false); setScrews(false); setSolarSeal(false); setButylTape(false);
    setPipeBoots(false); setPipeBootEntries([{ id: 1, size: "", qty: 0 }]);
    setRivets(false); setRivetColor(""); setRivetQty(0);
    setHasCustomTrim(false); setComments("");
    if (canvasRef.current) { const ctx = canvasRef.current.getContext("2d"); ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); }
  };

  // ─── PDF ─────────────────────────────────────────────────────────────────────
  const generatePDF = async () => {
    setGenerating(true);
    const fp = panelEntries[0];
    const trimColorDisplay = sameColorTrim ? `Same as panel (${fp?.color || "N/A"})` : trimColor;
    const trimListHTML = trimItems.length > 0
      ? trimItems.map((t) => {
          const len = (t.feet === "10" && t.inches === "6") ? 'Std 10\' 6"' : `${t.feet || 0}'${t.inches ? ` ${t.inches}"` : ""}`;
          const notes = [];
          if (t.pitch) notes.push(t.pitchTo ? `Pitch: ${t.pitch} to ${t.pitchTo}` : `Pitch: ${t.pitch}`);
          if (t.cleated) notes.push("Cleated");
          const noteStr = notes.length ? `<br><small style="color:#666">${notes.join(", ")}</small>` : "";
          return `<tr><td style="padding:6px 10px;border-bottom:1px solid #ddd">${t.name}${noteStr}</td><td style="padding:6px 10px;border-bottom:1px solid #ddd;text-align:center">${t.qty}</td><td style="padding:6px 10px;border-bottom:1px solid #ddd;text-align:center">${len}</td></tr>`;
        }).join("")
      : '<tr><td colspan="3" style="padding:10px;color:#999;text-align:center">No trim selected</td></tr>';

    // Ridge vent line in trim section
    let ridgeVentHTML = "";
    if (ridgeVent) {
      const parts = [];
      if (hasExposed && flexProQty > 0) parts.push(`FlexPro: ${flexProQty} LF`);
      if (hasHidden && snapZQty > 0) parts.push(`Snap Z: ${snapZQty} LF`);
      if (parts.length) ridgeVentHTML = `<div class="info-row" style="margin-top:8px"><span class="info-label">Ridge Vent:</span> ${parts.join(", ")}</div>`;
    }

    const acc = [];
    if (closureStrips) acc.push("Closure Strips");
    if (screws) acc.push("Screws");
    if (solarSeal) acc.push("Solar Seal");
    if (butylTape) acc.push("Butyl Tape");
    if (pipeBoots) { pipeBootEntries.filter(b => b.size && b.qty > 0).forEach(b => { acc.push(`Pipe Boot: ${b.size} x ${b.qty}`); }); }
    if (rivets && rivetColor) acc.push(`Rivets: ${rivetColor} x ${rivetQty}`);

    let sketchDataUrl = "";
    if (hasCustomTrim && canvasRef.current) sketchDataUrl = canvasRef.current.toDataURL("image/png");

    const panelsHTML = panelEntries.map((p, i) => {
      const surf = PANELS[p.panel]?.isStandingSeam && p.surface ? `<br><small style="color:#666">${p.surface}</small>` : "";
      return `<tr><td style="padding:6px 10px;border-bottom:1px solid #ddd">${i+1}</td><td style="padding:6px 10px;border-bottom:1px solid #ddd">${p.panel}${surf}</td><td style="padding:6px 10px;border-bottom:1px solid #ddd;text-align:center">${p.gauge}ga</td><td style="padding:6px 10px;border-bottom:1px solid #ddd">${p.color}</td><td style="padding:6px 10px;border-bottom:1px solid #ddd;text-align:center">${p.pieceCount}</td><td style="padding:6px 10px;border-bottom:1px solid #ddd;text-align:center">${p.feet}'${p.inches?` ${p.inches}"`:""}</td></tr>`;
    }).join("");

    const headerTitle = orderType === "Quote" ? "METALMAX QUOTE" : "METALMAX SALES ORDER";
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${headerTitle} - ${customerName}</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Helvetica Neue',Arial,sans-serif;padding:30px;color:#1a1a2e;font-size:13px}.header{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #c0392b;padding-bottom:15px;margin-bottom:20px}.header h1{font-size:22px;color:#c0392b;letter-spacing:1px}.header .date{font-size:12px;color:#666}.section{margin-bottom:18px}.section-title{font-size:14px;font-weight:700;color:#c0392b;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #eee}.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px 20px}.info-row{display:flex;gap:6px}.info-label{font-weight:600;min-width:100px}table{width:100%;border-collapse:collapse}th{background:#c0392b;color:#fff;padding:8px 10px;text-align:left;font-size:12px}.acc-list{display:flex;gap:15px;flex-wrap:wrap}.acc-item{padding:5px 12px;background:#f8f8f8;border:1px solid #ddd;border-radius:4px;font-size:12px}.sketch-img{max-width:100%;border:1px solid #ccc;margin-top:8px}.comments-box{background:#f8f8f8;border:1px solid #ddd;border-radius:4px;padding:10px;white-space:pre-wrap;font-size:12px;min-height:40px}.share-bar{position:fixed;bottom:0;left:0;right:0;background:#1a1a2e;padding:14px 20px;display:flex;gap:10px;justify-content:center}.share-btn{padding:12px 24px;border-radius:10px;border:none;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit}.share-print{background:#c0392b;color:#fff}.share-close{background:#555;color:#fff}@media print{.share-bar{display:none!important}body{padding:15px}}</style></head><body>
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
        <table><thead><tr><th>Trim Piece</th><th style="text-align:center">Qty</th><th style="text-align:center">Length</th></tr></thead><tbody>${trimListHTML}</tbody></table>
        ${ridgeVentHTML}</div>
      <div class="section"><div class="section-title">Accessories</div>
        ${acc.length?`<div class="acc-list">${acc.map(a=>`<div class="acc-item">${a}</div>`).join("")}</div>`:'<p style="color:#999">None selected</p>'}</div>
      ${hasCustomTrim&&sketchDataUrl?`<div class="section"><div class="section-title">Custom Trim Sketch</div><img src="${sketchDataUrl}" class="sketch-img" /></div>`:""}
      ${comments.trim()?`<div class="section"><div class="section-title">Additional Notes / Measurements</div><div class="comments-box">${comments.replace(/</g,"&lt;").replace(/\n/g,"<br>")}</div></div>`:""}
      <div class="share-bar">
        <button class="share-btn share-print" onclick="window.print()">Save / Share PDF</button>
        <button class="share-btn share-close" onclick="window.close()">Close</button>
      </div>
    </body></html>`;
    const w = window.open("","_blank");
    if(w){w.document.write(html);w.document.close()}
    else{alert("Please allow popups to generate the PDF.")}
    setGenerating(false);
  };

  const headerLabel = orderType === "Quote" ? "Quote Entry" : "Order Entry";

  return (
    <div style={styles.wrapper}>
      <div style={styles.topBar}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ flex: 1 }} />
          <div style={{ textAlign: "center", flex: 2 }}>
            <div style={styles.logo}><span style={styles.logoM}>METAL</span><span style={styles.logoMax}>MAX</span></div>
            <div style={styles.topBarSub}>{headerLabel}</div>
          </div>
          <div style={{ flex: 1, textAlign: "right" }}>
            <button onClick={resetOrder} style={styles.newOrderBtn}>+ New</button>
          </div>
        </div>
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
            <div style={styles.voiceBar}>
              <MicButton listening={voice.listening && voiceMode === "panel"} onClick={voice.listening ? voice.stopListening : startPanelVoice} />
              <span style={styles.voiceTranscript}>
                {voice.listening && voiceMode === "panel" ? "Listening... say panel, gauge, color, pieces, length" : voice.transcript && voiceMode === "panel" ? `"${voice.transcript}"` : "Tap mic to dictate panel info"}
              </span>
            </div>
            {voiceParsed?.type === "panel" && (
              <div style={styles.voiceConfirm}>
                <div style={styles.voiceConfirmHeader}>
                  <span style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 0.5 }}>Voice Result</span>
                  <button onClick={dismissVoice} style={styles.voiceConfirmX}>✕</button>
                </div>
                {voiceParsed.panel?.match && (
                  <VoiceConfirm label="Panel" match={voiceParsed.panel.match} confidence={voiceParsed.panel.confidence}
                    alternatives={voiceParsed.panel.alternatives} spokenText={voiceParsed.raw} category="panel"
                    onAccept={() => applyPanelVoice(voiceParsed)}
                    onPickAlt={(alt) => applyPanelVoice(voiceParsed, { panel: alt })}
                    onDismiss={dismissVoice} />
                )}
                {!voiceParsed.panel?.match && voiceParsed.panel?.alternatives?.length > 0 && (
                  <VoiceConfirm label="Panel" match={null} confidence={0}
                    alternatives={voiceParsed.panel.alternatives} spokenText={voiceParsed.raw} category="panel"
                    onAccept={() => {}} onPickAlt={(alt) => applyPanelVoice(voiceParsed, { panel: alt })} onDismiss={dismissVoice} />
                )}
                {voiceParsed.color?.match && voiceParsed.color?.confidence < 0.85 && (
                  <VoiceConfirm label="Color" match={voiceParsed.color.match} confidence={voiceParsed.color.confidence}
                    alternatives={voiceParsed.color.alternatives} spokenText={voiceParsed.color.spoken} category="color"
                    onAccept={(c) => applyPanelVoice(voiceParsed, { color: c })}
                    onPickAlt={(alt) => applyPanelVoice(voiceParsed, { color: alt })}
                    onDismiss={dismissVoice} />
                )}
                {voiceParsed.panel?.match && voiceParsed.panel?.confidence >= 0.85 && (!voiceParsed.color?.match || voiceParsed.color?.confidence >= 0.85) && (
                  <div style={{ marginTop: 6 }}>
                    <div style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>
                      {[voiceParsed.panel.match, voiceParsed.gauge && `${voiceParsed.gauge}ga`, voiceParsed.color?.match,
                        voiceParsed.surface, voiceParsed.pieces && `${voiceParsed.pieces}pcs`,
                        voiceParsed.feet && `${voiceParsed.feet}'${voiceParsed.inches ? voiceParsed.inches + '"' : ""}`
                      ].filter(Boolean).join(" / ")}
                    </div>
                    <button onClick={() => applyPanelVoice(voiceParsed)} style={styles.voiceConfirmAccept}>Apply All</button>
                  </div>
                )}
              </div>
            )}
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
                <div style={styles.voiceBar}>
                  <MicButton listening={voice.listening && voiceMode === "trim"} onClick={voice.listening ? voice.stopListening : startTrimVoice} />
                  <span style={styles.voiceTranscript}>
                    {voice.listening && voiceMode === "trim" ? "Listening... say a trim piece name" : voice.transcript && voiceMode === "trim" ? `"${voice.transcript}"` : "Tap mic to add trim by voice"}
                  </span>
                </div>
                {voiceParsed?.type === "trim" && (
                  <VoiceConfirm label="Trim Piece" match={voiceParsed.trim.match} confidence={voiceParsed.trim.confidence}
                    alternatives={voiceParsed.trim.alternatives} spokenText={voiceParsed.raw} category="trim"
                    onAccept={(t) => applyTrimVoice(t)}
                    onPickAlt={(alt) => applyTrimVoice(alt)}
                    onDismiss={dismissVoice} />
                )}
                <Checkbox label={`Same color as panel (${firstComplete?.color || "none"})`} checked={sameColorTrim} onChange={setSameColorTrim} />
                {!sameColorTrim && <Picker label="Trim Color" options={trimColorOptions} value={trimColor} onChange={setTrimColor} placeholder="Select trim color..." />}
                <div style={styles.divider} />
                <label style={styles.label}>Select Trim Pieces</label>
                <p style={styles.trimNote}>All trim defaults to standard 10' 6" length. Adjust feet/inches only if a different length is needed.</p>
                <div style={styles.trimGrid}>
                  {availableTrim.map((t) => {
                    const selected = trimItems.find((i) => i.name === t);
                    const imgUrl = getTrimImage(t, allTrimCategories);
                    const showPitch = selected && trimNeedsPitch(t, allTrimCategories);
                    const showTransition = selected && trimNeedsTransitionPitch(t);
                    const showCleated = selected && trimNeedsCleated(t, allTrimCategories);
                    return (
                      <div key={t}>
                        <div style={{ ...styles.trimChip, ...(selected ? styles.trimChipActive : {}) }} onClick={() => toggleTrim(t)}>
                          <span style={styles.trimCheck}>{selected ? "✓" : ""}</span>
                          {imgUrl && <img src={imgUrl} alt={t} style={styles.trimThumb} onError={(e) => { e.target.style.display = "none"; }} />}
                          <span style={{ flex: 1 }}>{t}</span>
                        </div>
                        {selected && (
                          <div style={styles.trimDetailWrap}>
                            <div style={styles.trimDetail}>
                              <div style={{ flex: "0 0 60px" }}><NumberPad label="Qty" value={selected.qty} onChange={(v) => updateTrimItem(t, "qty", v)} /></div>
                              <div style={{ flex: 1 }}><Picker label="Ft" options={FEET_OPTIONS} value={selected.feet} onChange={(v) => updateTrimItem(t, "feet", v)} placeholder="Ft" /></div>
                              <div style={{ flex: 1 }}><Picker label="In" options={INCHES_OPTIONS} value={selected.inches} onChange={(v) => updateTrimItem(t, "inches", v)} placeholder="In" /></div>
                            </div>
                            {showPitch && (
                              <div style={styles.trimExtraRow}>
                                <div style={{ flex: 1 }}>
                                  <Picker label={showTransition ? "From Pitch" : "Pitch"} options={PITCH_OPTIONS} value={selected.pitch} onChange={(v) => updateTrimItem(t, "pitch", v)} placeholder="Select pitch..." />
                                </div>
                                {showTransition && (
                                  <div style={{ flex: 1 }}>
                                    <Picker label="To Pitch" options={PITCH_OPTIONS} value={selected.pitchTo} onChange={(v) => updateTrimItem(t, "pitchTo", v)} placeholder="Select pitch..." />
                                  </div>
                                )}
                              </div>
                            )}
                            {showCleated && (
                              <div style={styles.trimExtraRow}>
                                <Checkbox label="Cleated valley" checked={selected.cleated} onChange={(v) => updateTrimItem(t, "cleated", v)} />
                              </div>
                            )}
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
                  {pipeBootEntries.map((b, idx) => (
                    <div key={b.id} style={styles.pipeBootCard}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e", flex: 1 }}>Boot {idx + 1}</span>
                        {pipeBootEntries.length > 1 && (
                          <button style={styles.panelCardRemove} onClick={() => setPipeBootEntries(prev => prev.filter(x => x.id !== b.id))}>✕</button>
                        )}
                      </div>
                      <Picker label="Size" options={PIPE_BOOT_SIZES} value={b.size} onChange={(v) => setPipeBootEntries(prev => prev.map(x => x.id === b.id ? { ...x, size: v } : x))} placeholder="Select size..." />
                      <NumberPad label="Qty" value={b.qty} onChange={(v) => setPipeBootEntries(prev => prev.map(x => x.id === b.id ? { ...x, qty: v } : x))} />
                    </div>
                  ))}
                  <button style={{ ...styles.addPanelBtn, marginTop: 4, padding: "10px", fontSize: 13 }}
                    onClick={() => setPipeBootEntries(prev => [...prev, { id: Date.now(), size: prev[prev.length - 1]?.size || "", qty: 0 }])}>
                    <span style={{ ...styles.addPanelIcon, width: 22, height: 22, fontSize: 15 }}>+</span> Add Another Size
                  </button>
                </div>
              )}
              <Checkbox label="Rivets" checked={rivets} onChange={setRivets} />
              {rivets && (
                <div style={styles.accSubSection}>
                  <Picker label="Rivet Color" options={RIVET_COLORS} value={rivetColor} onChange={setRivetColor} placeholder="Select color..." />
                  <NumberPad label="Quantity" value={rivetQty} onChange={setRivetQty} />
                </div>
              )}
              <div style={styles.divider} />
              <Checkbox label={hasExposed && hasHidden ? "Ridge Vent (FlexPro + Snap Z)" : hasExposed ? "Ridge Vent (FlexPro)" : hasHidden ? "Ridge Vent (Snap Z)" : "Ridge Vent"} checked={ridgeVent} onChange={setRidgeVent} />
              {ridgeVent && (
                <div style={styles.accSubSection}>
                  {hasExposed && (
                    <NumberPad label="FlexPro - Linear Feet" value={flexProQty} onChange={setFlexProQty} />
                  )}
                  {hasHidden && (
                    <NumberPad label="Snap Z - Linear Feet" value={snapZQty} onChange={setSnapZQty} />
                  )}
                  {!hasExposed && !hasHidden && (
                    <p style={{ fontSize: 12, color: "#999", fontStyle: "italic" }}>Select a panel first to determine vent type</p>
                  )}
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
              {ridgeVent && (
                <div style={styles.summaryRow}><span>Ridge Vent:</span><strong>
                  {[hasExposed && flexProQty > 0 && `FlexPro ${flexProQty}LF`, hasHidden && snapZQty > 0 && `SnapZ ${snapZQty}LF`].filter(Boolean).join(", ")}
                </strong></div>
              )}
              <div style={styles.summaryRow}><span>Accessories:</span><strong>
                {[closureStrips&&"Closure",screws&&"Screws",solarSeal&&"Solar Seal",butylTape&&"Butyl",
                  ...(pipeBoots ? pipeBootEntries.filter(b=>b.size&&b.qty>0).map(b=>`Boot ${b.size}(${b.qty})`) : []),
                  rivets&&`Rivets(${rivetQty})`].filter(Boolean).join(", ")||"None"}
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
  newOrderBtn: { padding:"6px 12px",borderRadius:6,border:"1px solid rgba(255,255,255,0.3)",background:"rgba(255,255,255,0.1)",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",letterSpacing:0.5,fontFamily:"inherit" },
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
  trimNote: { fontSize:12,color:"#888",fontStyle:"italic",margin:"-2px 0 10px",lineHeight:1.4 },
  trimThumb: { width:44,height:44,objectFit:"contain",borderRadius:4,background:"#f5f5f0",flexShrink:0,border:"1px solid #eee" },
  trimDetail: { display:"flex",gap:8,padding:"8px 12px",background:"#fef5f4",borderLeft:"2px solid #e74c3c",borderRight:"2px solid #e74c3c" },
  trimDetailWrap: { marginTop:-2,borderLeft:"2px solid #e74c3c",borderRight:"2px solid #e74c3c",borderBottom:"2px solid #e74c3c",borderRadius:"0 0 8px 8px",background:"#fef5f4",overflow:"hidden" },
  trimExtraRow: { display:"flex",gap:8,padding:"4px 12px 10px" },
  accGrid: { display:"flex",flexDirection:"column",gap:2 },
  accSubSection: { paddingLeft:36,paddingBottom:8 },
  pipeBootCard: { background:"#fff",border:"1px solid #e0e0dc",borderRadius:8,padding:10,marginBottom:8 },
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
  // Voice
  micBtn: { width:36,height:36,borderRadius:"50%",border:"2px solid #ddd",background:"#fff",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0 },
  micBtnActive: { borderColor:"#e74c3c",background:"#fef5f4",animation:"pulse 1s infinite" },
  voiceConfirm: { background:"#fffbf0",border:"2px solid #f0c040",borderRadius:10,padding:12,marginBottom:12 },
  voiceConfirmHeader: { display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6 },
  voiceConfirmX: { background:"none",border:"none",fontSize:14,color:"#999",cursor:"pointer",padding:4 },
  voiceConfirmAccept: { padding:"4px 12px",borderRadius:6,border:"none",background:"#27ae60",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",marginLeft:8 },
  voiceConfirmAlt: { padding:"4px 10px",borderRadius:6,border:"1px solid #ddd",background:"#fff",fontSize:12,cursor:"pointer",marginRight:4,marginTop:4 },
  voiceBar: { display:"flex",alignItems:"center",gap:8,padding:"8px 0",marginBottom:8 },
  voiceTranscript: { flex:1,fontSize:12,color:"#888",fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" },
};
