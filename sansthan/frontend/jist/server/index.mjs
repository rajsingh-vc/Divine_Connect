globalThis.__nitro_main__ = import.meta.url;
import { a as FastResponse, n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/assets/admin.ai-CkR0YK5q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b90-PWu0vkxHm3/5tl/XYNJQ30xQuHA\"",
		"mtime": "2026-07-30T12:27:03.624Z",
		"size": 2960,
		"path": "../public/assets/admin.ai-CkR0YK5q.js"
	},
	"/assets/admin-Cb7_wter.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"235-C7UGisj9Lf2WI/7slQwP2gCysEE\"",
		"mtime": "2026-07-30T12:27:03.624Z",
		"size": 565,
		"path": "../public/assets/admin-Cb7_wter.js"
	},
	"/assets/admin.command-hqR1X-ZR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"acb-Cgg/TOCOClTeQ3XsBkTKfUIuMo8\"",
		"mtime": "2026-07-30T12:27:03.624Z",
		"size": 2763,
		"path": "../public/assets/admin.command-hqR1X-ZR.js"
	},
	"/assets/admin.communication-DEd7wgmg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"857-3DP71Qfvv0/y6Q82bhKEB+oPjt8\"",
		"mtime": "2026-07-30T12:27:03.624Z",
		"size": 2135,
		"path": "../public/assets/admin.communication-DEd7wgmg.js"
	},
	"/assets/admin.cms-BOfV8sUG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cd3e-p1jW657RLPk4FhvWknN4L99axvQ\"",
		"mtime": "2026-07-30T12:27:03.624Z",
		"size": 52542,
		"path": "../public/assets/admin.cms-BOfV8sUG.js"
	},
	"/assets/admin.events-rtAklv19.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6f1-+1OLmsfZSX4idbjaG2RnJgmPH2E\"",
		"mtime": "2026-07-30T12:27:03.624Z",
		"size": 1777,
		"path": "../public/assets/admin.events-rtAklv19.js"
	},
	"/assets/admin.donations-BqOQdcm4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"34ca-XSsJRyHBWk5C6EDeiahygHSK5aY\"",
		"mtime": "2026-07-30T12:27:03.624Z",
		"size": 13514,
		"path": "../public/assets/admin.donations-BqOQdcm4.js"
	},
	"/assets/admin.devotees-CmjndxqW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2524-izcTBDHr0x8kzwGX43W5G+mouWo\"",
		"mtime": "2026-07-30T12:27:03.624Z",
		"size": 9508,
		"path": "../public/assets/admin.devotees-CmjndxqW.js"
	},
	"/assets/admin.inventory-DR0UubJE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2951-9DXkfiqH6evk4N24uJyUcm10ePw\"",
		"mtime": "2026-07-30T12:27:03.640Z",
		"size": 10577,
		"path": "../public/assets/admin.inventory-DR0UubJE.js"
	},
	"/assets/admin.index-saWuvtZ8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"42fe-AzopiXAsdc73rC3vcg6z/Yxe8IU\"",
		"mtime": "2026-07-30T12:27:03.640Z",
		"size": 17150,
		"path": "../public/assets/admin.index-saWuvtZ8.js"
	},
	"/assets/admin.platform-ByfPL6gc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d0a-KbVVf6L4uz2GAWFyunhcGjiVfAo\"",
		"mtime": "2026-07-30T12:27:03.640Z",
		"size": 3338,
		"path": "../public/assets/admin.platform-ByfPL6gc.js"
	},
	"/assets/admin.sevas-D3G6lbS2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4faf-lxS9Ek8cYzC301MoKrcm6mC729U\"",
		"mtime": "2026-07-30T12:27:03.640Z",
		"size": 20399,
		"path": "../public/assets/admin.sevas-D3G6lbS2.js"
	},
	"/assets/admin.tasks-D8kI7xU_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"34ef-UFrLvXD70cjsug7H1TJ4K1bGFew\"",
		"mtime": "2026-07-30T12:27:03.642Z",
		"size": 13551,
		"path": "../public/assets/admin.tasks-D8kI7xU_.js"
	},
	"/assets/admin.visitors-CWdvy1ON.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"777-iifnqwOt723jyvpS0pvEg3r7qyI\"",
		"mtime": "2026-07-30T12:27:03.642Z",
		"size": 1911,
		"path": "../public/assets/admin.visitors-CWdvy1ON.js"
	},
	"/assets/admin.reports-DFinHBQk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"964-VK/Aa/1KTuF5of7j53X+PFoq3qQ\"",
		"mtime": "2026-07-30T12:27:03.640Z",
		"size": 2404,
		"path": "../public/assets/admin.reports-DFinHBQk.js"
	},
	"/assets/api-BM7CRODI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16a4-7kGhEwZT5brIXQxEwj8pG6sCS3o\"",
		"mtime": "2026-07-30T12:27:03.645Z",
		"size": 5796,
		"path": "../public/assets/api-BM7CRODI.js"
	},
	"/assets/admin.volunteer-approvals-KhetjRi_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2fb6-izNYz0zWLGWW/d/nMncN7Uabofk\"",
		"mtime": "2026-07-30T12:27:03.643Z",
		"size": 12214,
		"path": "../public/assets/admin.volunteer-approvals-KhetjRi_.js"
	},
	"/assets/admin.bookings-RlQKFi0L.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6c0f7-RnKj9tx2Ye/L89UsLXBKZZk/jZY\"",
		"mtime": "2026-07-30T12:27:03.624Z",
		"size": 442615,
		"path": "../public/assets/admin.bookings-RlQKFi0L.js"
	},
	"/assets/admin.volunteers-Sngi9OXW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5474-bOVYabKmvlt2rqpWYGWHmii0wA8\"",
		"mtime": "2026-07-30T12:27:03.643Z",
		"size": 21620,
		"path": "../public/assets/admin.volunteers-Sngi9OXW.js"
	},
	"/assets/api-CLQb9V_D.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b4a2-fX6f1SAdwQzSk/sfFKWNAm097xQ\"",
		"mtime": "2026-07-30T12:27:03.645Z",
		"size": 46242,
		"path": "../public/assets/api-CLQb9V_D.js"
	},
	"/assets/bot-B8nGwhr5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"148-578VeMEqEHImz+Arw0ipBafHsmo\"",
		"mtime": "2026-07-30T12:27:03.647Z",
		"size": 328,
		"path": "../public/assets/bot-B8nGwhr5.js"
	},
	"/assets/apply-volunteer-BeP2WZFT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3221-9PS7jFQOZLs9TivfsIZPIShoh34\"",
		"mtime": "2026-07-30T12:27:03.645Z",
		"size": 12833,
		"path": "../public/assets/apply-volunteer-BeP2WZFT.js"
	},
	"/assets/badges-IEguGb5Y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"63a-/Edzz5nJEOKAwc4iBt8XPlALeZw\"",
		"mtime": "2026-07-30T12:27:03.645Z",
		"size": 1594,
		"path": "../public/assets/badges-IEguGb5Y.js"
	},
	"/assets/boxes-0_duU_Iv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"353-TNTC4YH1Xbv8nHVgzmY9oDZD/SE\"",
		"mtime": "2026-07-30T12:27:03.649Z",
		"size": 851,
		"path": "../public/assets/boxes-0_duU_Iv.js"
	},
	"/assets/calendar-days-DeprlgXL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ee-IMnUSHyYp0scM9JVgSCLQrOKbQQ\"",
		"mtime": "2026-07-30T12:27:03.649Z",
		"size": 494,
		"path": "../public/assets/calendar-days-DeprlgXL.js"
	},
	"/assets/chart-column-DdY_VJrw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fb-iU0hHnCU9HzEmOX9I8APo2l+/TI\"",
		"mtime": "2026-07-30T12:27:03.652Z",
		"size": 251,
		"path": "../public/assets/chart-column-DdY_VJrw.js"
	},
	"/assets/chart-card-Q3gbcjfG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3f8-51m+MRWDAR66yY1lHQD1BnNfrAI\"",
		"mtime": "2026-07-30T12:27:03.649Z",
		"size": 1016,
		"path": "../public/assets/chart-card-Q3gbcjfG.js"
	},
	"/assets/check-4oJCEu7l.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7c-zkp3r4qNoyEBh3sFB5HahH9ZWuA\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 124,
		"path": "../public/assets/check-4oJCEu7l.js"
	},
	"/assets/circle-check-C43RmtM6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b2-f+GbPvSaaUII/crFiHhCyQohjrE\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 178,
		"path": "../public/assets/circle-check-C43RmtM6.js"
	},
	"/assets/clock-2JLfFbN6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a9-+NbR4R3/XlYSkhnxdJwrh1h1WPQ\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 169,
		"path": "../public/assets/clock-2JLfFbN6.js"
	},
	"/assets/dashboard-Mg-xBAXG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"63a-P+X2sPXFRxdecV2zXMgNQXMSKZo\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 1594,
		"path": "../public/assets/dashboard-Mg-xBAXG.js"
	},
	"/assets/createLucideIcon-BJc-iHgg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d7-U6pgyd+1Uu5gRnAOI17RmidGww0\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 1239,
		"path": "../public/assets/createLucideIcon-BJc-iHgg.js"
	},
	"/assets/confirm-dialog-D23AECrS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"abe1-F6qKYhqu02JVKzhMi7CflowTBME\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 44001,
		"path": "../public/assets/confirm-dialog-D23AECrS.js"
	},
	"/assets/download-Dk7T_VPf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e8-jSJIwsW3Oaq6eVQQJ31wK/tqBq0\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 232,
		"path": "../public/assets/download-Dk7T_VPf.js"
	},
	"/assets/data-table-D0VvRmmg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"423-jTcxA0wFUM1GTikdyb/HavS44rc\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 1059,
		"path": "../public/assets/data-table-D0VvRmmg.js"
	},
	"/assets/forgot-password-BHebG8j0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1139-0jikv1cGloDt/j4vqFd9C/od0GE\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 4409,
		"path": "../public/assets/forgot-password-BHebG8j0.js"
	},
	"/assets/format-Bocb9i7u.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3bb-z1nEgQwaVpJv/qTixA+igUZJ5kM\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 955,
		"path": "../public/assets/format-Bocb9i7u.js"
	},
	"/assets/gsb_seva_mandal-DmvpHHiS.png": {
		"type": "image/png",
		"etag": "\"52d9b-vPxWpNkUQZiTJUtOPd3qRLAKlKw\"",
		"mtime": "2026-07-30T12:27:03.669Z",
		"size": 339355,
		"path": "../public/assets/gsb_seva_mandal-DmvpHHiS.png"
	},
	"/assets/hand-heart-BEOVn_4K.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"356-d5wLXLyrGr4VwyDW58vE/LpxJgs\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 854,
		"path": "../public/assets/hand-heart-BEOVn_4K.js"
	},
	"/assets/heart-wcYPypG0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"102-IXwWKZrbzCAGe/gqNU7UtxAUWCs\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 258,
		"path": "../public/assets/heart-wcYPypG0.js"
	},
	"/assets/html2canvas-BswC5BpG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"30b8d-Gs4ApUtpd/B+5SV8XeHRaoGcry8\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 199565,
		"path": "../public/assets/html2canvas-BswC5BpG.js"
	},
	"/assets/index.es-BVI-yroT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24f45-2wBoXcOrjrjtHtYUM9jmF1CHZKA\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 151365,
		"path": "../public/assets/index.es-BVI-yroT.js"
	},
	"/assets/generateCategoricalChart-rr2plqvC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5a512-wHscpM7rimPWAXK34R7NF19b1a4\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 369938,
		"path": "../public/assets/generateCategoricalChart-rr2plqvC.js"
	},
	"/assets/info-B5XO0Xmc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2fb-muznubDqb6XnYM8O5lBofFMwoPk\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 763,
		"path": "../public/assets/info-B5XO0Xmc.js"
	},
	"/assets/jsx-runtime-DRF4vMFQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1edb-lC00gjXxHcAWDdKhrb0gSnVSjVI\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 7899,
		"path": "../public/assets/jsx-runtime-DRF4vMFQ.js"
	},
	"/assets/link-Df23svoe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5b49-oMWVzJSACwnJALwJMKDfHsqktMU\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 23369,
		"path": "../public/assets/link-Df23svoe.js"
	},
	"/assets/index-CSS-MHKc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"54c17-fNVok1x5X8s1BzC0gpqgQqguEUY\"",
		"mtime": "2026-07-30T12:27:03.624Z",
		"size": 347159,
		"path": "../public/assets/index-CSS-MHKc.js"
	},
	"/assets/loader-circle-BVm5x78x.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90-Reh4dwiqXnQ4WPhxbNaRImVH/sc\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 144,
		"path": "../public/assets/loader-circle-BVm5x78x.js"
	},
	"/assets/gsb_seva-DTV4GEtZ.png": {
		"type": "image/png",
		"etag": "\"1e1268-K7HIpjiEz0wr3TgIIvd7D94EHK0\"",
		"mtime": "2026-07-30T12:27:03.669Z",
		"size": 1970792,
		"path": "../public/assets/gsb_seva-DTV4GEtZ.png"
	},
	"/assets/pencil-C_caXWiX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"114-JsoYbF1jg/RSYrdoHU+EAhWbblA\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 276,
		"path": "../public/assets/pencil-C_caXWiX.js"
	},
	"/assets/message-square-C-oaNnxr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e9-X6oIUHbRLZL0rbLxPzW2wNFYV2k\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 233,
		"path": "../public/assets/message-square-C-oaNnxr.js"
	},
	"/assets/Match-BHTXA-9B.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"be53-ZpredhrYbUThLC84QsjuQnkONHU\"",
		"mtime": "2026-07-30T12:27:03.624Z",
		"size": 48723,
		"path": "../public/assets/Match-BHTXA-9B.js"
	},
	"/assets/plus-DskOaz9P.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-qk1qgxEm58tlcwUkKKFTJ374Cz8\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 153,
		"path": "../public/assets/plus-DskOaz9P.js"
	},
	"/assets/pagination-bar-BQgjB_JX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6e7-MLG/YPD9/dBbrTmpug9PkFI8gnM\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 1767,
		"path": "../public/assets/pagination-bar-BQgjB_JX.js"
	},
	"/assets/QueryClientProvider-CBSNk7VU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3bc5-3s1xfz2UpVCDZBiHqyjbqKZr2IA\"",
		"mtime": "2026-07-30T12:27:03.624Z",
		"size": 15301,
		"path": "../public/assets/QueryClientProvider-CBSNk7VU.js"
	},
	"/assets/login-xsBuVeIG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d76-T8aAS0uQLyWjzlMCHLukUnOpxik\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 3446,
		"path": "../public/assets/login-xsBuVeIG.js"
	},
	"/assets/play-DMgRS6vB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"be-oOCAzx6deF16bK9mi05E9fcrzI4\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 190,
		"path": "../public/assets/play-DMgRS6vB.js"
	},
	"/assets/routes-DJ7LAi8J.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26-SoFMfAHVJ5oqB5t+mpFRoQvFIoc\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 38,
		"path": "../public/assets/routes-DJ7LAi8J.js"
	},
	"/assets/purify.es-DuRL7t6i.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"68ff-UzqdquwlS23jMr/0lDNWmxy5AL0\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 26879,
		"path": "../public/assets/purify.es-DuRL7t6i.js"
	},
	"/assets/PieChart-Cb8up3au.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6502-MhoWF5HEN6RjZz9n6noI7E0VQTU\"",
		"mtime": "2026-07-30T12:27:03.624Z",
		"size": 25858,
		"path": "../public/assets/PieChart-Cb8up3au.js"
	},
	"/assets/react-dom-CEVbmmCH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e06-8Q4GwIZrJfmPgjH3ntZH8MmjVd8\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 3590,
		"path": "../public/assets/react-dom-CEVbmmCH.js"
	},
	"/assets/rolldown-runtime-QTnfLwEv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b6-wnqLLSlp3SaE+lbe74bKNe5Rpds\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 694,
		"path": "../public/assets/rolldown-runtime-QTnfLwEv.js"
	},
	"/assets/search-BD7fbNc_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ae-4Pwd0NyviGdlzsorriKK2+9K3Tg\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 174,
		"path": "../public/assets/search-BD7fbNc_.js"
	},
	"/assets/settings-v59i8gsC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e7-rdrLIWKoYRNm74FRmZ9QizyFtMM\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 487,
		"path": "../public/assets/settings-v59i8gsC.js"
	},
	"/assets/send-DRN-sZbe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c5-MWd4xFswBgYkHhHmmJO+RER6vUU\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 709,
		"path": "../public/assets/send-DRN-sZbe.js"
	},
	"/assets/signup-CBmGSST_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fef-uDX+pZPXDgBNzSD5F+hOYcS93H8\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 4079,
		"path": "../public/assets/signup-CBmGSST_.js"
	},
	"/assets/shell-ClujD71c.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"35d2-69y40dnnyUsTjXtvBM6e85dOdE0\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 13778,
		"path": "../public/assets/shell-ClujD71c.js"
	},
	"/assets/sparkles-CzNFf5qa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ee-CUBbqWpTa2Y8RHNVxjFJrsBm1sQ\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 494,
		"path": "../public/assets/sparkles-CzNFf5qa.js"
	},
	"/assets/stat-card-BMgWIExx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3fd-930Ug6tiC7qoqpQk7iuBq186OQE\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 1021,
		"path": "../public/assets/stat-card-BMgWIExx.js"
	},
	"/assets/styles-Qe9RAsdj.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"16d40-AIrEPrWofG6QtaYcTUCqI8AqX3w\"",
		"mtime": "2026-07-30T12:27:03.669Z",
		"size": 93504,
		"path": "../public/assets/styles-Qe9RAsdj.css"
	},
	"/assets/trash-2-BJhxKnfb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"148-8wSILt6CIDyljC7AAwH/XUH/1ck\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 328,
		"path": "../public/assets/trash-2-BJhxKnfb.js"
	},
	"/assets/triangle-alert-CAAqoZfA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"109-qwN1ayr3qFN0UyTMnITtUcrvRNw\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 265,
		"path": "../public/assets/triangle-alert-CAAqoZfA.js"
	},
	"/assets/trending-up--Ug6piQk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"af-0F+xfzxFrjb28Z8S0yfdBxIXcxo\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 175,
		"path": "../public/assets/trending-up--Ug6piQk.js"
	},
	"/assets/typeof-B5XbjTb1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10f-yPXEOGyFHb1Ws7OoWyWNEEBz4mQ\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 271,
		"path": "../public/assets/typeof-B5XbjTb1.js"
	},
	"/assets/upload-vSMOcxKa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"201-WKAOjI24fALNuuGf2oWG6NB9mcI\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 513,
		"path": "../public/assets/upload-vSMOcxKa.js"
	},
	"/assets/useQuery-B5Z9JMjv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2290-JpXfw90ris1qpnBzy2Cn+/dfPNY\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 8848,
		"path": "../public/assets/useQuery-B5Z9JMjv.js"
	},
	"/assets/users-Bf9i7sdI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"132-PPQlNFp+HOhk2F4qOIan+de5PAQ\"",
		"mtime": "2026-07-30T12:27:03.669Z",
		"size": 306,
		"path": "../public/assets/users-Bf9i7sdI.js"
	},
	"/assets/useMutation-DLMnhlHN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"925-0XFynyVNZCNTBT45bUaPuSAHDvU\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 2341,
		"path": "../public/assets/useMutation-DLMnhlHN.js"
	},
	"/assets/useMatch-Bvy72ZX9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4cd-65MTZMffsuZTy4l5XCG+HbZXPwI\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 1229,
		"path": "../public/assets/useMatch-Bvy72ZX9.js"
	},
	"/assets/user-check-DyweR5gj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f3-S/ayNwOVBqy1IDn1bRg7LXmpXAc\"",
		"mtime": "2026-07-30T12:27:03.668Z",
		"size": 243,
		"path": "../public/assets/user-check-DyweR5gj.js"
	},
	"/assets/useRouter-khAFy5ok.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c3-YQELCY82//GS+TsgMB0t4gRqflg\"",
		"mtime": "2026-07-30T12:27:03.653Z",
		"size": 195,
		"path": "../public/assets/useRouter-khAFy5ok.js"
	},
	"/assets/user-CrYmHlR8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c0-3ah38eZf6fXlO9jMMWCXUtbxXVY\"",
		"mtime": "2026-07-30T12:27:03.668Z",
		"size": 448,
		"path": "../public/assets/user-CrYmHlR8.js"
	},
	"/assets/volunteer-signup-EGLS8CH4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d4b-U2FZvcCB2L4mLXtFWhRK+4hEAmU\"",
		"mtime": "2026-07-30T12:27:03.669Z",
		"size": 3403,
		"path": "../public/assets/volunteer-signup-EGLS8CH4.js"
	},
	"/assets/x-CJiTQi3v.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a-6dwQdKMV8v+PLnU/bbptUiUHLZY\"",
		"mtime": "2026-07-30T12:27:03.669Z",
		"size": 154,
		"path": "../public/assets/x-CJiTQi3v.js"
	},
	"/assets/utils-B6KiDbIe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6a7d-iNkBSvaSyIjvZOzWoTvEa49qwcI\"",
		"mtime": "2026-07-30T12:27:03.669Z",
		"size": 27261,
		"path": "../public/assets/utils-B6KiDbIe.js"
	},
	"/assets/volunteer-verification-CNuEPXHL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7a7-GE2Vn70jsiqcHGU8sMV0AN3Txjw\"",
		"mtime": "2026-07-30T12:27:03.669Z",
		"size": 1959,
		"path": "../public/assets/volunteer-verification-CNuEPXHL.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_y8TpGb = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_y8TpGb
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
