// Dimension 1: what "sustainable" means for a garment or brand, and how the
// people who grade brands actually do it.

export const LENSES = [
  {
    id: "climate", name: "Climate", color: "moss", icon: "cloud",
    tagline: "Greenhouse gases from fibre to landfill.",
    stat: { value: "2–8%", label: "of global greenhouse-gas emissions come from textiles, depending on the estimate", cite: "unep2023" },
    body: [
      { t: "Most of a garment's climate footprint happens before it is sewn: growing or extruding the fibre, spinning, knitting or weaving, and especially dyeing and finishing, which burn coal or gas to heat water.", c: "mckinsey2020" },
      { t: "Estimates range from ~4% (McKinsey/GFA, 2.1 billion tonnes in 2018) to ~8% (Quantis) of global emissions. The spread comes from what is counted: footwear, consumer washing, and international shipping are included in some studies and not others.", c: "quantis2018" },
      { t: "For a brand, the honest signal is a science-based target covering Scope 3 (the supply chain), plus published progress. A brand that only reports emissions from its own offices and stores is reporting a sliver.", c: "fti2023" },
    ],
    lookFor: ["Scope 3 target verified by SBTi", "Renewable energy at tier-2 mills, not just HQ", "Absolute reductions, not per-unit"],
  },
  {
    id: "water", name: "Water & chemicals", color: "sky", icon: "drop",
    tagline: "Irrigation, dye-houses and what runs off.",
    stat: { value: "~2,700 L", label: "of water to grow and process the cotton in one t-shirt", cite: "wwf2013" },
    body: [
      { t: "Water impact has two faces. Growing cotton in dry regions draws on rivers and aquifers; the global average footprint of cotton lint is on the order of 10,000 litres per kilo, though rain-fed cotton uses almost no irrigation water.", c: "chapagain2006" },
      { t: "The second face is pollution: wet processing (dyeing, printing, finishing) uses thousands of chemicals, and untreated effluent from mills is a major source of industrial water pollution in producing regions.", c: "cm2017" },
      { t: "Chemistry-first schemes such as bluesign, OEKO-TEX MADE IN GREEN and ZDHC's Manufacturing Restricted Substances List exist because the harmful step is at the mill, not on the finished shirt.", c: "bluesign" },
    ],
    lookFor: ["ZDHC or bluesign at wet-processing suppliers", "Wastewater test results published", "Rain-fed or drip-irrigated cotton"],
  },
  {
    id: "materials", name: "Materials & waste", color: "plum", icon: "loop",
    tagline: "What things are made of, and where they end up.",
    stat: { value: "<1%", label: "of clothing is recycled into new clothing", cite: "emf2017" },
    body: [
      { t: "Clothing production roughly doubled between 2000 and 2015 while the number of times a garment is worn fell by ~36%. The equivalent of one garbage truck of textiles is landfilled or burned every second.", c: "emf2017" },
      { t: "Polyester is now over half of all fibre produced (54% in 2022, ~59% by 2024). Recycled polyester is mostly made from plastic bottles, not old clothes, and cannot yet be recycled again at scale.", c: "te2023" },
      { t: "Circularity means designing for durability and repair first, then resale and take-back, and only lastly recycling. A recycling programme without production cuts is a pressure valve, not a solution.", c: "eu2022" },
    ],
    lookFor: ["Published production volumes", "Repair service and spare parts", "Mono-material designs that can be recycled"],
  },
  {
    id: "people", name: "People", color: "clay", icon: "people",
    tagline: "Wages, hours, safety and the right to organise.",
    stat: { value: "99%", label: "of major brands don't disclose how many supply-chain workers earn a living wage", cite: "fti2023" },
    body: [
      { t: "Roughly 75 million people work in textiles, clothing and footwear, most of them women. Wages in the main sourcing countries are often half of a living wage or less, and overtime is structural.", c: "ilo" },
      { t: "The Rana Plaza collapse in 2013 killed ~1,134 people and led to the legally binding Bangladesh Accord on fire and building safety. Brands that signed the Accord and its successor (the International Accord) took on enforceable obligations; many did not sign.", c: "ccc2020" },
      { t: "Audits alone don't fix wages. Look for published supplier lists down to tier 2, purchasing practices that don't squeeze factories, and a credible living-wage benchmark with numbers attached.", c: "ccc2020" },
    ],
    lookFor: ["Supplier list with addresses (tier 1 and 2)", "Fair Wear Foundation or Fair Trade certified factories", "Signatory to the International Accord"],
  },
  {
    id: "animals", name: "Animals", color: "ochre", icon: "paw",
    tagline: "Wool, leather, down, silk and their standards.",
    stat: { value: "RWS · RDS · LWG", label: "the three certifications that cover most animal-derived fibres", cite: "goy" },
    body: [
      { t: "Animal fibres are not automatically worse or better. Wool is renewable and biodegradable but carries land and methane impacts and welfare concerns such as mulesing; leather is mostly a by-product of the meat industry, so its footprint depends on how you allocate the cow.", c: "leatherpanel" },
      { t: "Standards worth knowing: Responsible Wool Standard (RWS) and Responsible Mohair Standard, Responsible Down Standard (RDS), Leather Working Group (LWG) for tannery chemistry and traceability, and Fur Free Retailer.", c: "goy" },
      { t: "'Vegan leather' is usually polyurethane or PVC plastic. It avoids animal use but is fossil-based and not biodegradable; newer plant-based options (mycelium, cactus, apple) are typically blends with plastic binders.", c: "cm2021" },
    ],
    lookFor: ["RWS / RDS / LWG certificates", "Mulesing-free wool policy", "No angora, no exotic skins, no fur"],
  },
  {
    id: "transparency", name: "Transparency", color: "ochre", icon: "eye",
    tagline: "You can't verify what a brand won't publish.",
    stat: { value: "26%", label: "average Fashion Transparency Index score across the 250 largest brands (2023)", cite: "fti2023" },
    body: [
      { t: "Transparency is not the same as sustainability, but it is the precondition for checking any claim. Fashion Revolution scored 250 brands on 258 disclosure indicators; the average was 26% and 28% of brands scored 0–10%.", c: "fti2023" },
      { t: "Just over half of big brands now publish their tier-1 factory list, but very few publish the mills, dye-houses or farms further upstream where most of the impact sits.", c: "fti2023" },
      { t: "Regulation is catching up: the EU's textile strategy will require Digital Product Passports and bans the destruction of unsold clothing; the EU and UK have also moved against unsubstantiated green claims.", c: "eu2022" },
    ],
    lookFor: ["Supplier list down to raw materials", "Annual impact report with third-party assurance", "Production volumes and unsold-stock policy"],
  },
];

