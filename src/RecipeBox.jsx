import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* Mimi's Recipe Box — Pantry · Test Kitchen · Menus */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&family=Caveat:wght@500;600;700&family=Spline+Sans+Mono:wght@400;500&display=swap');
:root{--cream:#FBF3E4;--paper:#FFFCF5;--paper2:#F6EEDC;--ink:#574635;--ink-soft:#9A8567;--line:#ECE0C8;--line2:#E2D4B6;--sage:#7E9A74;--sage-deep:#5E7A55;--sage-soft:#A9BF9F;--honey:#D79B3F;--honey-deep:#B07D26;--pink:#EDA9A2;--pink-deep:#D9847F;--plum:#9C6E84;}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:var(--cream)}
.ri-root{font-family:'Inter',system-ui,sans-serif;color:var(--ink);background:var(--cream);min-height:100vh;-webkit-font-smoothing:antialiased;background-image:radial-gradient(circle at 14% -8%,rgba(169,191,159,.30),transparent 44%),radial-gradient(circle at 96% 4%,rgba(237,169,162,.24),transparent 42%)}
.ri-hand{font-family:'Caveat',cursive}
.ri-top{display:flex;align-items:center;gap:13px;flex-wrap:wrap;padding:18px 22px 12px;max-width:1180px;margin:0 auto}
.ri-railtoggle{width:42px;height:42px;border-radius:13px;border:1px solid var(--line);background:var(--paper);color:var(--ink);cursor:pointer;display:flex;align-items:center;justify-content:center;flex:0 0 auto}
.ri-railtoggle:hover{background:var(--paper2)}
.ri-brand{display:flex;align-items:center;gap:9px;font-family:'Caveat',cursive;font-weight:700;font-size:34px;line-height:1;color:var(--ink)}
.ri-brand b{color:var(--sage-deep);font-weight:700}
.ri-tag{font-family:'Caveat',cursive;font-size:18px;color:var(--pink-deep);margin-bottom:-2px}
.ri-layout{display:flex;gap:18px;max-width:1180px;margin:0 auto;padding:0 18px 80px;align-items:flex-start}
.ri-rail{position:sticky;top:14px;flex:0 0 96px;background:var(--paper);border-radius:20px;padding:10px 8px;display:flex;flex-direction:column;gap:6px;box-shadow:0 16px 36px -28px rgba(87,70,53,.5);border:1px solid rgba(120,100,70,.07);overflow:hidden;transition:flex-basis .22s ease,opacity .18s ease,padding .2s ease}
.ri-rail.closed{flex:0 0 0;width:0;padding:0;border:none;opacity:0;margin:0;pointer-events:none}
.ri-nav{display:flex;flex-direction:column;align-items:center;gap:5px;border:none;background:transparent;border-radius:15px;padding:12px 6px;cursor:pointer;color:var(--ink-soft);transition:all .15s;width:100%}
.ri-nav span{font-size:11.5px;font-weight:600}
.ri-nav:hover{background:var(--paper2);color:var(--ink)}
.ri-nav[data-on="true"]{background:var(--sage);color:#fff;box-shadow:0 8px 18px -10px var(--sage-deep)}
.ri-main{flex:1;min-width:0}
.ri-bar{background:var(--paper);border-radius:18px;padding:14px;display:flex;flex-wrap:wrap;gap:11px;align-items:center;box-shadow:0 14px 34px -28px rgba(87,70,53,.5);border:1px solid rgba(120,100,70,.07)}
.ri-search{flex:1;min-width:160px;display:flex;align-items:center;gap:9px;background:var(--paper2);border:1px solid var(--line);border-radius:13px;padding:9px 13px}
.ri-search input{border:none;background:transparent;outline:none;font-size:14px;color:var(--ink);width:100%}
.ri-search input::placeholder{color:#B4A689}
.ri-cats{display:flex;gap:6px;flex-wrap:wrap}
.ri-cat{font-size:12.5px;font-weight:500;color:var(--ink-soft);background:transparent;border:1px solid var(--line2);border-radius:30px;padding:6px 12px;cursor:pointer;transition:all .14s}
.ri-cat:hover{border-color:var(--ink-soft)}
.ri-cat[data-on="true"]{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.ri-new{margin-left:auto;font-weight:600;font-size:13.5px;color:#fff;background:var(--sage);border:none;border-radius:13px;padding:11px 18px;cursor:pointer;white-space:nowrap}
.ri-new:hover{background:var(--sage-deep)}
.ri-grid{margin-top:18px;display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:18px}
.ri-card{position:relative;background:var(--paper);border-radius:20px;cursor:pointer;overflow:hidden;box-shadow:0 14px 30px -24px rgba(87,70,53,.6);border:1px solid rgba(120,100,70,.08);transition:transform .16s,box-shadow .16s}
.ri-card:hover{transform:translateY(-4px);box-shadow:0 24px 42px -22px rgba(87,70,53,.55)}
.ri-cover{height:150px;background:var(--paper2) center/cover no-repeat;display:flex;align-items:center;justify-content:center;color:#D6C7A6}
.ri-card-body{padding:14px 16px 17px;position:relative}
.ri-card-cat{font-family:'Spline Sans Mono',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase}
.ri-card-title{font-family:'Fraunces',serif;font-weight:600;font-size:21px;line-height:1.12;margin:5px 0 0;letter-spacing:-.01em}
.ri-card-meta{font-size:11.5px;color:var(--ink-soft);margin-top:9px;display:flex;gap:7px;flex-wrap:wrap;align-items:center}
.ri-dot{color:var(--line2)}
.ri-flag{position:absolute;top:12px;right:12px;font-family:'Spline Sans Mono',monospace;font-size:9px;letter-spacing:.06em;text-transform:uppercase;color:var(--honey-deep);background:#FBF0D6;border:1px solid #EBD7A4;border-radius:20px;padding:3px 8px;z-index:2}
.ri-ribbon{display:inline-flex;align-items:center;gap:5px;font-family:'Caveat',cursive;font-size:16px;font-weight:600;padding:1px 11px 2px;border-radius:4px 13px 4px 13px;color:#fff;line-height:1.3}
.ri-build{display:flex;align-items:center;gap:8px;margin-top:10px;flex-wrap:wrap}
.ri-vtag{font-family:'Spline Sans Mono',monospace;font-size:10.5px;color:var(--sage-deep);background:#E9EFE2;border:1px solid #CFDCC0;border-radius:7px;padding:2px 7px}
.ri-score{font-family:'Spline Sans Mono',monospace;font-size:10.5px;color:var(--ink-soft)}
.ri-empty{background:var(--paper);border-radius:20px;padding:58px 28px;text-align:center;margin-top:18px;border:1px solid rgba(120,100,70,.08)}
.ri-empty h3{font-family:'Fraunces',serif;font-weight:600;font-size:25px;margin:12px 0 8px}
.ri-empty p{color:var(--ink-soft);font-size:14.5px;max-width:400px;margin:0 auto 22px;line-height:1.55}
.ri-overlay{position:fixed;inset:0;background:rgba(70,55,40,.5);backdrop-filter:blur(3px);display:flex;justify-content:center;align-items:flex-start;padding:24px 14px;z-index:50;overflow-y:auto}
.ri-sheet{background:var(--paper);width:100%;max-width:620px;border-radius:22px;box-shadow:0 40px 90px -30px rgba(40,30,20,.7);overflow:hidden}
.ri-sheet.wide{max-width:880px}
.ri-sheet-head{display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid var(--line)}
.ri-sheet-head h2{font-family:'Fraunces',serif;font-weight:600;font-size:21px;margin:0;display:flex;align-items:center;gap:9px}
.ri-x{background:var(--paper2);border:none;width:33px;height:33px;border-radius:11px;cursor:pointer;font-size:18px;color:var(--ink-soft);line-height:1}
.ri-x:hover{background:var(--line)}
.ri-sheet-body{padding:22px;max-height:70vh;overflow-y:auto}
.ri-field{margin-bottom:16px}
.ri-label{display:block;font-family:'Spline Sans Mono',monospace;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-soft);margin-bottom:7px}
.ri-help{text-transform:none;letter-spacing:0;color:#B0A286}
.ri-input,.ri-area,.ri-select{width:100%;font-family:'Inter',sans-serif;font-size:14px;color:var(--ink);background:var(--paper2);border:1px solid var(--line);border-radius:13px;padding:10px 12px;outline:none;transition:border .14s}
.ri-input:focus,.ri-area:focus,.ri-select:focus{border-color:var(--sage)}
.ri-area{resize:vertical;min-height:84px;line-height:1.5}
.ri-row{display:flex;gap:12px}.ri-row>.ri-field{flex:1}
.ri-verdicts{display:flex;gap:8px}
.ri-vbtn{flex:1;font-size:12.5px;font-weight:500;padding:10px 6px;border-radius:12px;border:1.5px solid var(--line2);background:var(--paper2);color:var(--ink-soft);cursor:pointer;transition:all .14s;text-align:center}
.ri-vbtn[data-on="true"]{background:#fff}
.ri-rate{display:flex;align-items:center;gap:12px;margin-bottom:9px}
.ri-rate-name{font-size:13px;color:var(--ink-soft);width:74px}
.ri-pips{display:flex;gap:5px}
.ri-pip{width:17px;height:17px;border-radius:50%;border:1.5px solid var(--sage-soft);background:transparent;cursor:pointer;padding:0;transition:all .12s}
.ri-pip[data-on="true"]{background:var(--sage);border-color:var(--sage-deep)}
.ri-pip.read{cursor:default}
.ri-photo-row{display:flex;align-items:center;gap:12px}
.ri-thumb{width:62px;height:62px;border-radius:13px;background:var(--paper2) center/cover;display:flex;align-items:center;justify-content:center;color:#D6C7A6;flex-shrink:0;border:1px solid var(--line)}
.ri-filebtn{font-size:13px;font-weight:500;color:var(--sage-deep);background:transparent;border:1px solid var(--line2);border-radius:10px;padding:8px 12px;cursor:pointer}
.ri-filebtn:hover{border-color:var(--sage)}
.ri-sheet-foot{display:flex;gap:10px;padding:16px 22px;border-top:1px solid var(--line);background:var(--paper2);flex-wrap:wrap}
.ri-primary{font-weight:600;font-size:14px;color:#fff;background:var(--sage);border:none;border-radius:13px;padding:11px 20px;cursor:pointer}
.ri-primary:hover{background:var(--sage-deep)}
.ri-primary:disabled{opacity:.5;cursor:not-allowed}
.ri-ghost{font-weight:500;font-size:14px;color:var(--ink-soft);background:transparent;border:none;border-radius:13px;padding:11px 14px;cursor:pointer}
.ri-ghost:hover{color:var(--ink)}
.ri-del{margin-left:auto;color:var(--pink-deep)}
.ri-hero{height:210px;background:var(--paper2) center/cover no-repeat;display:flex;align-items:center;justify-content:center;color:#D6C7A6}
.ri-det-body{padding:24px}
.ri-det-title{font-family:'Fraunces',serif;font-weight:600;font-size:30px;line-height:1.08;margin:6px 0 0;letter-spacing:-.01em}
.ri-det-meta{font-size:12.5px;color:var(--ink-soft);margin-top:11px;display:flex;gap:9px;flex-wrap:wrap;align-items:center}
.ri-det-sec{margin-top:24px}
.ri-det-sec h4{font-family:'Spline Sans Mono',monospace;font-size:10.5px;letter-spacing:.13em;text-transform:uppercase;color:var(--honey-deep);margin:0 0 11px;padding-bottom:8px;border-bottom:1px solid var(--line)}
.ri-ing li{font-size:14.5px;line-height:1.75;list-style:none;padding-left:18px;position:relative}
.ri-ing li:before{content:"";position:absolute;left:2px;top:11px;width:5px;height:5px;border-radius:50%;background:var(--sage)}
.ri-steps li{font-size:14.5px;line-height:1.62;margin-bottom:13px;padding-left:34px;position:relative;list-style:none}
.ri-steps li .n{position:absolute;left:0;top:-1px;font-family:'Fraunces',serif;font-weight:600;font-size:18px;color:var(--honey-deep)}
.ri-note{background:var(--paper2);border-left:3px solid var(--honey);border-radius:0 13px 13px 0;padding:13px 15px;font-size:14px;line-height:1.6;color:#5C4E3A}
.ri-seg{display:inline-flex;border:1px solid var(--line2);border-radius:11px;overflow:hidden}
.ri-seg button{font-family:'Spline Sans Mono',monospace;font-size:10px;text-transform:uppercase;border:none;background:transparent;color:var(--ink-soft);padding:6px 10px;cursor:pointer;transition:all .14s}
.ri-seg button[data-on="true"]{background:var(--sage);color:#fff}
.ri-serv{display:flex;align-items:center;gap:10px;margin:2px 0 14px;flex-wrap:wrap}
.ri-serv .lbl{font-size:12.5px;color:var(--ink-soft)}
.ri-stepper{display:inline-flex;align-items:center;border:1px solid var(--line2);border-radius:11px;overflow:hidden}
.ri-stepper button{width:32px;height:32px;border:none;background:var(--paper2);color:var(--ink);font-size:18px;cursor:pointer;line-height:1}
.ri-stepper button:hover{background:var(--line)}
.ri-stepper .val{min-width:88px;text-align:center;font-size:13px;font-weight:600;padding:0 8px}
.ri-scalednote{font-size:11.5px;color:var(--ink-soft);margin-top:9px;font-style:italic}
.ri-att{position:relative;padding:16px;background:var(--paper2);border-radius:15px;margin-bottom:12px;border:1px solid var(--line)}
.ri-att-top{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-bottom:9px}
.ri-att-changes{font-size:14px;line-height:1.55;color:var(--ink)}
.ri-att-changes b{font-family:'Caveat',cursive;font-size:17px;font-weight:600;color:var(--sage-deep);display:block;margin-bottom:2px}
.ri-att-scores{display:flex;gap:14px;flex-wrap:wrap;margin-top:11px}
.ri-att-scores .s{font-size:11px;color:var(--ink-soft);display:flex;align-items:center;gap:6px}
.ri-att-actions{display:flex;gap:6px;margin-left:auto}
.ri-mini{font-size:12px;font-weight:500;color:var(--ink-soft);background:#fff;border:1px solid var(--line);border-radius:10px;padding:5px 10px;cursor:pointer}
.ri-mini:hover{border-color:var(--sage)}
.ri-mini.warn{color:var(--pink-deep)}
.ri-win-tag{font-family:'Caveat',cursive;font-size:16px;font-weight:700;color:var(--sage-deep);display:inline-flex;align-items:center;gap:4px}
.ri-cmp-scroll{overflow-x:auto;padding-bottom:6px}
.ri-cmp{display:flex;gap:14px;min-width:min-content}
.ri-col{flex:0 0 220px;background:var(--paper2);border-radius:15px;border:1px solid var(--line);overflow:hidden}
.ri-col.win{border-color:var(--sage);box-shadow:0 0 0 2px rgba(126,154,116,.28)}
.ri-col-head{padding:12px 14px;background:#fff;border-bottom:1px solid var(--line)}
.ri-col-head .v{font-family:'Spline Sans Mono',monospace;font-size:11px;color:var(--sage-deep)}
.ri-col-head .d{font-size:11px;color:var(--ink-soft);margin-top:2px}
.ri-cmp-row{padding:10px 14px;border-bottom:1px solid var(--line);font-size:12.5px}
.ri-cmp-row .k{font-family:'Spline Sans Mono',monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-soft);margin-bottom:5px}
.ri-cmp-row.best{background:rgba(126,154,116,.13)}
.ri-cmp-txt{line-height:1.5;color:var(--ink)}
.ri-pick{display:flex;align-items:center;gap:7px;font-size:12.5px;color:var(--ink-soft);cursor:pointer;padding:6px 10px;border:1px solid var(--line);border-radius:10px;background:#fff;user-select:none}
.ri-pick input{accent-color:var(--sage)}
.ri-mtabs{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:16px}
.ri-mtab{font-family:'Fraunces',serif;font-weight:500;font-size:16px;color:var(--ink-soft);background:var(--paper);border:1px solid var(--line);border-radius:14px;padding:8px 15px;cursor:pointer}
.ri-mtab[data-on="true"]{background:var(--plum);color:#fff;border-color:var(--plum)}
.ri-mcard{background:var(--paper);border-radius:20px;padding:18px;box-shadow:0 14px 30px -26px rgba(87,70,53,.5);border:1px solid rgba(120,100,70,.07)}
.ri-mtitle-in{font-family:'Fraunces',serif;font-weight:600;font-size:24px;color:var(--ink);border:none;background:transparent;outline:none;width:100%;border-bottom:2px dashed var(--line2);padding:2px 0 6px;margin-bottom:4px}
.ri-addseg{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:14px 0 8px}
.ri-addseg .al{font-size:12px;color:var(--ink-soft);margin-right:2px}
.ri-addseg button{font-size:12px;font-weight:500;border:1px solid var(--line2);background:var(--paper2);color:var(--ink-soft);border-radius:9px;padding:6px 11px;cursor:pointer}
.ri-addseg button[data-on="true"]{background:var(--plum);color:#fff;border-color:var(--plum)}
.ri-pal-grid{display:flex;flex-wrap:wrap;gap:8px}
.ri-pchip{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:500;color:var(--ink);background:var(--paper2);border:1px solid var(--line);border-radius:30px;padding:7px 13px;cursor:pointer;transition:all .14s}
.ri-pchip:hover{border-color:var(--plum);color:var(--plum)}
.ri-pchip[data-in="true"]{opacity:.42;cursor:default}
.ri-pchip .plus{font-size:15px;color:var(--plum)}
.ri-msec{margin-top:16px}
.ri-msec h4{font-family:'Spline Sans Mono',monospace;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--plum);margin:0 0 8px;display:flex;align-items:center;gap:8px}
.ri-msec h4 .ct{color:var(--ink-soft)}
.ri-secdrop{border:2px dashed var(--line2);border-radius:14px;padding:8px;min-height:50px;background:var(--paper2);transition:all .15s}
.ri-secdrop.over{border-color:var(--plum);background:#F6EEF1}
.ri-secdrop-empty{color:var(--ink-soft);font-size:12.5px;text-align:center;padding:10px}
.ri-mitem{display:flex;flex-wrap:wrap;align-items:center;gap:8px;background:#fff;border:1px solid var(--line);border-radius:13px;padding:8px 10px 8px 7px;margin:7px 0;touch-action:none}
.ri-mitem.dragging{opacity:.55;border-color:var(--plum)}
.ri-handle{cursor:grab;color:var(--ink-soft);padding:4px;border-radius:8px;flex-shrink:0;display:flex;touch-action:none}
.ri-mitem-body{flex:1 1 140px;min-width:0}
.ri-mitem-title{font-family:'Fraunces',serif;font-weight:600;font-size:15.5px;line-height:1.15;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ri-mitem-actions{display:flex;align-items:center;gap:6px;margin-left:auto;flex-shrink:0}
.ri-msel{font-size:12px;border:1px solid var(--line);border-radius:8px;padding:5px 6px;background:#fff;color:var(--ink-soft);max-width:130px}
.ri-pal h5{font-family:'Spline Sans Mono',monospace;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-soft);margin:18px 0 6px}
.ri-groc{margin:0;padding:0}
.ri-groc li{font-size:14px;line-height:1.55;list-style:none;padding:7px 6px 7px 28px;position:relative;cursor:pointer;user-select:none;border-radius:9px}
.ri-groc li:hover{background:var(--paper2)}
.ri-groc li:before{content:"";position:absolute;left:4px;top:8px;width:13px;height:13px;border:1.6px solid var(--sage);border-radius:4px;background:#fff;transition:all .12s}
.ri-groc li.done{color:var(--ink-soft);text-decoration:line-through;text-decoration-color:var(--line2)}
.ri-groc li.done .qty{color:var(--ink-soft)}
.ri-groc li.done:before{background:var(--sage);border-color:var(--sage-deep)}
.ri-groc li.done:after{content:"";position:absolute;left:8px;top:10px;width:4px;height:8px;border:solid #fff;border-width:0 2px 2px 0;transform:rotate(42deg)}
.ri-groc .qty{font-weight:600;color:var(--ink)}
.ri-gtools{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:12px}
.ri-gprog{font-size:12px;color:var(--ink-soft)}
.ri-greset{font-size:12px;color:var(--pink-deep);background:transparent;border:none;cursor:pointer;padding:0}
.ri-ghead{font-family:'Spline Sans Mono',monospace;font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--plum);margin:16px 0 2px}
.ri-gdish{font-family:'Fraunces',serif;font-weight:600;font-size:16px;margin:9px 0 0;color:var(--ink)}
.ri-banner{background:#FBF0D6;border:1px solid #EBD7A4;border-radius:13px;padding:11px 14px;font-size:12.5px;color:#7A601F;margin-top:18px;line-height:1.5}
.ri-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--ink);color:#fff;font-size:13.5px;font-weight:500;padding:12px 22px;border-radius:30px;z-index:80;box-shadow:0 16px 30px -12px rgba(40,30,20,.6);animation:ri-rise .25s ease}
@keyframes ri-rise{from{opacity:0;transform:translate(-50%,10px)}to{opacity:1;transform:translate(-50%,0)}}
input:focus-visible,button:focus-visible,select:focus-visible,textarea:focus-visible{outline:2px solid var(--honey);outline-offset:2px}
@media (max-width:560px){.ri-row{flex-direction:column;gap:0}.ri-new{margin-left:0;width:100%}.ri-rail{flex:0 0 78px}.ri-brand{font-size:26px}.ri-tag{display:none}.ri-mitem-actions{margin-left:0;flex-basis:100%;justify-content:flex-end}.ri-msel{flex:1;max-width:none}.ri-mitem-title{white-space:normal}.ri-mitem-body{flex-basis:calc(100% - 36px)}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
`;

const SOURDOUGH_IMG = "/recipes/sourdough-boule.jpg";
const CHIVE_IMG = "/recipes/chive-pockets.jpg";
const FOCACCIA_IMG = "/recipes/sourdough-focaccia.jpg";
const OXTAIL_IMG = "/recipes/oxtail-soup.jpg";
const SCALLION_FOCACCIA_IMG = "/recipes/scallion-focaccia.jpg";
const BRAISED_RIBS_IMG = "/recipes/braised-pork-ribs.jpg";

const CATEGORIES = [
  { id: "bread", label: "Bread & Bakes", hue: "#B98A36" },
  { id: "sweets", label: "Sweets", hue: "#C97E97" },
  { id: "mains", label: "Mains", hue: "#8A6E4B" },
  { id: "sides", label: "Sides & Salads", hue: "#6F8466" },
  { id: "basics", label: "Pantry Staples", hue: "#5E8086" },
  { id: "drinks", label: "Drinks", hue: "#8A5A6B" },
  { id: "other", label: "Other", hue: "#8E8268" },
];
const catOf = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[6];
const VERDICTS = { again: { label: "Make again", color: "#7E9A74" }, tweak: { label: "Getting there", color: "#D79B3F" }, pass: { label: "One & done", color: "#D9847F" } };
const METRICS = [{ id: "taste", name: "Taste" }, { id: "texture", name: "Texture" }, { id: "looks", name: "Looks" }];
const SECTIONS = [["appetizer", "Appetizers"], ["entree", "Entrées"], ["dessert", "Desserts"], ["drinks", "Drinks"]];

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const fmtDate = (iso) => { if (!iso) return ""; const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : "")); return isNaN(d) ? "" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); };
const rawLines = (s) => (s || "").split("\n").map((l) => l.trim()).filter(Boolean);
const stepLines = (s) => rawLines(s).map((l) => l.replace(/^(\d+[.)]\s+|[-*•]\s+)/, ""));
const expScore = (a) => METRICS.reduce((t, m) => t + (a[m.id] || 0), 0);
const bestAttempt = (exp) => { const a = exp.attempts || []; if (!a.length) return null; return [...a].sort((x, y) => expScore(y) - expScore(x) || (y.date || "").localeCompare(x.date || "") || y.n - x.n)[0]; };

const UNITS = { g:{d:"m",f:1}, kg:{d:"m",f:1000}, mg:{d:"m",f:0.001}, oz:{d:"m",f:28.3495}, lb:{d:"m",f:453.592}, lbs:{d:"m",f:453.592}, pound:{d:"m",f:453.592}, pounds:{d:"m",f:453.592}, ml:{d:"v",f:1}, l:{d:"v",f:1000}, liter:{d:"v",f:1000}, litre:{d:"v",f:1000}, liters:{d:"v",f:1000}, tsp:{d:"v",f:4.92892}, teaspoon:{d:"v",f:4.92892}, teaspoons:{d:"v",f:4.92892}, tbsp:{d:"v",f:14.7868}, tablespoon:{d:"v",f:14.7868}, tablespoons:{d:"v",f:14.7868}, cup:{d:"v",f:236.588}, cups:{d:"v",f:236.588} };
function parseNum(raw){ if(/\s/.test(raw)){ const p=raw.split(/\s+/); const fr=p[1].split("/"); return parseFloat(p[0])+parseFloat(fr[0])/parseFloat(fr[1]); } if(raw.indexOf("/")>=0){ const fr=raw.split("/"); return parseFloat(fr[0])/parseFloat(fr[1]); } return parseFloat(raw); }
function parseAmount(str){ const m=str.match(/^\s*(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)\s*([\s\S]*)$/); if(!m) return null; return {value:parseNum(m[1]), rest:m[2]}; }
function parseIngredient(line){ const a=parseAmount(line); if(!a) return {amount:null,unit:null,name:(line||"").trim()}; let rest=a.rest,unit=null,name=rest; const um=rest.match(/^([a-zA-Z]+)\.?\b\s*([\s\S]*)$/); if(um && UNITS[um[1].toLowerCase()]){ unit=um[1].toLowerCase(); name=um[2]; } name=name.replace(/^\s*\/\s*\d[\d.\/]*\s*(?:g|kg|mg|ml|l|oz|lb|lbs|tsp|tbsp|cup|cups)\b/i,"").trim(); name=name.replace(/^[\s/)]+/,"").trim(); return {amount:a.value,unit,name}; }
const FRACS=[[0,""],[0.125,"⅛"],[0.25,"¼"],[1/3,"⅓"],[0.375,"⅜"],[0.5,"½"],[0.625,"⅝"],[2/3,"⅔"],[0.75,"¾"],[0.875,"⅞"],[1,""]];
function toFraction(v){ if(v<0) v=0; let whole=Math.floor(v),frac=v-whole,best=FRACS[0]; for(const f of FRACS){ if(Math.abs(f[0]-frac)<Math.abs(best[0]-frac)) best=f; } if(best[0]===1){ whole+=1; best=FRACS[0]; } if(whole===0&&best[1]==="") return "0"; if(whole===0) return best[1]; if(best[1]==="") return String(whole); return whole+" "+best[1]; }
function fmtNum(x){ if(Math.abs(x-Math.round(x))<0.05) return String(Math.round(x)); if(x>=10) return String(Math.round(x)); return String(Math.round(x*10)/10); }
function trimNum(x){ return Number.isInteger(x) ? String(x) : String(Math.round(x*100)/100); }
function convertUnit(amount, unit, sys){
  if(!unit) return {q:toFraction(amount), u:""};
  const def=UNITS[unit]; const base=amount*def.f;
  if(sys==="metric"){ if(def.d==="m") return base>=1000?{q:fmtNum(base/1000),u:"kg"}:{q:fmtNum(base),u:"g"}; return base>=1000?{q:fmtNum(base/1000),u:"L"}:{q:fmtNum(base),u:"ml"}; }
  if(sys==="us"){ if(def.d==="m"){ const oz=base/28.3495; return oz>=16?{q:toFraction(oz/16),u:"lb"}:{q:fmtNum(oz),u:"oz"}; } const cups=base/236.588; if(cups>=0.25) return {q:toFraction(cups),u:(cups>1?"cups":"cup")}; const tb=base/14.7868; if(tb>=1) return {q:toFraction(tb),u:"tbsp"}; return {q:toFraction(base/4.92892),u:"tsp"}; }
  if(def.d==="m") return {q:fmtNum(amount), u:unit};
  if(unit==="ml"||unit==="l") return {q:fmtNum(amount), u:unit};
  let uu=unit; if(unit==="cup"||unit==="cups") uu = amount>1 ? "cups":"cup";
  return {q:toFraction(amount), u:uu};
}
function scaleLine(p, factor, sys){ if(p.amount==null) return p.name; const c=convertUnit(p.amount*factor, p.unit, sys); const left=c.u?(c.q+" "+c.u):c.q; return p.name?(left+" "+p.name):left; }
function getBaseServings(s){ if(!s) return null; const m=String(s).match(/(\d+(?:\.\d+)?)/); return m?parseFloat(m[1]):null; }
function servingNoun(s){ if(!s) return "servings"; const n=String(s).replace(/^[^a-zA-Z]*/,"").trim(); return n||"servings"; }
function scaleStepText(text, factor, sys){
  let t=text;
  if(sys==="metric"){ t=t.replace(/(\d{2,3})\s*°?\s*F\b/g,(_,f)=>Math.round((parseInt(f,10)-32)*5/9)+"°C"); t=t.replace(/(\d+(?:\.\d+)?)\s*(?:in|inch|inches)\b/g,(_,n)=>Math.round(parseFloat(n)*2.54)+" cm"); }
  t=t.replace(/(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)\s*(g|kg|ml|l|oz|lb|lbs|tsp|tbsp|cup|cups)\b/gi,(m,num,unit)=>{ const v=parseNum(num); if(isNaN(v)) return m; const c=convertUnit(v*factor,unit.toLowerCase(),sys); return c.u?(c.q+" "+c.u):c.q; });
  return t;
}
function recipeToText(r){ const bits=[fmtDate(r.madeOn)&&`made ${fmtDate(r.madeOn)}`,catOf(r.category).label,r.servings&&`makes ${r.servings}`,r.time].filter(Boolean); let t=`${r.title.toUpperCase()}\n${bits.join(" · ")}\n`; if(r.source) t+=`from: ${r.source}\n`; if(r.ingredients&&r.ingredients.trim()) t+=`\nINGREDIENTS\n`+rawLines(r.ingredients).map((l)=>`- ${l}`).join("\n")+"\n"; if(r.steps&&r.steps.trim()) t+=`\nMETHOD\n`+stepLines(r.steps).map((l,i)=>`${i+1}. ${l}`).join("\n")+"\n"; if(r.notes&&r.notes.trim()) t+=`\nNOTES\n${r.notes.trim()}\n`; if(r.verdict) t+=`\n[ ${VERDICTS[r.verdict].label} ]`; return t.trim(); }
const sortR=(a)=>[...a].sort((x,y)=>(y.madeOn||y.createdAt||"").localeCompare(x.madeOn||x.createdAt||""));
const sortE=(a)=>[...a].sort((x,y)=>(y.updatedAt||y.createdAt||"").localeCompare(x.updatedAt||x.createdAt||""));
function emptySections(){ return {appetizer:[],entree:[],dessert:[],drinks:[]}; }
function normalizeMenu(mn){ if(mn.sections){ return {...mn, sections:{...emptySections(), ...mn.sections}}; } const s=emptySections(); if(Array.isArray(mn.items)) s.entree=mn.items.slice(); return {...mn, sections:s}; }
function allMenuIds(mn){ return SECTIONS.reduce((acc,[k])=>acc.concat((mn.sections&&mn.sections[k])||[]),[]); }
function buildGrocery(menu, recipes){
  const agg=new Map();
  allMenuIds(menu).forEach((rid)=>{
    const r=recipes.find((x)=>x.id===rid); if(!r) return;
    rawLines(r.ingredients).forEach((line)=>{
      const p=parseIngredient(line);
      const norm=p.name.toLowerCase().replace(/\([^)]*\)/g,"").split(",")[0].replace(/\s+/g," ").trim();
      if(!norm) return;
      if(p.amount==null){ const k="none:"+norm; if(!agg.has(k)) agg.set(k,{type:"none",name:norm}); }
      else if(!p.unit){ const k="count:"+norm; const e=agg.get(k)||{type:"count",name:norm,count:0}; e.count+=p.amount; agg.set(k,e); }
      else { const dim=UNITS[p.unit].d; const k=dim+":"+norm; const e=agg.get(k)||{type:dim,name:norm,base:0}; e.base+=p.amount*UNITS[p.unit].f; agg.set(k,e); }
    });
  });
  const cap=(n)=>n.charAt(0).toUpperCase()+n.slice(1);
  const out=[];
  for(const e of agg.values()){
    if(e.type==="none") out.push({name:cap(e.name), qty:""});
    else if(e.type==="count") out.push({name:cap(e.name), qty:trimNum(Math.round(e.count*100)/100)});
    else if(e.type==="m") out.push({name:cap(e.name), qty:e.base>=1000?fmtNum(e.base/1000)+" kg":fmtNum(e.base)+" g"});
    else out.push({name:cap(e.name), qty:e.base>=1000?fmtNum(e.base/1000)+" L":fmtNum(e.base)+" ml"});
  }
  out.sort((a,b)=>a.name.localeCompare(b.name));
  return out;
}
const hasStore = typeof window !== "undefined" && window.storage;
async function listGet(prefix, shared){ const out=[]; try{ const res=await window.storage.list(prefix,shared); const keys=(res&&res.keys)||[]; const got=await Promise.all(keys.map(async(k)=>{ try{ const r=await window.storage.get(k,shared); return r?JSON.parse(r.value):null; }catch{return null;} })); for(const g of got) if(g) out.push(g); }catch{} return out; }
function shrinkImage(file){ return new Promise((resolve)=>{ const reader=new FileReader(); reader.onload=()=>{ const img=new Image(); img.onload=()=>{ const max=560; let w=img.width,h=img.height; if(w>h&&w>max){h=h*max/w;w=max;} else if(h>max){w=w*max/h;h=max;} const c=document.createElement("canvas"); c.width=w; c.height=h; c.getContext("2d").drawImage(img,0,0,w,h); resolve(c.toDataURL("image/jpeg",0.72)); }; img.onerror=()=>resolve(null); img.src=reader.result; }; reader.onerror=()=>resolve(null); reader.readAsDataURL(file); }); }

const SEED_RECIPES = [
  { id:"seed-scallion-focaccia", title:"Scallion Focaccia", category:"bread", source:"Tiffy Cooks (tiffycooks.com/scallion-focaccia-same-day-or-overnight-rise)", servings:"1 pan", time:"same-day 3-4 hr, or overnight + 30 min bake", madeOn:"2026-06-28", verdict:"again",
    ingredients:["4 cups / 500g bread flour","2 cups / 475g warm water","2 1/4 tsp instant yeast (use ~1 tsp for an overnight cold rise)","2 tsp sugar","2 tsp fine salt","1/4 cup extra-virgin olive oil, plus more for the pan and top","1 bunch scallions (about 6), thinly sliced","Flaky sea salt, to finish"].join("\n"),
    steps:["Whisk the flour, yeast, sugar, and salt in a large bowl. Add the warm water and 2 tbsp olive oil and stir with a spatula until a shaggy, sticky dough forms with no dry flour.","Cover the bowl. Same-day: rise at room temp 2-4 hr until doubled and bubbly. Overnight: refrigerate 12-18 hr, then bring to room temp about 1 hr before baking.","Coat a 9x13 pan (or quarter sheet) with a generous layer of olive oil. Tip in the dough, fold it over a few times, and turn to coat in the oil.","Let it proof in the pan 30-60 min until puffy and relaxed toward the edges.","Heat the oven to 450F. Oil your fingers and dimple all over, stretching the dough to fill the pan.","Toss the sliced scallions with a little olive oil (this keeps them from scorching) and scatter over the top, pressing them into the dimples. Drizzle with more oil and a pinch of flaky salt.","Bake 22-28 min until deep golden and crisp at the edges. Cool in the pan a few minutes, then lift out and slice."].join("\n"),
    notes:"From Tiffy Cooks — a flexible same-day or overnight rise. Tossing the scallions in oil before topping keeps them from burning. Baked in the blue Staub; lots of olive oil in the pan gives the crisp fried bottom.",
    photo:SCALLION_FOCACCIA_IMG, createdAt:"2026-06-28T10:00:00.000Z" },
  { id:"seed-braised-pork-ribs", title:"Shanghai-Style Braised Pork Ribs", category:"mains", source:"The Woks of Life (thewoksoflife.com/shanghai-style-braised-pork-belly) — made with pork ribs instead of pork belly", servings:"4", time:"~1 hr 15 min", madeOn:"2026-06-28", verdict:"again",
    ingredients:["2 lb / 900g pork ribs, cut into 1.5-inch pieces (substituted for the pork belly)","1 tbsp neutral oil","2 tbsp rock sugar (or 1.5 tbsp granulated sugar)","3 slices fresh ginger","2 scallions, cut into 2-inch pieces, plus more to finish","1 star anise, optional","1/4 cup Shaoxing wine","2 tbsp light soy sauce","2 tsp dark soy sauce, for color","2 cups hot water","1 small section lotus root, peeled and cut into 1/2-inch slices (optional, pictured)","Salt, to taste"].join("\n"),
    steps:["Blanch the ribs: put them in a pot of cold water with a splash of Shaoxing wine and a slice of ginger. Bring to a boil, skim the foam, boil 1-2 min, then drain and rinse.","In a wok or heavy pot over low heat, add the oil and rock sugar. Melt the sugar slowly, stirring, until it turns amber and caramelizes — don't let it burn.","Add the ribs and turn to coat in the caramel, searing lightly on all sides.","Pour in the Shaoxing wine, light soy, and dark soy; add the ginger, scallion, and star anise. Stir to coat.","Add the hot water — it should nearly cover the ribs. Bring to a boil, then cover and simmer gently 45-50 min, until the ribs are tender.","If using lotus root, add it in the last ~20 min so it soaks up the sauce but keeps a little bite.","Uncover, raise the heat, and reduce the sauce until glossy and thickened, spooning it over the ribs. Taste and add salt if needed, then finish with fresh scallion."].join("\n"),
    notes:"Adapted from The Woks of Life's Shanghai-style braised pork belly (red-braised / hong shao rou), swapping in pork ribs — they stay on the bone and pick up the sweet-savory glaze beautifully. Pictured with lotus root, which drinks up the sauce. Ribs are leaner than belly, so keep the simmer gentle and add a splash more water if it reduces too fast.",
    photo:BRAISED_RIBS_IMG, createdAt:"2026-06-28T09:30:00.000Z" },
  { id:"seed-oxtail-soup", title:"Eric's Oxtail Soup", category:"mains", source:"", servings:"", time:"", madeOn:"", ingredients:"", steps:"", notes:"", photo:OXTAIL_IMG, createdAt:"2026-06-27T13:00:00.000Z" },
  { id:"seed-chive-pockets", title:"Chive Pockets (韭菜盒子)", category:"mains", source:"Red House Spice (redhousespice.com/chinese-chive-pockets)", servings:"12 pockets", time:"1 hr", madeOn:"2026-06-27", verdict:"again",
    ingredients:["3 cups all-purpose flour, plus extra for dusting (dough)","1 cup hot water (dough)","4 eggs, lightly beaten","50g dried mung bean vermicelli, optional","6 oz / 170g Chinese chives, finely chopped","3 tbsp neutral oil (filling)","1 tsp salt","1/4 tsp ground white pepper — five-spice option skipped","2 tbsp neutral oil (for frying)"].join("\n"),
    steps:["Make a hot-water dough: stir 1 cup just-boiled water into 3 cups flour with chopsticks until shaggy, then knead into a smooth, soft dough once cool enough to handle. Cover and rest 15 min.","Scramble 4 eggs in a little hot oil, then chop into small pieces.","Soak 50g mung bean vermicelli in hot water about 5 min until pliable, rinse cool, and chop into short strands.","Mix the chopped chives, egg, and vermicelli with 1 tsp salt and 1/4 tsp white pepper (we left out the five-spice).","Divide the dough into 12, roll each into a ~6 in round, add filling, fold into a half-moon and press the edge to seal.","Pan-fry in 2 tbsp oil over medium, covered, until the bottom is golden (~5 min). Flip and fry uncovered until golden (~2 min). Serve warm, with chili oil if you like."].join("\n"),
    notes:"Made with Eric. We skipped the five-spice powder the recipe lists as a seasoning option — liked it much better without, just salt and white pepper. Pan-frying covered then uncovered gave a great golden crust.",
    photo:CHIVE_IMG, createdAt:"2026-06-27T12:00:00.000Z" },
  { id:"seed-sourdough-boule", title:"Sourdough Boule", category:"bread", source:"NYT Cooking — Claire Saffitz (cooking.nytimes.com/article/sourdough-bread)", servings:"2 loaves", time:"~2 days, mostly hands-off", madeOn:"2026-06-27", verdict:"again",
    ingredients:["800g bread flour","200g whole wheat flour","750g water (75% hydration)","200g active sourdough starter (20%)","20g fine salt (2%)","Rice flour, for dusting the banneton"].join("\n"),
    steps:["Combine 800g bread flour, 200g whole wheat flour, and 750g water by hand until no dry flour remains. Cover and autolyse 30-60 min.","Add 200g bubbly starter (it should float) and work it in with wet hands. Rest about 15 min.","Add 20g salt and squeeze it through the dough. Bulk fermentation begins now.","Over the first few hours, do a lift-and-fold roughly every hour (4-6 sets), until the dough is smooth and puffy. Bulk ~5-7 hr depending on warmth.","Turn out, divide in two, pre-shape into rounds, and bench rest 20-30 min.","Shape each into a taut boule and set seam-up in rice-floured bannetons.","Cold proof in the fridge overnight, 12-16 hr.","Bake each loaf in a preheated Dutch oven: ~500F covered for 20 min, then uncovered at ~450F for 20-25 min until deeply browned. Cool completely before slicing."].join("\n"),
    notes:"Claire Saffitz's NYT method — 75% hydration, a 1000g bread/whole-wheat flour blend, 20% starter, overnight cold proof, baked dark in a Dutch oven. Beautiful ear and open crumb.",
    photo:SOURDOUGH_IMG, createdAt:"2026-06-27T11:00:00.000Z" },
  { id:"seed-focaccia", title:"Sourdough Focaccia", category:"bread", source:"Spice & Zest (spiceandzest.com/kitchen-tips/sourdough-focaccia-recipe)", servings:"1 pan", time:"overnight + 30 min bake", madeOn:"2026-06-27", verdict:"again",
    ingredients:["100g active sourdough starter","500g bread flour","410g water (use 400g first, 10g later)","10g olive oil, plus more for the pan and top","10g salt"].join("\n"),
    steps:["Mix 100g starter, 500g bread flour, and 400g of the water until just combined — a very wet, sticky dough. Rest 20-30 min (autolyse).","Add 10g salt, the last 10g water, and 10g olive oil. Knead 2-3 min; it stays wet.","Bulk rise at room temp 2-3 hr, doing a stretch-and-fold every 30-40 min.","Generously oil a pan, transfer the dough, and gently stretch it toward the edges (rest 20-30 min if it resists, then stretch again).","Cover and cold-proof in the fridge overnight, 10-18 hr (or 2-4 hr at room temp for same-day).","Take it out about 2 hr before baking to come to room temp.","Heat the oven to 450F. Oil your hands and dimple all over. Drizzle with oil, scatter herbs, and add a pinch of flaky salt.","Bake ~30 min until deep golden brown. Cool a little before slicing."].join("\n"),
    notes:"From Spice & Zest — overnight cold-proof in plenty of olive oil. Baked plain with flaky salt in the Staub oval. Next time: dimple deeper and give it a few more minutes for more color.",
    photo:FOCACCIA_IMG, createdAt:"2026-06-27T10:30:00.000Z" },
];

/* ============================ APP ============================ */
export default function App() {
  const [pantry, setPantry] = useState([]);
  const [experiments, setExperiments] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("pantry");
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [toast, setToast] = useState("");
  const [editing, setEditing] = useState(null);
  const [detail, setDetail] = useState(null);
  const [editExp, setEditExp] = useState(null);
  const [detailExp, setDetailExp] = useState(null);
  const [attemptFor, setAttemptFor] = useState(null);
  const [compareExp, setCompareExp] = useState(null);
  const [menuSel, setMenuSel] = useState(null);
  const [groceryFor, setGroceryFor] = useState(null);
  const [railOpen, setRailOpen] = useState(false);
  const shipRef = useRef(null);
  const toastT = useRef();
  const flash = useCallback((m) => { setToast(m); clearTimeout(toastT.current); toastT.current = setTimeout(() => setToast(""), 2300); }, []);

  useEffect(() => {
    let go = true;
    (async () => {
      if (hasStore) {
        const [p, e, mn] = await Promise.all([listGet("recipe:", false), listGet("experiment:", false), listGet("menu:", false)]);
        let seeded = p;
        for (const seed of SEED_RECIPES) {
          const already = p.some((r) => r.id === seed.id);
          let flagged = false;
          try { const fl = await window.storage.get("seed3:" + seed.id, false); flagged = !!fl; } catch {}
          if (!already && !flagged) { seeded = [seed, ...seeded]; try { await window.storage.set("recipe:" + seed.id, JSON.stringify(seed), false); } catch {} try { await window.storage.set("seed3:" + seed.id, "1", false); } catch {} }
        }
        if (!go) return;
        setPantry(sortR(seeded)); setExperiments(sortE(e)); setMenus(mn.map(normalizeMenu).sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")));
      } else { setPantry(sortR(SEED_RECIPES)); }
      if (go) setLoading(false);
    })();
    return () => { go = false; };
  }, []);

  const saveRecipe = useCallback(async (rec) => {
    const isNew = !pantry.some((m) => m.id === rec.id);
    setPantry((cur) => sortR(isNew ? [rec, ...cur] : cur.map((m) => (m.id === rec.id ? rec : m))));
    if (hasStore) try { await window.storage.set("recipe:" + rec.id, JSON.stringify(rec), false); } catch {}
    if (shipRef.current) { const eid = shipRef.current; shipRef.current = null; setExperiments((cur) => { const next = cur.map((x) => (x.id === eid ? { ...x, shippedAt: new Date().toISOString() } : x)); const ex = next.find((x) => x.id === eid); if (ex && hasStore) window.storage.set("experiment:" + eid, JSON.stringify(ex), false).catch(() => {}); return next; }); }
    setEditing(null); flash(isNew ? "Stocked in the pantry 🌿" : "Saved");
  }, [pantry, flash]);

  const deleteRecipe = useCallback(async (id) => {
    setPantry((m) => m.filter((x) => x.id !== id));
    if (hasStore) try { await window.storage.delete("recipe:" + id, false); } catch {}
    setMenus((cur) => cur.map((mn) => { if (!allMenuIds(mn).includes(id)) return mn; const sections = {}; for (const [k] of SECTIONS) sections[k] = (mn.sections[k] || []).filter((i) => i !== id); const upd = { ...mn, sections }; if (hasStore) window.storage.set("menu:" + mn.id, JSON.stringify(upd), false).catch(() => {}); return upd; }));
    setEditing(null); setDetail(null); flash("Removed");
  }, [flash]);

  const copyRecipe = useCallback(async (rec) => { try { await navigator.clipboard.writeText(recipeToText(rec)); flash("Recipe copied to clipboard"); } catch { flash("Couldn't copy — try selecting manually"); } }, [flash]);

  const persistExp = useCallback((ex) => { if (hasStore) window.storage.set("experiment:" + ex.id, JSON.stringify(ex), false).catch(() => {}); }, []);
  const saveExperiment = useCallback((ex) => { const stamped = { ...ex, updatedAt: new Date().toISOString() }; const isNew = !experiments.some((e) => e.id === ex.id); setExperiments((cur) => sortE(isNew ? [stamped, ...cur] : cur.map((e) => (e.id === ex.id ? stamped : e)))); persistExp(stamped); setEditExp(null); setDetailExp((d) => (d && d.id === ex.id ? stamped : d)); flash(isNew ? "Experiment started 🔬" : "Saved"); }, [experiments, persistExp, flash]);
  const deleteExperiment = useCallback((id) => { setExperiments((c) => c.filter((e) => e.id !== id)); if (hasStore) window.storage.delete("experiment:" + id, false).catch(() => {}); setEditExp(null); setDetailExp(null); flash("Experiment cleared"); }, [flash]);
  const saveAttempt = useCallback((expId, attempt) => { setExperiments((cur) => { const next = cur.map((e) => { if (e.id !== expId) return e; const exists = (e.attempts || []).some((a) => a.id === attempt.id); const attempts = exists ? e.attempts.map((a) => (a.id === attempt.id ? attempt : a)) : [...(e.attempts || []), attempt]; const upd = { ...e, attempts, updatedAt: new Date().toISOString() }; persistExp(upd); return upd; }); const fresh = next.find((e) => e.id === expId); setDetailExp((d) => (d && d.id === expId ? fresh : d)); return sortE(next); }); setAttemptFor(null); flash("Batch logged 🧺"); }, [persistExp, flash]);
  const deleteAttempt = useCallback((expId, attId) => { setExperiments((cur) => { const next = cur.map((e) => { if (e.id !== expId) return e; const upd = { ...e, attempts: (e.attempts || []).filter((a) => a.id !== attId), updatedAt: new Date().toISOString() }; persistExp(upd); return upd; }); const fresh = next.find((e) => e.id === expId); setDetailExp((d) => (d && d.id === expId ? fresh : d)); return next; }); flash("Batch removed"); }, [persistExp, flash]);
  const shipToPantry = useCallback((exp, attempt) => { const a = attempt || bestAttempt(exp); const np = []; if (a && a.changes) np.push(`Winning batch (v${a.n}): ${a.changes}`); if (a && a.result) np.push(a.result); shipRef.current = exp.id; setDetailExp(null); setCompareExp(null); setEditing({ id: newId(), title: exp.title, category: exp.category, source: "Test kitchen", servings: exp.servings || "", time: exp.time || "", madeOn: (a && a.date) || new Date().toISOString().slice(0, 10), verdict: (a && a.verdict) || "again", ingredients: exp.ingredients || "", steps: exp.steps || "", notes: np.join("\n\n"), photo: (a && a.photo) || exp.photo || null, createdAt: new Date().toISOString() }); setMode("pantry"); }, []);

  const persistMenu = useCallback((mn) => { if (hasStore) window.storage.set("menu:" + mn.id, JSON.stringify(mn), false).catch(() => {}); }, []);
  const newMenu = useCallback(() => { const mn = { id: newId(), title: "New menu", sections: emptySections(), createdAt: new Date().toISOString() }; setMenus((c) => [mn, ...c]); persistMenu(mn); setMenuSel(mn.id); flash("Menu created 🍽️"); }, [persistMenu, flash]);
  const updateMenu = useCallback((id, patch) => { setMenus((cur) => cur.map((mn) => { if (mn.id !== id) return mn; const upd = { ...mn, ...patch }; persistMenu(upd); return upd; })); }, [persistMenu]);
  const deleteMenu = useCallback((id) => { setMenus((c) => c.filter((mn) => mn.id !== id)); if (hasStore) window.storage.delete("menu:" + id, false).catch(() => {}); setMenuSel((s) => (s === id ? null : s)); flash("Menu deleted"); }, [flash]);
  const addToMenu = useCallback((id, rid, section) => { setMenus((cur) => cur.map((mn) => { if (mn.id !== id) return mn; if (allMenuIds(mn).includes(rid)) return mn; const sections = { ...mn.sections, [section]: [...(mn.sections[section] || []), rid] }; const upd = { ...mn, sections }; persistMenu(upd); return upd; })); }, [persistMenu]);
  const removeFromMenu = useCallback((id, rid) => { setMenus((cur) => cur.map((mn) => { if (mn.id !== id) return mn; const sections = {}; for (const [k] of SECTIONS) sections[k] = (mn.sections[k] || []).filter((i) => i !== rid); const upd = { ...mn, sections }; persistMenu(upd); return upd; })); }, [persistMenu]);
  const moveSection = useCallback((id, rid, to) => { setMenus((cur) => cur.map((mn) => { if (mn.id !== id) return mn; const sections = {}; for (const [k] of SECTIONS) sections[k] = (mn.sections[k] || []).filter((i) => i !== rid); sections[to] = [...sections[to], rid]; const upd = { ...mn, sections }; persistMenu(upd); return upd; })); }, [persistMenu]);
  const reorderSection = useCallback((id, section, arr) => { setMenus((cur) => cur.map((mn) => { if (mn.id !== id) return mn; const upd = { ...mn, sections: { ...mn.sections, [section]: arr } }; persistMenu(upd); return upd; })); }, [persistMenu]);
  const saveMenu = useCallback((mn) => { persistMenu(mn); flash("Menu saved 💌"); setGroceryFor(mn.id); }, [persistMenu, flash]);

  const source = mode === "pantry" ? pantry : experiments;
  const list = useMemo(() => { const term = q.trim().toLowerCase(); return source.filter((r) => { if (cat !== "all" && r.category !== cat) return false; if (!term) return true; const hay = mode === "kitchen" ? [r.title, r.hypothesis, r.ingredients, (r.attempts || []).map((a) => a.changes + " " + a.result).join(" ")] : [r.title, r.ingredients, r.notes, r.source]; return hay.some((f) => (f || "").toLowerCase().includes(term)); }); }, [source, cat, q, mode]);
  const NAV = [{ id: "pantry", label: "Pantry", Icon: Jar }, { id: "kitchen", label: "Test Kitchen", Icon: Whisk }, { id: "menus", label: "Menus", Icon: MenuIcon }];
  const groceryMenu = groceryFor ? menus.find((m) => m.id === groceryFor) : null;

  return (
    <div className="ri-root">
      <style>{CSS}</style>
      <div className="ri-top">
        <button className="ri-railtoggle" onClick={() => setRailOpen((v) => !v)} aria-label={railOpen ? "Collapse menu" : "Open menu"}>{railOpen ? <ChevronIcon dir="left" /> : <Bars />}</button>
        <div className="ri-brand"><Heart /> Mimi's <b>Recipe Box</b></div>
        <div className="ri-tag">a sweet little kitchen journal</div>
      </div>
      <div className="ri-layout">
        <aside className={"ri-rail" + (railOpen ? "" : " closed")}>
          {NAV.map(({ id, label, Icon }) => (
            <button key={id} className="ri-nav" data-on={mode === id} onClick={() => { setMode(id); setCat("all"); setQ(""); }}><Icon on={mode === id} /><span>{label}</span></button>
          ))}
        </aside>
        <main className="ri-main">
          {mode === "menus" ? (
            <MenusView menus={menus} recipes={pantry} sel={menuSel} loading={loading} onSelect={setMenuSel} onNew={newMenu}
              onRename={(id, t) => updateMenu(id, { title: t })} onDelete={deleteMenu} onAdd={addToMenu} onRemove={removeFromMenu} onMove={moveSection} onReorder={reorderSection} onSave={saveMenu} onGrocery={(id) => setGroceryFor(id)} />
          ) : (
            <>
              <div className="ri-bar">
                <div className="ri-search"><Magnifier /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={mode === "kitchen" ? "Search experiments…" : "Search recipes…"} aria-label="Search" /></div>
                <div className="ri-cats"><button className="ri-cat" data-on={cat === "all"} onClick={() => setCat("all")}>All</button>{CATEGORIES.map((c) => <button key={c.id} className="ri-cat" data-on={cat === c.id} onClick={() => setCat(c.id)}>{c.label}</button>)}</div>
                <button className="ri-new" onClick={() => (mode === "pantry" ? setEditing("new") : setEditExp("new"))}>{mode === "pantry" ? "+ New recipe" : "+ New experiment"}</button>
              </div>
              {loading ? <Empty icon="pot" title="Warming up the kitchen…" body="Bringing your recipes to the counter." />
                : list.length === 0 ? <EmptyForMode mode={mode} filtered={!!q || cat !== "all"} onNew={() => (mode === "pantry" ? setEditing("new") : setEditExp("new"))} />
                : <div className="ri-grid">{list.map((r) => mode === "kitchen" ? <ExpCard key={r.id} e={r} onOpen={() => setDetailExp(r)} /> : <Card key={r.id} r={r} onOpen={() => setDetail(r)} />)}</div>}
              {!hasStore && <div className="ri-banner">Heads up: saving isn't available in this preview, so anything you add lasts only for this session. In the Claude app it sticks around.</div>}
            </>
          )}
        </main>
      </div>
      {editing && <RecipeForm initial={editing === "new" ? null : editing} onClose={() => { shipRef.current = null; setEditing(null); }} onSave={saveRecipe} onDelete={deleteRecipe} />}
      {detail && <RecipeDetail r={detail} onClose={() => setDetail(null)} onEdit={() => { setEditing({ ...detail, __edit: true }); setDetail(null); }} onCopy={() => copyRecipe(detail)} />}
      {editExp && <ExperimentForm initial={editExp === "new" ? null : editExp} onClose={() => setEditExp(null)} onSave={saveExperiment} onDelete={deleteExperiment} />}
      {detailExp && <ExperimentDetail e={detailExp} onClose={() => setDetailExp(null)} onEdit={() => { setEditExp(detailExp); setDetailExp(null); }} onLogBatch={() => setAttemptFor({ exp: detailExp })} onEditBatch={(a) => setAttemptFor({ exp: detailExp, attempt: a })} onDeleteBatch={(a) => deleteAttempt(detailExp.id, a.id)} onCompare={() => setCompareExp(detailExp)} onShip={() => shipToPantry(detailExp)} />}
      {attemptFor && <AttemptForm exp={attemptFor.exp} initial={attemptFor.attempt || null} onClose={() => setAttemptFor(null)} onSave={(a) => saveAttempt(attemptFor.exp.id, a)} />}
      {compareExp && <CompareView e={compareExp} onClose={() => setCompareExp(null)} onShip={(a) => shipToPantry(compareExp, a)} />}
      {groceryMenu && <GroceryModal menu={groceryMenu} recipes={pantry} onClose={() => setGroceryFor(null)} flash={flash} />}
      {toast && <div className="ri-toast">{toast}</div>}
    </div>
  );
}

/* ============================ CARDS ============================ */
function Card({ r, onOpen }) {
  const c = catOf(r.category);
  const v = r.verdict && VERDICTS[r.verdict];
  const img = r.photo || r.photoReal;
  const meta = [fmtDate(r.madeOn), r.servings && `makes ${r.servings}`, r.time].filter(Boolean);
  return (
    <article className="ri-card" onClick={onOpen} tabIndex={0} role="button" aria-label={`Open ${r.title}`} onKeyDown={(e) => e.key === "Enter" && onOpen()}>
      {img ? <div className="ri-cover" style={{ backgroundImage: `url(${img})` }} /> : <div className="ri-cover"><Plate /></div>}
      <div className="ri-card-body">
        <div className="ri-card-cat" style={{ color: c.hue }}>{c.label}</div>
        <h3 className="ri-card-title">{r.title}</h3>
        <div className="ri-card-meta">{meta.map((m, i) => <React.Fragment key={i}>{i > 0 && <span className="ri-dot">·</span>}<span>{m}</span></React.Fragment>)}</div>
        {v && <div style={{ marginTop: 10 }}><span className="ri-ribbon" style={{ background: v.color }}>{v.label}</span></div>}
      </div>
    </article>
  );
}
function ExpCard({ e, onOpen }) {
  const c = catOf(e.category);
  const n = (e.attempts || []).length;
  const best = bestAttempt(e);
  return (
    <article className="ri-card" onClick={onOpen} tabIndex={0} role="button" aria-label={`Open ${e.title}`} onKeyDown={(ev) => ev.key === "Enter" && onOpen()}>
      {e.photo ? <div className="ri-cover" style={{ backgroundImage: `url(${e.photo})` }} /> : <div className="ri-cover"><Flask /></div>}
      <div className="ri-card-body">
        {e.shippedAt && <span className="ri-flag">Shipped</span>}
        <div className="ri-card-cat" style={{ color: c.hue }}>{c.label}</div>
        <h3 className="ri-card-title">{e.title}</h3>
        <div className="ri-build"><span className="ri-vtag">{n} {n === 1 ? "batch" : "batches"}</span>{best && <span className="ri-score">best {expScore(best)}/15 · v{best.n}</span>}</div>
        {best && best.verdict && <div style={{ marginTop: 10 }}><span className="ri-ribbon" style={{ background: VERDICTS[best.verdict].color }}>{VERDICTS[best.verdict].label}</span></div>}
        {!n && <div className="ri-card-meta" style={{ marginTop: 10 }}>No batches yet — log your first test</div>}
      </div>
    </article>
  );
}

/* ============================ RECIPE FORM ============================ */
function RecipeForm({ initial, onClose, onSave, onDelete }) {
  const [f, setF] = useState(() => initial || { id: newId(), title: "", category: "bread", source: "", servings: "", time: "", madeOn: new Date().toISOString().slice(0, 10), verdict: "again", ingredients: "", steps: "", notes: "", photo: null, createdAt: new Date().toISOString() });
  const [busy, setBusy] = useState(false);
  const fileRef = useRef();
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const onFile = async (e) => { const file = e.target.files && e.target.files[0]; if (!file) return; setBusy(true); set("photo", await shrinkImage(file)); setBusy(false); };
  useEffect(() => { const k = (e) => e.key === "Escape" && onClose(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);
  const isEdit = !!(initial && initial.__edit);
  const isShip = !!(initial && initial.source === "Test kitchen");
  const save = () => { if (!f.title.trim()) return; const { __edit, ...clean } = f; onSave({ ...clean, title: f.title.trim(), updatedAt: new Date().toISOString() }); };
  return (
    <div className="ri-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ri-sheet" role="dialog" aria-modal="true" aria-label="Recipe editor">
        <div className="ri-sheet-head"><h2>{isShip ? "Ship to the pantry" : isEdit ? "Edit recipe" : "New recipe"}</h2><button className="ri-x" onClick={onClose} aria-label="Close">×</button></div>
        <div className="ri-sheet-body">
          <div className="ri-field"><label className="ri-label">Title</label><input className="ri-input" value={f.title} autoFocus onChange={(e) => set("title", e.target.value)} placeholder="Saturday sourdough" /></div>
          <div className="ri-row"><div className="ri-field"><label className="ri-label">Category</label><select className="ri-select" value={f.category} onChange={(e) => set("category", e.target.value)}>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select></div><div className="ri-field"><label className="ri-label">Date made</label><input type="date" className="ri-input" value={f.madeOn} onChange={(e) => set("madeOn", e.target.value)} /></div></div>
          <div className="ri-row"><div className="ri-field"><label className="ri-label">Makes</label><input className="ri-input" value={f.servings} onChange={(e) => set("servings", e.target.value)} placeholder="4 servings" /></div><div className="ri-field"><label className="ri-label">Time</label><input className="ri-input" value={f.time} onChange={(e) => set("time", e.target.value)} placeholder="1h 20m" /></div></div>
          <div className="ri-field"><label className="ri-label">Verdict — would you make it again?</label><div className="ri-verdicts">{Object.entries(VERDICTS).map(([k, v]) => <button key={k} type="button" className="ri-vbtn" data-on={f.verdict === k} style={f.verdict === k ? { color: v.color, borderColor: v.color } : undefined} onClick={() => set("verdict", k)}>{v.label}</button>)}</div></div>
          <div className="ri-field"><label className="ri-label">Ingredients <span className="ri-help">— one per line, like "500g flour"</span></label><textarea className="ri-area" value={f.ingredients} onChange={(e) => set("ingredients", e.target.value)} placeholder={"500g bread flour\n350g water\n10g salt"} /></div>
          <div className="ri-field"><label className="ri-label">Method <span className="ri-help">— one step per line; include amounts and they'll scale</span></label><textarea className="ri-area" value={f.steps} onChange={(e) => set("steps", e.target.value)} placeholder={"Mix 500g flour with 350g water, rest 30 min\nAdd 100g starter and 10g salt…"} /></div>
          <div className="ri-field"><label className="ri-label">Notes <span className="ri-help">— what you'd change next time</span></label><textarea className="ri-area" value={f.notes} onChange={(e) => set("notes", e.target.value)} style={{ minHeight: 64 }} placeholder="Crumb was a touch tight — push the bulk 30 min longer." /></div>
          <div className="ri-field"><label className="ri-label">Source <span className="ri-help">(optional)</span></label><input className="ri-input" value={f.source} onChange={(e) => set("source", e.target.value)} placeholder="Tartine, a friend, your own head…" /></div>
          <div className="ri-field"><label className="ri-label">Photo <span className="ri-help">(optional)</span></label><div className="ri-photo-row"><div className="ri-thumb" style={f.photo ? { backgroundImage: `url(${f.photo})` } : undefined}>{!f.photo && <Plate />}</div><input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} /><button type="button" className="ri-filebtn" onClick={() => fileRef.current && fileRef.current.click()}>{busy ? "Processing…" : f.photo ? "Replace photo" : "Add a photo"}</button>{f.photo && <button type="button" className="ri-ghost" onClick={() => set("photo", null)}>Remove</button>}</div></div>
        </div>
        <div className="ri-sheet-foot"><button className="ri-primary" onClick={save} disabled={!f.title.trim()}>{isEdit ? "Save changes" : "Add to pantry"}</button><button className="ri-ghost" onClick={onClose}>Cancel</button>{isEdit && <button className="ri-ghost ri-del" onClick={() => onDelete(f.id)}>Delete</button>}</div>
      </div>
    </div>
  );
}

/* ============================ SCALABLE PANEL ============================ */
function ScalablePanel({ r }) {
  const ings = useMemo(() => rawLines(r.ingredients), [r.ingredients]);
  const steps = useMemo(() => stepLines(r.steps), [r.steps]);
  const base = getBaseServings(r.servings);
  const [serv, setServ] = useState(base || 1);
  const [sys, setSys] = useState("orig");
  const factor = base ? serv / base : 1;
  const noun = servingNoun(r.servings);
  return (
    <>
      <div className="ri-det-sec">
        <h4 style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}><span>Ingredients</span><span className="ri-seg">{[["orig", "Recipe"], ["metric", "Metric"], ["us", "US"]].map(([k, lab]) => <button key={k} data-on={sys === k} onClick={() => setSys(k)}>{lab}</button>)}</span></h4>
        {base != null && (<div className="ri-serv"><span className="lbl">Makes</span><span className="ri-stepper"><button onClick={() => setServ((v) => Math.max(1, v - 1))} aria-label="Fewer">−</button><span className="val">{trimNum(serv)} {noun}</span><button onClick={() => setServ((v) => v + 1)} aria-label="More">+</button></span>{serv !== base && <button className="ri-mini" onClick={() => setServ(base)} style={{ textTransform: "none", letterSpacing: 0 }}>Reset</button>}</div>)}
        <ul className="ri-ing">{ings.map((l, i) => <li key={i}>{scaleLine(parseIngredient(l), factor, sys)}</li>)}</ul>
        {base != null && serv !== base && <div className="ri-scalednote">Scaled from {trimNum(base)} to {trimNum(serv)} {noun}.</div>}
        {sys === "metric" && <div className="ri-scalednote">Volume↔weight isn't auto-converted (it depends on the ingredient) — amounts still scale.</div>}
      </div>
      {steps.length > 0 && <div className="ri-det-sec"><h4>Method</h4><ol className="ri-steps">{steps.map((l, i) => <li key={i}><span className="n">{i + 1}</span>{scaleStepText(l, factor, sys)}</li>)}</ol></div>}
    </>
  );
}

/* ============================ RECIPE DETAIL ============================ */
function RecipeDetail({ r, onClose, onEdit, onCopy }) {
  const c = catOf(r.category);
  const v = r.verdict && VERDICTS[r.verdict];
  const meta = [fmtDate(r.madeOn), r.servings && `makes ${r.servings}`, r.time, r.source && `from ${r.source}`].filter(Boolean);
  const hero = r.photo || r.photoReal;
  useEffect(() => { const k = (e) => e.key === "Escape" && onClose(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);
  return (
    <div className="ri-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ri-sheet" role="dialog" aria-modal="true" aria-label={r.title}>
        <div className="ri-sheet-head"><h2 style={{ fontFamily: "'Spline Sans Mono',monospace", fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", color: c.hue }}>{c.label}</h2><button className="ri-x" onClick={onClose} aria-label="Close">×</button></div>
        <div style={{ overflowY: "auto", maxHeight: "76vh" }}>
          {hero ? <div className="ri-hero" style={{ backgroundImage: `url(${hero})` }} /> : <div className="ri-hero"><Plate big /></div>}
          <div className="ri-det-body">
            <h1 className="ri-det-title">{r.title}</h1>
            <div className="ri-det-meta">{meta.map((m, i) => <React.Fragment key={i}>{i > 0 && <span className="ri-dot">·</span>}<span>{m}</span></React.Fragment>)}{v && <span className="ri-ribbon" style={{ background: v.color, marginLeft: 4 }}>{v.label}</span>}</div>
            <ScalablePanel r={r} />
            {r.notes && r.notes.trim() && <div className="ri-det-sec"><h4>Notes from the cook</h4><div className="ri-note">{r.notes.trim()}</div></div>}
          </div>
        </div>
        <div className="ri-sheet-foot"><button className="ri-primary" onClick={onCopy}>Copy recipe</button><button className="ri-ghost" onClick={onEdit}>Edit</button></div>
      </div>
    </div>
  );
}

/* ============================ EXPERIMENTS ============================ */
function ExperimentForm({ initial, onClose, onSave, onDelete }) {
  const [f, setF] = useState(() => initial || { id: newId(), title: "", category: "bread", hypothesis: "", servings: "", time: "", ingredients: "", steps: "", photo: null, attempts: [], createdAt: new Date().toISOString() });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  useEffect(() => { const k = (e) => e.key === "Escape" && onClose(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);
  return (
    <div className="ri-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ri-sheet" role="dialog" aria-modal="true" aria-label="Experiment editor">
        <div className="ri-sheet-head"><h2>{initial ? "Edit experiment" : "New experiment"}</h2><button className="ri-x" onClick={onClose} aria-label="Close">×</button></div>
        <div className="ri-sheet-body">
          <div className="ri-field"><label className="ri-label">Working title</label><input className="ri-input" value={f.title} autoFocus onChange={(e) => set("title", e.target.value)} placeholder="The perfect chewy choc chip cookie" /></div>
          <div className="ri-row"><div className="ri-field"><label className="ri-label">Category</label><select className="ri-select" value={f.category} onChange={(e) => set("category", e.target.value)}>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select></div><div className="ri-field"><label className="ri-label">Makes <span className="ri-help">(opt)</span></label><input className="ri-input" value={f.servings} onChange={(e) => set("servings", e.target.value)} placeholder="24 cookies" /></div></div>
          <div className="ri-field"><label className="ri-label">What are you trying to nail?</label><textarea className="ri-area" value={f.hypothesis} onChange={(e) => set("hypothesis", e.target.value)} style={{ minHeight: 64 }} placeholder="Crisp edges, soft middle, deep toffee flavor." /></div>
          <div className="ri-field"><label className="ri-label">Base ingredients <span className="ri-help">— the recipe you're iterating on</span></label><textarea className="ri-area" value={f.ingredients} onChange={(e) => set("ingredients", e.target.value)} placeholder={"250g flour\n170g brown butter\n200g brown sugar…"} /></div>
          <div className="ri-field"><label className="ri-label">Base method <span className="ri-help">(optional)</span></label><textarea className="ri-area" value={f.steps} onChange={(e) => set("steps", e.target.value)} placeholder={"Brown the butter, cool\nCream with sugars…"} /></div>
        </div>
        <div className="ri-sheet-foot"><button className="ri-primary" onClick={() => f.title.trim() && onSave({ ...f, title: f.title.trim() })} disabled={!f.title.trim()}>{initial ? "Save changes" : "Start experiment"}</button><button className="ri-ghost" onClick={onClose}>Cancel</button>{initial && <button className="ri-ghost ri-del" onClick={() => onDelete(f.id)}>Delete</button>}</div>
      </div>
    </div>
  );
}
function ExperimentDetail({ e, onClose, onEdit, onLogBatch, onEditBatch, onDeleteBatch, onCompare, onShip }) {
  const c = catOf(e.category);
  const attempts = [...(e.attempts || [])].sort((a, b) => b.n - a.n);
  const ings = rawLines(e.ingredients), steps = stepLines(e.steps);
  const best = bestAttempt(e);
  useEffect(() => { const k = (ev) => ev.key === "Escape" && onClose(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);
  return (
    <div className="ri-overlay" onMouseDown={(ev) => ev.target === ev.currentTarget && onClose()}>
      <div className="ri-sheet wide" role="dialog" aria-modal="true" aria-label={e.title}>
        <div className="ri-sheet-head"><h2>{e.title}{e.shippedAt && <span className="ri-flag" style={{ position: "static" }}>shipped</span>}</h2><button className="ri-x" onClick={onClose} aria-label="Close">×</button></div>
        <div className="ri-sheet-body">
          <div className="ri-card-cat" style={{ color: c.hue }}>{c.label}</div>
          {e.hypothesis && <div className="ri-note" style={{ marginTop: 10 }}><b className="ri-hand" style={{ fontSize: 17, color: "var(--sage-deep)" }}>Goal · </b>{e.hypothesis}</div>}
          {(ings.length > 0 || steps.length > 0) && <div className="ri-det-sec"><h4>Base recipe</h4>{ings.length > 0 && <ul className="ri-ing">{ings.map((l, i) => <li key={i}>{l}</li>)}</ul>}{steps.length > 0 && <ol className="ri-steps" style={{ marginTop: 12 }}>{steps.map((l, i) => <li key={i}><span className="n">{i + 1}</span>{l}</li>)}</ol>}</div>}
          <div className="ri-det-sec">
            <h4 style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><span>Test batches ({attempts.length})</span>{attempts.length >= 2 && <button className="ri-mini" onClick={onCompare} style={{ textTransform: "none", letterSpacing: 0 }}>⇄ Compare</button>}</h4>
            {attempts.length === 0 ? <p style={{ color: "var(--ink-soft)", fontSize: 14, lineHeight: 1.5, margin: "4px 0 0" }}>No batches yet. Each time you bake a version, log what you changed and rate how it turned out — then compare them to find the winner.</p>
              : attempts.map((a) => { const v = a.verdict && VERDICTS[a.verdict]; const isBest = best && a.id === best.id; return (
                <div className="ri-att" key={a.id} style={isBest ? { borderColor: "var(--sage)" } : undefined}>
                  <div className="ri-att-top"><span className="ri-vtag">v{a.n}</span><span className="ri-score">{fmtDate(a.date)}</span>{v && <span className="ri-ribbon" style={{ background: v.color, fontSize: 15 }}>{v.label}</span>}{isBest && <span className="ri-win-tag"><Leaf /> front-runner</span>}<span className="ri-att-actions"><button className="ri-mini" onClick={() => onEditBatch(a)}>Edit</button><button className="ri-mini warn" onClick={() => onDeleteBatch(a)}>Delete</button></span></div>
                  {a.changes && <div className="ri-att-changes"><b className="ri-hand">What I changed</b>{a.changes}</div>}
                  {a.result && <div className="ri-att-changes" style={{ marginTop: 8 }}><b className="ri-hand">How it went</b>{a.result}</div>}
                  <div className="ri-att-scores">{METRICS.map((m) => <span className="s" key={m.id}>{m.name}<Pips value={a[m.id] || 0} /></span>)}<span className="s" style={{ fontWeight: 600, color: "var(--sage-deep)" }}>{expScore(a)}/15</span></div>
                </div>); })}
          </div>
        </div>
        <div className="ri-sheet-foot"><button className="ri-primary" onClick={onLogBatch}>+ Log a test batch</button>{attempts.length >= 2 && <button className="ri-ghost" onClick={onCompare}>Compare batches</button>}<button className="ri-ghost" onClick={onEdit}>Edit base</button>{attempts.length > 0 && <button className="ri-ghost" onClick={onShip} style={{ marginLeft: "auto", color: "var(--sage-deep)", fontWeight: 600 }}>Ship best to pantry →</button>}</div>
      </div>
    </div>
  );
}
function AttemptForm({ exp, initial, onClose, onSave }) {
  const nextN = initial ? initial.n : ((exp.attempts || []).reduce((m, a) => Math.max(m, a.n), 0) + 1);
  const [f, setF] = useState(() => initial || { id: newId(), n: nextN, date: new Date().toISOString().slice(0, 10), changes: "", result: "", taste: 0, texture: 0, looks: 0, verdict: "tweak", photo: null });
  const [busy, setBusy] = useState(false);
  const fileRef = useRef();
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const onFile = async (e) => { const file = e.target.files && e.target.files[0]; if (!file) return; setBusy(true); set("photo", await shrinkImage(file)); setBusy(false); };
  useEffect(() => { const k = (e) => e.key === "Escape" && onClose(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);
  return (
    <div className="ri-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ri-sheet" role="dialog" aria-modal="true" aria-label="Log a batch">
        <div className="ri-sheet-head"><h2>Batch v{f.n} · {exp.title}</h2><button className="ri-x" onClick={onClose} aria-label="Close">×</button></div>
        <div className="ri-sheet-body">
          <div className="ri-field"><label className="ri-label">Date baked</label><input type="date" className="ri-input" value={f.date} onChange={(e) => set("date", e.target.value)} /></div>
          <div className="ri-field"><label className="ri-label">What did you change this time?</label><textarea className="ri-area" value={f.changes} autoFocus onChange={(e) => set("changes", e.target.value)} style={{ minHeight: 70 }} placeholder="Swapped in 30g more brown sugar, chilled 48h." /></div>
          <div className="ri-field"><label className="ri-label">How did it turn out?</label><textarea className="ri-area" value={f.result} onChange={(e) => set("result", e.target.value)} style={{ minHeight: 70 }} placeholder="Chewier and deeper flavor, but spread a little thin." /></div>
          <div className="ri-field"><label className="ri-label">Rate this batch</label>{METRICS.map((m) => <div className="ri-rate" key={m.id}><span className="ri-rate-name">{m.name}</span><Pips value={f[m.id]} onChange={(v) => set(m.id, v)} /></div>)}</div>
          <div className="ri-field"><label className="ri-label">Verdict</label><div className="ri-verdicts">{Object.entries(VERDICTS).map(([k, v]) => <button key={k} type="button" className="ri-vbtn" data-on={f.verdict === k} style={f.verdict === k ? { color: v.color, borderColor: v.color } : undefined} onClick={() => set("verdict", k)}>{v.label}</button>)}</div></div>
          <div className="ri-field"><label className="ri-label">Photo of this batch <span className="ri-help">(optional)</span></label><div className="ri-photo-row"><div className="ri-thumb" style={f.photo ? { backgroundImage: `url(${f.photo})` } : undefined}>{!f.photo && <Flask />}</div><input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} /><button type="button" className="ri-filebtn" onClick={() => fileRef.current && fileRef.current.click()}>{busy ? "Processing…" : f.photo ? "Replace" : "Add a photo"}</button>{f.photo && <button type="button" className="ri-ghost" onClick={() => set("photo", null)}>Remove</button>}</div></div>
        </div>
        <div className="ri-sheet-foot"><button className="ri-primary" onClick={() => onSave(f)}>{initial ? "Save batch" : "Log batch"}</button><button className="ri-ghost" onClick={onClose}>Cancel</button></div>
      </div>
    </div>
  );
}
function CompareView({ e, onClose, onShip }) {
  const all = [...(e.attempts || [])].sort((a, b) => a.n - b.n);
  const [sel, setSel] = useState(() => new Set(all.slice(-3).map((a) => a.id)));
  const chosen = all.filter((a) => sel.has(a.id));
  useEffect(() => { const k = (ev) => ev.key === "Escape" && onClose(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);
  const maxOf = (key) => Math.max(0, ...chosen.map((a) => a[key] || 0));
  const maxTotal = Math.max(0, ...chosen.map(expScore));
  const winnerId = chosen.length ? [...chosen].sort((a, b) => expScore(b) - expScore(a) || b.n - a.n)[0].id : null;
  const toggle = (id) => setSel((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  return (
    <div className="ri-overlay" onMouseDown={(ev) => ev.target === ev.currentTarget && onClose()}>
      <div className="ri-sheet wide" role="dialog" aria-modal="true" aria-label="Compare batches">
        <div className="ri-sheet-head"><h2>Compare batches · {e.title}</h2><button className="ri-x" onClick={onClose} aria-label="Close">×</button></div>
        <div className="ri-sheet-body">
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 18 }}>{all.map((a) => <label key={a.id} className="ri-pick"><input type="checkbox" checked={sel.has(a.id)} onChange={() => toggle(a.id)} /> v{a.n}</label>)}</div>
          {chosen.length < 2 ? <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>Pick at least two batches to compare them side by side.</p> : (
            <div className="ri-cmp-scroll"><div className="ri-cmp">{chosen.map((a) => { const v = a.verdict && VERDICTS[a.verdict]; const win = a.id === winnerId; return (
              <div className={"ri-col" + (win ? " win" : "")} key={a.id}>
                <div className="ri-col-head"><div className="v">VERSION {a.n}</div><div className="d">{fmtDate(a.date)}</div>{win && <div style={{ marginTop: 4 }}><span className="ri-win-tag"><Leaf /> winner</span></div>}</div>
                {v && <div className="ri-cmp-row"><div className="k">Verdict</div><span className="ri-ribbon" style={{ background: v.color, fontSize: 15 }}>{v.label}</span></div>}
                {METRICS.map((m) => { const isb = (a[m.id] || 0) === maxOf(m.id) && maxOf(m.id) > 0; return <div className={"ri-cmp-row" + (isb ? " best" : "")} key={m.id}><div className="k">{m.name}{isb && " · best"}</div><Pips value={a[m.id] || 0} /></div>; })}
                <div className={"ri-cmp-row" + (expScore(a) === maxTotal && maxTotal > 0 ? " best" : "")}><div className="k">Total</div><div style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: 20, color: "var(--sage-deep)" }}>{expScore(a)}<span style={{ fontSize: 12, color: "var(--ink-soft)" }}>/15</span></div></div>
                {a.changes && <div className="ri-cmp-row"><div className="k">Changed</div><div className="ri-cmp-txt">{a.changes}</div></div>}
                {a.result && <div className="ri-cmp-row"><div className="k">Result</div><div className="ri-cmp-txt">{a.result}</div></div>}
                <div className="ri-cmp-row" style={{ borderBottom: "none" }}><button className="ri-mini" style={{ width: "100%", color: "var(--sage-deep)", borderColor: "var(--sage-soft)" }} onClick={() => onShip(a)}>Ship v{a.n} →</button></div>
              </div>); })}</div></div>
          )}
        </div>
        <div className="ri-sheet-foot"><button className="ri-ghost" onClick={onClose}>Close</button>{winnerId && <button className="ri-primary" style={{ marginLeft: "auto" }} onClick={() => onShip(chosen.find((a) => a.id === winnerId))}>Ship the winner →</button>}</div>
      </div>
    </div>
  );
}

/* ============================ MENUS ============================ */
function MenusView({ menus, recipes, sel, loading, onSelect, onNew, onRename, onDelete, onAdd, onRemove, onMove, onReorder, onSave, onGrocery }) {
  const active = menus.find((m) => m.id === sel) || menus[0] || null;
  useEffect(() => { if (!sel && menus[0]) onSelect(menus[0].id); }, [menus, sel, onSelect]);
  if (loading) return <Empty icon="menu" title="Setting the table…" body="Gathering your menus." />;
  if (menus.length === 0) return <Empty icon="menu" title="No menus yet" body="Plan a dinner party or a week of bakes. Add recipes into courses, save it, and we'll roll up a grocery list for you." cta={{ label: "Create a menu", onClick: onNew }} />;
  return (
    <div>
      <div className="ri-mtabs">
        {menus.map((m) => <button key={m.id} className="ri-mtab" data-on={active && active.id === m.id} onClick={() => onSelect(m.id)}>{m.title || "Untitled"}</button>)}
        <button className="ri-new" style={{ marginLeft: 0 }} onClick={onNew}>+ New menu</button>
      </div>
      {active && <MenuEditor key={active.id} menu={active} recipes={recipes} onRename={onRename} onDelete={onDelete} onAdd={onAdd} onRemove={onRemove} onMove={onMove} onReorder={onReorder} onSave={onSave} onGrocery={onGrocery} />}
    </div>
  );
}

function SectionZone({ menu, sectionKey, label, recipes, onAdd, onRemove, onMove, onReorder }) {
  const ids = (menu.sections && menu.sections[sectionKey]) || [];
  const items = ids.map((id) => recipes.find((r) => r.id === id)).filter(Boolean);
  const [over, setOver] = useState(false);
  const dragFrom = useRef(null);
  const [dragId, setDragId] = useState(null);
  const rowRefs = useRef({});
  const pointerDown = (e, idx) => { e.currentTarget.setPointerCapture && e.currentTarget.setPointerCapture(e.pointerId); dragFrom.current = idx; setDragId(ids[idx]); };
  const pointerMove = (e) => {
    if (dragFrom.current == null) return;
    const y = e.clientY; let target = dragFrom.current;
    ids.forEach((id, i) => { const el = rowRefs.current[id]; if (!el) return; const rc = el.getBoundingClientRect(); const mid = rc.top + rc.height / 2; if (i < dragFrom.current && y < mid) target = Math.min(target, i); if (i > dragFrom.current && y > mid) target = Math.max(target, i); });
    if (target !== dragFrom.current) { const arr = ids.slice(); const [m] = arr.splice(dragFrom.current, 1); arr.splice(target, 0, m); onReorder(menu.id, sectionKey, arr); dragFrom.current = target; }
  };
  const pointerUp = () => { dragFrom.current = null; setDragId(null); };
  const onDrop = (e) => { e.preventDefault(); setOver(false); const rid = e.dataTransfer.getData("text/recipe"); if (rid) onAdd(menu.id, rid, sectionKey); };
  return (
    <div className="ri-msec">
      <h4>{label} <span className="ct">· {items.length}</span></h4>
      <div className={"ri-secdrop" + (over ? " over" : "")} onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={onDrop} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp}>
        {items.length === 0 ? <div className="ri-secdrop-empty">Nothing here yet — add a dish below or drag one in.</div>
          : items.map((r) => { const c = catOf(r.category); return (
            <div key={r.id} className={"ri-mitem" + (dragId === r.id ? " dragging" : "")} ref={(el) => (rowRefs.current[r.id] = el)}>
              <span className="ri-handle" onPointerDown={(e) => pointerDown(e, ids.indexOf(r.id))} aria-label="Drag to reorder"><GripIcon /></span>
              <div className="ri-mitem-body"><div className="ri-mitem-title">{r.title}</div><div className="ri-card-cat" style={{ color: c.hue, marginTop: 2 }}>{c.label}</div></div>
              <div className="ri-mitem-actions"><select className="ri-msel" value={sectionKey} onChange={(e) => onMove(menu.id, r.id, e.target.value)} aria-label="Move to course">{SECTIONS.map(([k, lab]) => <option key={k} value={k}>{lab}</option>)}</select><button className="ri-mini warn" onClick={() => onRemove(menu.id, r.id)}>Remove</button></div>
            </div>); })}
      </div>
    </div>
  );
}

function MenuEditor({ menu, recipes, onRename, onDelete, onAdd, onRemove, onMove, onReorder, onSave, onGrocery }) {
  const [activeSection, setActiveSection] = useState("entree");
  const inMenu = allMenuIds(menu);
  const count = inMenu.length;
  return (
    <div className="ri-mcard">
      <input className="ri-mtitle-in" value={menu.title} onChange={(e) => onRename(menu.id, e.target.value)} placeholder="Name this menu…" />
      <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{count} {count === 1 ? "dish" : "dishes"} across four courses · drag the handle to reorder, or use the dropdown to move a dish</div>

      {SECTIONS.map(([k, lab]) => <SectionZone key={k} menu={menu} sectionKey={k} label={lab} recipes={recipes} onAdd={onAdd} onRemove={onRemove} onMove={onMove} onReorder={onReorder} />)}

      <div className="ri-pal">
        <h5>Add from your pantry</h5>
        {recipes.length === 0 ? <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>Your pantry is empty — add some recipes first.</div> : (
          <>
            <div className="ri-addseg"><span className="al">Add to:</span>{SECTIONS.map(([k, lab]) => <button key={k} data-on={activeSection === k} onClick={() => setActiveSection(k)}>{lab}</button>)}</div>
            <div className="ri-pal-grid">{recipes.map((r) => { const has = inMenu.includes(r.id); return (
              <button key={r.id} className="ri-pchip" data-in={has} draggable={!has} onClick={() => !has && onAdd(menu.id, r.id, activeSection)} onDragStart={(e) => e.dataTransfer.setData("text/recipe", r.id)} title={has ? "Already on the menu" : `Add to ${activeSection}`}>{!has && <span className="plus">+</span>}{r.title}</button>); })}</div>
          </>
        )}
      </div>

      <div className="ri-sheet-foot" style={{ background: "transparent", borderTop: "1px solid var(--line)", padding: "16px 0 0", marginTop: 18 }}>
        <button className="ri-primary" onClick={() => onSave(menu)} disabled={count === 0}>Save & make grocery list</button>
        <button className="ri-ghost" onClick={() => onGrocery(menu.id)} disabled={count === 0} style={{ color: "var(--plum)" }}>Grocery list</button>
        <button className="ri-ghost ri-del" onClick={() => onDelete(menu.id)}>Delete menu</button>
      </div>
    </div>
  );
}

function GroceryModal({ menu, recipes, onClose, flash }) {
  const consolidated = useMemo(() => buildGrocery(menu, recipes), [menu, recipes]);
  const byDish = useMemo(() => {
    const out = [];
    SECTIONS.forEach(([k, label]) => {
      const ids = (menu.sections && menu.sections[k]) || [];
      ids.forEach((rid) => { const r = recipes.find((x) => x.id === rid); if (!r) return; const lines = rawLines(r.ingredients); if (lines.length) out.push({ section: label, title: r.title, rid, lines }); });
    });
    return out;
  }, [menu, recipes]);

  const [view, setView] = useState("consolidated");
  const [checked, setChecked] = useState(() => new Set());
  useEffect(() => { let go = true; (async () => { if (hasStore) { try { const r = await window.storage.get("groceryck:" + menu.id, false); if (go && r) setChecked(new Set(JSON.parse(r.value))); } catch {} } })(); return () => { go = false; }; }, [menu.id]);
  useEffect(() => { const k = (e) => e.key === "Escape" && onClose(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);
  const persist = (set) => { if (hasStore) window.storage.set("groceryck:" + menu.id, JSON.stringify([...set]), false).catch(() => {}); };
  const toggle = (key) => setChecked((prev) => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); persist(n); return n; });
  const reset = () => { const n = new Set(); setChecked(n); persist(n); };

  let total = 0, done = 0;
  if (view === "consolidated") { total = consolidated.length; done = consolidated.filter((l) => checked.has("c:" + l.name)).length; }
  else { byDish.forEach((d) => d.lines.forEach((_, i) => { total++; if (checked.has("d:" + d.rid + ":" + i)) done++; })); }

  const copy = async () => {
    let text = `GROCERY LIST — ${menu.title || "Menu"}\n`;
    if (view === "consolidated") { text += "\n" + consolidated.map((l) => `${checked.has("c:" + l.name) ? "[x]" : "[ ]"} ${l.qty ? l.qty + " " : ""}${l.name}`).join("\n"); }
    else { let lastSec = ""; byDish.forEach((d) => { if (d.section !== lastSec) { text += `\n${d.section.toUpperCase()}`; lastSec = d.section; } text += `\n  ${d.title}:`; d.lines.forEach((l, i) => { text += `\n  ${checked.has("d:" + d.rid + ":" + i) ? "[x]" : "[ ]"} ${l}`; }); }); }
    try { await navigator.clipboard.writeText(text.trim()); flash("Grocery list copied 🛒"); } catch { flash("Couldn't copy"); }
  };

  const empty = consolidated.length === 0;
  let lastSec = "";
  return (
    <div className="ri-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ri-sheet" role="dialog" aria-modal="true" aria-label="Grocery list">
        <div className="ri-sheet-head"><h2>🛒 Grocery list <span style={{ fontFamily: "'Caveat',cursive", fontSize: 19, color: "var(--pink-deep)", fontWeight: 600 }}>{menu.title}</span></h2><button className="ri-x" onClick={onClose} aria-label="Close">×</button></div>
        <div className="ri-sheet-body">
          {empty ? <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>No ingredients yet — add a few recipes to the menu first.</p> : (
            <>
              <div className="ri-gtools">
                <span className="ri-seg">{[["consolidated", "Consolidated"], ["dish", "By dish"]].map(([k, lab]) => <button key={k} data-on={view === k} onClick={() => setView(k)}>{lab}</button>)}</span>
                <span className="ri-gprog">{done} of {total} gathered{done > 0 && <> · <button className="ri-greset" onClick={reset}>reset</button></>}</span>
              </div>
              {view === "consolidated" ? (
                <>
                  <p style={{ fontSize: 12.5, color: "var(--ink-soft)", margin: "0 0 10px", lineHeight: 1.5 }}>Like items combined across the whole menu (weights in grams, volumes in millilitres). Tap an item to cross it off.</p>
                  <ul className="ri-groc">{consolidated.map((l, i) => { const key = "c:" + l.name; const on = checked.has(key); return <li key={i} className={on ? "done" : ""} onClick={() => toggle(key)} role="button" aria-pressed={on}>{l.qty && <span className="qty">{l.qty} </span>}{l.name}</li>; })}</ul>
                </>
              ) : (
                <>
                  <p style={{ fontSize: 12.5, color: "var(--ink-soft)", margin: "0 0 10px", lineHeight: 1.5 }}>Each dish's ingredients as written. Tap an item to cross it off.</p>
                  {byDish.map((d) => { const head = d.section !== lastSec ? d.section : null; lastSec = d.section; return (
                    <div key={d.rid}>
                      {head && <div className="ri-ghead">{head}</div>}
                      <div className="ri-gdish">{d.title}</div>
                      <ul className="ri-groc">{d.lines.map((l, i) => { const key = "d:" + d.rid + ":" + i; const on = checked.has(key); return <li key={i} className={on ? "done" : ""} onClick={() => toggle(key)} role="button" aria-pressed={on}>{l}</li>; })}</ul>
                    </div>); })}
                </>
              )}
            </>
          )}
        </div>
        <div className="ri-sheet-foot"><button className="ri-primary" onClick={copy} disabled={empty}>Copy grocery list</button><button className="ri-ghost" onClick={onClose}>Done</button></div>
      </div>
    </div>
  );
}


/* ============================ EMPTY + ICONS ============================ */
function Empty({ icon, title, body, cta }) {
  const Icon = { jar: Jar, flask: Flask, menu: MenuIcon, pot: Pot }[icon] || Pot;
  return (<div className="ri-empty"><div style={{ color: "var(--sage-soft)" }}><Icon big /></div><h3>{title}</h3><p>{body}</p>{cta && <button className="ri-primary" onClick={cta.onClick}>{cta.label}</button>}</div>);
}
function EmptyForMode({ mode, filtered, onNew }) {
  if (filtered) return <Empty icon="pot" title="Nothing matches" body="Try a different search or category." />;
  if (mode === "pantry") return <Empty icon="jar" title="Your pantry is bare" body="Log the first thing you made — how it turned out, what you'd change, and whether it earns a repeat." cta={{ label: "Add your first recipe", onClick: onNew }} />;
  return <Empty icon="flask" title="The test kitchen is quiet" body="Start an experiment for a recipe you're dialing in. Log each batch, rate it, compare versions, then ship the winner." cta={{ label: "Start an experiment", onClick: onNew }} />;
}
function Pips({ value, onChange }) {
  const read = !onChange;
  return (<span className="ri-pips">{[1, 2, 3, 4, 5].map((i) => <button key={i} type="button" className={"ri-pip" + (read ? " read" : "")} data-on={i <= value} onClick={read ? undefined : () => onChange(i === value ? i - 1 : i)} aria-label={`${i} of 5`} tabIndex={read ? -1 : 0} />)}</span>);
}
function Heart() { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 20s-7-4.6-9.2-9C1.4 8 3 4.8 6.2 4.8c2 0 3.2 1.3 3.8 2.3.6-1 1.8-2.3 3.8-2.3 3.2 0 4.8 3.2 3.4 6.2C19 15.4 12 20 12 20Z" fill="#EDA9A2" stroke="#D9847F" strokeWidth="1.2" strokeLinejoin="round"/></svg>); }
function Plate({ big }) { const s = big ? 54 : 34; return (<svg width={s} height={s} viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="24" cy="24" r="19" stroke="currentColor" strokeWidth="1.6" opacity=".7"/><circle cx="24" cy="24" r="11" stroke="currentColor" strokeWidth="1.3" opacity=".5"/></svg>); }
function Flask({ big, on }) { const s = big ? 50 : 22; const col = on ? "#fff" : "currentColor"; return (<svg width={s} height={s} viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M20 7v12L11 35a4 4 0 0 0 3.5 6h19a4 4 0 0 0 3.5-6L28 19V7" stroke={col} strokeWidth="2" strokeLinejoin="round"/><path d="M17 7h14" stroke={col} strokeWidth="2" strokeLinecap="round"/><path d="M16 30h16" stroke={col} strokeWidth="1.6" opacity=".6"/></svg>); }
function Jar({ big, on }) { const s = big ? 50 : 22; const col = on ? "#fff" : "currentColor"; return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="6" y="8" width="12" height="13" rx="3" stroke={col} strokeWidth="1.7"/><path d="M8 8V6a4 4 0 0 1 8 0v2" stroke={col} strokeWidth="1.7"/><path d="M6 13h12" stroke={col} strokeWidth="1.4" opacity=".6"/></svg>); }
function Pot({ big }) { const s = big ? 50 : 22; return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 10h16v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M2 10h20M7 10V8m10 2V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>); }
function Whisk({ big, on }) { const s = big ? 50 : 22; const col = on ? "#fff" : "currentColor"; return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v9m0 0c-3 0-5 3-5 6m5-6c3 0 5 3 5 6M9 5c-1.5 1.5-2 5-2 9m8-9c1.5 1.5 2 5 2 9" stroke={col} strokeWidth="1.6" strokeLinecap="round"/></svg>); }
function MenuIcon({ big, on }) { const s = big ? 50 : 22; const col = on ? "#fff" : "currentColor"; return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2.5" stroke={col} strokeWidth="1.6"/><path d="M9 8h6M9 12h6M9 16h3" stroke={col} strokeWidth="1.6" strokeLinecap="round"/></svg>); }
function Leaf() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19c0-7 6-13 14-14-1 8-6 14-14 14Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M5 19C9 15 13 11 17 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>); }
function GripIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg>); }
function Magnifier() { return (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="#B4A689" strokeWidth="2"/><path d="M20 20l-3.5-3.5" stroke="#B4A689" strokeWidth="2" strokeLinecap="round"/></svg>); }
function ChevronIcon({ dir }) { const rot = dir === "left" ? 0 : 180; return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transform: `rotate(${rot}deg)` }}><path d="M14 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function Bars() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>); }