export const HEADLINE_STATS = [
  { value: 116, suffix: "Mt", label: "of fibre produced in 2022, a record. Polyester was 54% of it.", cite: "te2023" },
  { value: 36, suffix: "%", prefix: "−", label: "drop in how often a garment is worn, 2000–2015", cite: "emf2017" },
  { value: 1, suffix: " truck/sec", label: "of textiles landfilled or burned, every second", cite: "emf2017" },
  { value: 35, suffix: "%", label: "of primary ocean microplastics come from washing synthetic clothes", cite: "iucn2017" },
  { value: 30, suffix: "%", prefix: "20–", label: "smaller carbon, water and waste footprints if clothes are worn 9 months longer", cite: "wrap2017" },
  { value: 59, suffix: "%", label: "of brands' green claims broke UK guidance in a 2021 review", cite: "cm2021" },
];

export const RATERS = [
  {
    id: "goy", name: "Good On You", org: "Good On You (Australia)", kind: "Consumer rating app",
    scale: "5 bands: We Avoid · Not Good Enough · It's a Start · Good · Great",
    measures: "People (wages, audits, transparency), Planet (materials, emissions, water, chemicals, waste) and Animals (fibres used and policies).",
    how: "Analysts compile 1,000+ data points from a brand's own public disclosures, certifications (GOTS, Fair Trade, B Corp, RWS...) and third-party indices such as the Fashion Transparency Index and CDP. Brands are not paid to be rated, and a brand that discloses nothing scores as if it does nothing.",
    strengths: ["Free and consumer-facing; covers 6,000+ brands", "Rewards evidence over marketing", "Sub-scores let you weight what you care about"],
    limits: ["Relies on published data, so small brands with little disclosure can rank low", "Bands are coarse; two 'Good' brands can differ a lot", "Affiliate links to rated brands are a perceived conflict"],
    cite: "goy",
  },
  {
    id: "fti", name: "Fashion Transparency Index", org: "Fashion Revolution (UK)", kind: "Disclosure index, 2017–2023",
    scale: "0–100% across 258 indicators; 2023 average 26%",
    measures: "Whether the 250 largest brands publish policies, governance, traceability (supplier lists), know-show-fix processes, and data on wages, purchasing practices, overproduction, climate and chemicals.",
    how: "A points-based review of what is publicly available; brands are invited to point to disclosures. Scores measure openness, not performance: a brand can be transparent about doing badly.",
    strengths: ["Comparable year on year", "Pushed tier-1 supplier list publication from 12% (2017) to 52% (2023)", "Free, detailed methodology"],
    limits: ["Disclosure ≠ impact", "Only the largest brands", "Final edition was 2023; Fashion Revolution now publishes 'What Fuels Fashion' on energy"],
    cite: "fti2023",
  },
  {
    id: "higg", name: "Higg Index", org: "Cascale (formerly Sustainable Apparel Coalition)", kind: "Industry self-assessment tools",
    scale: "Module scores, not a public grade",
    measures: "MSI scores materials per kg on climate, water, eutrophication, chemistry and resource use. FEM and FSLM score factories on environment and labour. BRM scores the brand.",
    how: "Facilities self-report annually into the Worldly platform, with optional third-party verification. Brands then benchmark suppliers. Data is mostly private to members.",
    strengths: ["Used by 300+ companies to compare suppliers", "Facility-level environmental data at scale", "Common language across the industry"],
    limits: ["MSI is cradle-to-gate: it ignores durability, microfibres and end-of-life, which made polyester look better than silk or wool", "Norway's consumer authority ruled in 2022 that MSI-based marketing could mislead; consumer use was paused", "Self-reported unless verified"],
    cite: "higg",
  },
  {
    id: "bcorp", name: "B Corp", org: "B Lab (global non-profit)", kind: "Whole-company certification",
    scale: "80+ of 200 points on the B Impact Assessment, recertified every 3 years",
    measures: "Governance, workers, community, environment and customers. It certifies the company, not the product.",
    how: "Companies self-assess, B Lab verifies a sample with documentation, and the company must amend its legal articles to consider all stakeholders. Scores are public.",
    strengths: ["Legal accountability baked in", "Public score and report", "Covers pay ratios and governance, which fashion-specific ratings skip"],
    limits: ["Points can be earned in areas unrelated to the supply chain", "Large companies with contested practices have certified; B Lab tightened standards in 2025", "Product-level sustainability is barely tested"],
    cite: "bcorp",
  },
  {
    id: "remake", name: "Fashion Accountability Report", org: "Remake (US advocacy group)", kind: "Annual accountability scoring",
    scale: "0–150 points; most companies under 50",
    measures: "Traceability, wages and wellbeing, commercial practices (overproduction), raw materials, environmental justice, and governance (executive pay, lobbying).",
    how: "Desk research on public evidence with strict scoring: commitments earn little, verified action earns more, and negative points are given for harm.",
    strengths: ["Harsh on greenwashing", "Includes governance and lobbying", "Assesses luxury, fast fashion and 'sustainable' brands with one rubric"],
    limits: ["Only ~50 large companies", "Advocacy organisation, so critics call it activist", "Scores are hard to compare with other ratings"],
    cite: "remake2024",
  },
  {
    id: "certs", name: "Product certifications", org: "GOTS, OEKO-TEX, Fair Trade, bluesign, RWS, FSC...", kind: "Third-party verified claims on a specific input or product",
    scale: "Pass/fail against a standard; look for the licence number",
    measures: "Each covers a slice: organic fibre and chemistry (GOTS), harmful residues in the finished item (OEKO-TEX 100), worker premiums (Fair Trade), mill chemistry (bluesign), animal welfare (RWS/RDS), forest sourcing (FSC).",
    how: "An accredited certifier audits farms, mills or factories. Certificates are searchable in public databases, so a claim can be checked.",
    strengths: ["Verifiable and specific", "Traceable through the chain (GOTS, RWS use transaction certificates)", "Independent of the brand"],
    limits: ["A certification on one input says nothing about the rest of the garment or the company", "Cost excludes small producers", "Logos are easy to imitate; check the licence number"],
    cite: "gots",
  },
];

export const CERTS = [
  { id: "gots", name: "GOTS", full: "Global Organic Textile Standard", covers: ["organic fibre", "chemistry", "wastewater", "labour"], what: "At least 70% certified organic fibre (95% for 'organic' grade), restricted chemical inputs, wastewater treatment and ILO-based social criteria at every processing stage.", caveat: "Check the licence number on global-standard.org. 'Made with organic cotton' without GOTS may mean 5% organic.", cite: "gots" },
  { id: "oekotex", name: "OEKO-TEX Standard 100", full: "OEKO-TEX STANDARD 100", covers: ["harmful residues"], what: "The finished textile is lab-tested against a list of harmful substances (formaldehyde, heavy metals, azo dyes, PFAS...). Common on bedding, underwear and babywear.", caveat: "Says the product is safe to wear, not that it was made cleanly. MADE IN GREEN adds facility conditions.", cite: "oekotex" },
  { id: "fairtrade", name: "Fair Trade Certified", full: "Fair Trade USA (factories) / Fairtrade (cotton)", covers: ["wages", "premium", "labour"], what: "Audited labour conditions plus a premium paid into a fund that workers vote on how to spend.", caveat: "Applies to the certified factory or cotton, which may be one of many in a brand's chain.", cite: "fairtrade" },
  { id: "bluesign", name: "bluesign", full: "bluesign SYSTEM / PRODUCT", covers: ["chemistry", "water", "energy"], what: "Approves chemicals and processes at the mill before they enter production; common in outdoor and performance fabrics.", caveat: "Strong on chemistry, silent on labour and materials choice.", cite: "bluesign" },
  { id: "rws", name: "RWS / RDS", full: "Responsible Wool / Down Standard (Textile Exchange)", covers: ["animal welfare", "land"], what: "Farm-level animal welfare (no mulesing for RWS, no live-plucking or force-feeding for RDS) and chain-of-custody so the fibre can be traced.", caveat: "Welfare floor rather than ceiling; covers the fibre, not the garment's other inputs.", cite: "goy" },
  { id: "lwg", name: "LWG", full: "Leather Working Group", covers: ["tannery chemistry", "traceability"], what: "Audits tanneries on water, energy, chemicals and traceability; Gold/Silver/Bronze ratings.", caveat: "Does not address cattle-raising or deforestation upstream, which is most of leather's footprint.", cite: "leatherpanel" },
  { id: "fsc", name: "FSC / Canopy", full: "Forest Stewardship Council; CanopyStyle", covers: ["forests"], what: "For viscose, modal and lyocell: the wood pulp comes from responsibly managed forests, not ancient or endangered ones.", caveat: "Look for a named fibre (TENCEL, ECOVERO, Naia) rather than generic 'viscose'.", cite: "canopy" },
  { id: "bcorp", name: "B Corp", full: "Certified B Corporation", covers: ["company-wide", "governance"], what: "Whole-company assessment across workers, community, environment and governance; legal duty to stakeholders.", caveat: "A company score, not a product one; look up the public B Impact Report for the breakdown.", cite: "bcorp" },
  { id: "fwf", name: "Fair Wear", full: "Fair Wear Foundation member", covers: ["labour", "purchasing practices"], what: "Brands are audited annually on how they source, with public Brand Performance Checks and a worker complaints hotline.", caveat: "Membership is a commitment to improve, not a guarantee of living wages today; read the check.", cite: "fwf" },
];

export const GREENWASH = [
  { claim: "\"Conscious collection\"", verdict: "red", why: "A sub-line with a green name lets the main range stay unchanged. In 2021 H&M's Conscious range contained more synthetics (72%) than its main range (61%); the range was later dropped after regulatory pressure.", cite: "cm2021" },
  { claim: "\"Made with recycled polyester\"", verdict: "amber", why: "Usually bottle-to-fibre: it diverts bottles from one recycling loop into a fibre that is not recyclable again and still sheds microplastics. Ask the percentage and whether it is certified (GRS/RCS).", cite: "te2023" },
  { claim: "\"Carbon neutral\"", verdict: "red", why: "Almost always means offsets were bought, not that emissions fell. Since 2026 the EU bans generic offset-based neutrality claims on products. Look for absolute Scope 3 reductions instead.", cite: "eu2022" },
  { claim: "\"Vegan leather\"", verdict: "amber", why: "Avoids animal use, which matters to many people, but is typically polyurethane or PVC: fossil-based, short-lived and not biodegradable. The word 'vegan' does the work of 'plastic'.", cite: "cm2021" },
  { claim: "\"GOTS certified organic cotton, licence no. 12345\"", verdict: "green", why: "Specific, third-party verified, checkable in a public database, and the standard covers chemistry and labour, not just the fibre.", cite: "gots" },
  { claim: "\"Natural fibres\"", verdict: "amber", why: "Cotton and viscose are natural or nature-derived, and both can be very high impact depending on how they are grown and processed. 'Natural' describes the origin, not the footprint.", cite: "chapagain2006" },
  { claim: "\"We publish our full supplier list, including mills and dye-houses\"", verdict: "green", why: "Tier-2 and tier-3 disclosure is rare (most brands stop at final assembly) and it lets journalists and NGOs verify claims.", cite: "fti2023" },
  { claim: "\"Sustainable\" with no detail", verdict: "red", why: "Regulators in the EU and UK treat vague environmental claims without evidence as misleading. A 2021 EU sweep found 42% of green claims exaggerated, false or deceptive.", cite: "ec2021" },
  { claim: "\"Our jeans use 96% less water\"", verdict: "amber", why: "Compared to what, at which stage? Finishing-stage savings are real but small next to cotton growing and consumer washing. Ask for the whole-life number.", cite: "levi2015" },
  { claim: "\"Take-back: bring old clothes, get 15% off\"", verdict: "amber", why: "Collected clothes are mostly downcycled or exported; less than 1% becomes new clothing. A discount that drives new purchases can increase total volume.", cite: "emf2017" },
];

// The rubric behind the "Grade a brand" exercise. Weights sum to 100.
export const GRADE_QUESTIONS = [
  { id: "tier1", lens: "transparency", w: 10, q: "Publishes a list of its final-assembly (tier 1) factories with addresses" },
  { id: "tier2", lens: "transparency", w: 10, q: "Publishes mills, dye-houses or farms further upstream (tier 2+)" },
  { id: "wage", lens: "people", w: 12, q: "Names a living-wage benchmark and reports how many workers reach it" },
  { id: "accord", lens: "people", w: 8, q: "Signatory to the International Accord, Fair Wear member or Fair Trade factories" },
  { id: "sbt", lens: "climate", w: 10, q: "Has a science-based climate target that covers the supply chain (Scope 3)" },
  { id: "chem", lens: "water", w: 8, q: "Requires ZDHC, bluesign or equivalent chemistry at wet-processing suppliers" },
  { id: "pref", lens: "materials", w: 10, q: "Over half of materials are certified preferred fibres (organic, recycled, RWS, FSC lyocell)" },
  { id: "volume", lens: "materials", w: 8, q: "Discloses annual production volumes and what happens to unsold stock" },
  { id: "repair", lens: "materials", w: 8, q: "Offers repair, spare parts or a resale/take-back programme with published results" },
  { id: "animal", lens: "animals", w: 6, q: "Has an animal-welfare policy (no fur, angora, exotic skins; RWS/RDS where used)" },
  { id: "assured", lens: "transparency", w: 10, q: "Impact report is third-party assured, with numbers rather than pledges" },
];
