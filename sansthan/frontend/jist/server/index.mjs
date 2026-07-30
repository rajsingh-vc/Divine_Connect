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
	"/assets/admin-BUGGnBkY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23a-FLfhk830K+sWkRl36NWP96XW7WI\"",
		"mtime": "2026-07-30T05:03:27.957Z",
		"size": 570,
		"path": "../public/assets/admin-BUGGnBkY.js"
	},
	"/assets/admin.ai-CkR0YK5q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b90-PWu0vkxHm3/5tl/XYNJQ30xQuHA\"",
		"mtime": "2026-07-30T05:03:27.957Z",
		"size": 2960,
		"path": "../public/assets/admin.ai-CkR0YK5q.js"
	},
	"/assets/admin.communication-DYQo25V_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"95b-/6XmDREuTSfd2WDUQVshS0zuwIo\"",
		"mtime": "2026-07-30T05:03:27.974Z",
		"size": 2395,
		"path": "../public/assets/admin.communication-DYQo25V_.js"
	},
	"/assets/admin.cms-CIxSxvTY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9433-MuOlqOHHobdmb0hsJFOoBJ90QWs\"",
		"mtime": "2026-07-30T05:03:27.957Z",
		"size": 37939,
		"path": "../public/assets/admin.cms-CIxSxvTY.js"
	},
	"/assets/admin.donations-D4bBUDVN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"34ca-32Cf1N/eK9beIpInl0yM2tH+uRc\"",
		"mtime": "2026-07-30T05:03:27.974Z",
		"size": 13514,
		"path": "../public/assets/admin.donations-D4bBUDVN.js"
	},
	"/assets/admin.events-BHPf7nuy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6f1-bbQ/2/bJsdltc0Heg8Ay4PbdG/0\"",
		"mtime": "2026-07-30T05:03:27.978Z",
		"size": 1777,
		"path": "../public/assets/admin.events-BHPf7nuy.js"
	},
	"/assets/admin.devotees-XCotkzX2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24f5-FVsjrSvRMa6C+Uayl/2MRwXumr4\"",
		"mtime": "2026-07-30T05:03:27.974Z",
		"size": 9461,
		"path": "../public/assets/admin.devotees-XCotkzX2.js"
	},
	"/assets/admin.bookings-UQToKSMP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6c0c8-Ozho57l4K5MQplaYhLakineAhF4\"",
		"mtime": "2026-07-30T05:03:27.957Z",
		"size": 442568,
		"path": "../public/assets/admin.bookings-UQToKSMP.js"
	},
	"/assets/admin.command-DFh-s-gO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"acb-XSUgUGkePA3jncAminpYXX0d4SA\"",
		"mtime": "2026-07-30T05:03:27.973Z",
		"size": 2763,
		"path": "../public/assets/admin.command-DFh-s-gO.js"
	},
	"/assets/admin.index-CTLB8xHW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"42fe-HxZHO9eNQcmkvz1c3tRBQ0XDFTw\"",
		"mtime": "2026-07-30T05:03:27.979Z",
		"size": 17150,
		"path": "../public/assets/admin.index-CTLB8xHW.js"
	},
	"/assets/admin.inventory-Dd3s-Po8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8cb-JzIAhaydTKNpg/ovboO2zm69i8w\"",
		"mtime": "2026-07-30T05:03:27.979Z",
		"size": 2251,
		"path": "../public/assets/admin.inventory-Dd3s-Po8.js"
	},
	"/assets/admin.reports-DFinHBQk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"964-VK/Aa/1KTuF5of7j53X+PFoq3qQ\"",
		"mtime": "2026-07-30T05:03:27.981Z",
		"size": 2404,
		"path": "../public/assets/admin.reports-DFinHBQk.js"
	},
	"/assets/admin.platform-ByfPL6gc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d0a-KbVVf6L4uz2GAWFyunhcGjiVfAo\"",
		"mtime": "2026-07-30T05:03:27.979Z",
		"size": 3338,
		"path": "../public/assets/admin.platform-ByfPL6gc.js"
	},
	"/assets/admin.sevas-BhMetPLD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4f85-zuVlt4wryXVG88vYKKW5wKhul/o\"",
		"mtime": "2026-07-30T05:03:27.981Z",
		"size": 20357,
		"path": "../public/assets/admin.sevas-BhMetPLD.js"
	},
	"/assets/admin.visitors-S8z6_1vy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"777-f3pJ3vw1NDzDrglTkUTZDlq0oCE\"",
		"mtime": "2026-07-30T05:03:27.985Z",
		"size": 1911,
		"path": "../public/assets/admin.visitors-S8z6_1vy.js"
	},
	"/assets/admin.volunteer-approvals-Dh-PfsGK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2f68-GUkX+ICZPsXbgz2SCDCsKAZHHk0\"",
		"mtime": "2026-07-30T05:03:27.987Z",
		"size": 12136,
		"path": "../public/assets/admin.volunteer-approvals-Dh-PfsGK.js"
	},
	"/assets/admin.tasks-CQPUZXA2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"34c0-EmshqvzQtkgS9a856WtrZZQub/8\"",
		"mtime": "2026-07-30T05:03:27.981Z",
		"size": 13504,
		"path": "../public/assets/admin.tasks-CQPUZXA2.js"
	},
	"/assets/api-CKcPKFit.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"175d-dryNmuQBPfY54qRqyljFXyIEz6o\"",
		"mtime": "2026-07-30T05:03:27.988Z",
		"size": 5981,
		"path": "../public/assets/api-CKcPKFit.js"
	},
	"/assets/admin.volunteers-kfzgqQTR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5440-Ti9EN8nd8TwPd5QlaH8E0bIJ6XU\"",
		"mtime": "2026-07-30T05:03:27.988Z",
		"size": 21568,
		"path": "../public/assets/admin.volunteers-kfzgqQTR.js"
	},
	"/assets/apply-volunteer-lOGMi18h.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3221-RRSoJW5C82WUTdDlxL1w6a16y7g\"",
		"mtime": "2026-07-30T05:03:27.988Z",
		"size": 12833,
		"path": "../public/assets/apply-volunteer-lOGMi18h.js"
	},
	"/assets/badges-IEguGb5Y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"63a-/Edzz5nJEOKAwc4iBt8XPlALeZw\"",
		"mtime": "2026-07-30T05:03:27.988Z",
		"size": 1594,
		"path": "../public/assets/badges-IEguGb5Y.js"
	},
	"/assets/bot-B8nGwhr5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"148-578VeMEqEHImz+Arw0ipBafHsmo\"",
		"mtime": "2026-07-30T05:03:27.988Z",
		"size": 328,
		"path": "../public/assets/bot-B8nGwhr5.js"
	},
	"/assets/calendar-days-DeprlgXL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ee-IMnUSHyYp0scM9JVgSCLQrOKbQQ\"",
		"mtime": "2026-07-30T05:03:27.996Z",
		"size": 494,
		"path": "../public/assets/calendar-days-DeprlgXL.js"
	},
	"/assets/chart-card-Q3gbcjfG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3f8-51m+MRWDAR66yY1lHQD1BnNfrAI\"",
		"mtime": "2026-07-30T05:03:27.998Z",
		"size": 1016,
		"path": "../public/assets/chart-card-Q3gbcjfG.js"
	},
	"/assets/boxes-0_duU_Iv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"353-TNTC4YH1Xbv8nHVgzmY9oDZD/SE\"",
		"mtime": "2026-07-30T05:03:27.993Z",
		"size": 851,
		"path": "../public/assets/boxes-0_duU_Iv.js"
	},
	"/assets/chart-column-DdY_VJrw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fb-iU0hHnCU9HzEmOX9I8APo2l+/TI\"",
		"mtime": "2026-07-30T05:03:27.998Z",
		"size": 251,
		"path": "../public/assets/chart-column-DdY_VJrw.js"
	},
	"/assets/circle-check-C43RmtM6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b2-f+GbPvSaaUII/crFiHhCyQohjrE\"",
		"mtime": "2026-07-30T05:03:28.000Z",
		"size": 178,
		"path": "../public/assets/circle-check-C43RmtM6.js"
	},
	"/assets/clock-2JLfFbN6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a9-+NbR4R3/XlYSkhnxdJwrh1h1WPQ\"",
		"mtime": "2026-07-30T05:03:28.000Z",
		"size": 169,
		"path": "../public/assets/clock-2JLfFbN6.js"
	},
	"/assets/check-4oJCEu7l.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7c-zkp3r4qNoyEBh3sFB5HahH9ZWuA\"",
		"mtime": "2026-07-30T05:03:28.000Z",
		"size": 124,
		"path": "../public/assets/check-4oJCEu7l.js"
	},
	"/assets/data-table-D0VvRmmg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"423-jTcxA0wFUM1GTikdyb/HavS44rc\"",
		"mtime": "2026-07-30T05:03:28.000Z",
		"size": 1059,
		"path": "../public/assets/data-table-D0VvRmmg.js"
	},
	"/assets/createLucideIcon-BJc-iHgg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d7-U6pgyd+1Uu5gRnAOI17RmidGww0\"",
		"mtime": "2026-07-30T05:03:28.000Z",
		"size": 1239,
		"path": "../public/assets/createLucideIcon-BJc-iHgg.js"
	},
	"/assets/download-Dk7T_VPf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e8-jSJIwsW3Oaq6eVQQJ31wK/tqBq0\"",
		"mtime": "2026-07-30T05:03:28.000Z",
		"size": 232,
		"path": "../public/assets/download-Dk7T_VPf.js"
	},
	"/assets/dashboard-DaxUVwRA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"641-ZpwlUnAIlS+DiwOR2s4RMjHWAes\"",
		"mtime": "2026-07-30T05:03:28.000Z",
		"size": 1601,
		"path": "../public/assets/dashboard-DaxUVwRA.js"
	},
	"/assets/confirm-dialog-D23AECrS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"abe1-F6qKYhqu02JVKzhMi7CflowTBME\"",
		"mtime": "2026-07-30T05:03:28.000Z",
		"size": 44001,
		"path": "../public/assets/confirm-dialog-D23AECrS.js"
	},
	"/assets/format-Bocb9i7u.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3bb-z1nEgQwaVpJv/qTixA+igUZJ5kM\"",
		"mtime": "2026-07-30T05:03:28.000Z",
		"size": 955,
		"path": "../public/assets/format-Bocb9i7u.js"
	},
	"/assets/forgot-password-lIN3WWHL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1115-ES4JoOSyHzHjORnanU1o6L9j3Uw\"",
		"mtime": "2026-07-30T05:03:28.000Z",
		"size": 4373,
		"path": "../public/assets/forgot-password-lIN3WWHL.js"
	},
	"/assets/heart-wcYPypG0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"102-IXwWKZrbzCAGe/gqNU7UtxAUWCs\"",
		"mtime": "2026-07-30T05:03:28.000Z",
		"size": 258,
		"path": "../public/assets/heart-wcYPypG0.js"
	},
	"/assets/gsb_seva_mandal-DmvpHHiS.png": {
		"type": "image/png",
		"etag": "\"52d9b-vPxWpNkUQZiTJUtOPd3qRLAKlKw\"",
		"mtime": "2026-07-30T05:03:28.035Z",
		"size": 339355,
		"path": "../public/assets/gsb_seva_mandal-DmvpHHiS.png"
	},
	"/assets/hand-heart-BEOVn_4K.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"356-d5wLXLyrGr4VwyDW58vE/LpxJgs\"",
		"mtime": "2026-07-30T05:03:28.000Z",
		"size": 854,
		"path": "../public/assets/hand-heart-BEOVn_4K.js"
	},
	"/assets/index-5npqwlPt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6fc19-rGuCB3Pbq+hQqYcPHkTyAJdCLbs\"",
		"mtime": "2026-07-30T05:03:27.957Z",
		"size": 457753,
		"path": "../public/assets/index-5npqwlPt.js"
	},
	"/assets/index.es-BVI-yroT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24f45-2wBoXcOrjrjtHtYUM9jmF1CHZKA\"",
		"mtime": "2026-07-30T05:03:28.010Z",
		"size": 151365,
		"path": "../public/assets/index.es-BVI-yroT.js"
	},
	"/assets/generateCategoricalChart-rr2plqvC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5a512-wHscpM7rimPWAXK34R7NF19b1a4\"",
		"mtime": "2026-07-30T05:03:28.000Z",
		"size": 369938,
		"path": "../public/assets/generateCategoricalChart-rr2plqvC.js"
	},
	"/assets/html2canvas-BswC5BpG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"30b8d-Gs4ApUtpd/B+5SV8XeHRaoGcry8\"",
		"mtime": "2026-07-30T05:03:28.010Z",
		"size": 199565,
		"path": "../public/assets/html2canvas-BswC5BpG.js"
	},
	"/assets/info-B5XO0Xmc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2fb-muznubDqb6XnYM8O5lBofFMwoPk\"",
		"mtime": "2026-07-30T05:03:28.010Z",
		"size": 763,
		"path": "../public/assets/info-B5XO0Xmc.js"
	},
	"/assets/link-Df23svoe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5b49-oMWVzJSACwnJALwJMKDfHsqktMU\"",
		"mtime": "2026-07-30T05:03:28.014Z",
		"size": 23369,
		"path": "../public/assets/link-Df23svoe.js"
	},
	"/assets/jsx-runtime-DRF4vMFQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1edb-lC00gjXxHcAWDdKhrb0gSnVSjVI\"",
		"mtime": "2026-07-30T05:03:28.014Z",
		"size": 7899,
		"path": "../public/assets/jsx-runtime-DRF4vMFQ.js"
	},
	"/assets/gsb_seva-DTV4GEtZ.png": {
		"type": "image/png",
		"etag": "\"1e1268-K7HIpjiEz0wr3TgIIvd7D94EHK0\"",
		"mtime": "2026-07-30T05:03:28.035Z",
		"size": 1970792,
		"path": "../public/assets/gsb_seva-DTV4GEtZ.png"
	},
	"/assets/login-DaLG0xtM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d7b-ZyXz+FIbWF6ZjuNHZs0yf6otogU\"",
		"mtime": "2026-07-30T05:03:28.014Z",
		"size": 3451,
		"path": "../public/assets/login-DaLG0xtM.js"
	},
	"/assets/message-square-C-oaNnxr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e9-X6oIUHbRLZL0rbLxPzW2wNFYV2k\"",
		"mtime": "2026-07-30T05:03:28.014Z",
		"size": 233,
		"path": "../public/assets/message-square-C-oaNnxr.js"
	},
	"/assets/loader-circle-BVm5x78x.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90-Reh4dwiqXnQ4WPhxbNaRImVH/sc\"",
		"mtime": "2026-07-30T05:03:28.014Z",
		"size": 144,
		"path": "../public/assets/loader-circle-BVm5x78x.js"
	},
	"/assets/pencil-C_caXWiX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"114-JsoYbF1jg/RSYrdoHU+EAhWbblA\"",
		"mtime": "2026-07-30T05:03:28.019Z",
		"size": 276,
		"path": "../public/assets/pencil-C_caXWiX.js"
	},
	"/assets/pagination-bar-BQgjB_JX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6e7-MLG/YPD9/dBbrTmpug9PkFI8gnM\"",
		"mtime": "2026-07-30T05:03:28.014Z",
		"size": 1767,
		"path": "../public/assets/pagination-bar-BQgjB_JX.js"
	},
	"/assets/phone-BpKKDNfa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e2-qUMQ5kvhwLjKEuswVFz1mhSXFmg\"",
		"mtime": "2026-07-30T05:03:28.019Z",
		"size": 482,
		"path": "../public/assets/phone-BpKKDNfa.js"
	},
	"/assets/play-DMgRS6vB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"be-oOCAzx6deF16bK9mi05E9fcrzI4\"",
		"mtime": "2026-07-30T05:03:28.019Z",
		"size": 190,
		"path": "../public/assets/play-DMgRS6vB.js"
	},
	"/assets/PieChart-Cb8up3au.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6502-MhoWF5HEN6RjZz9n6noI7E0VQTU\"",
		"mtime": "2026-07-30T05:03:27.957Z",
		"size": 25858,
		"path": "../public/assets/PieChart-Cb8up3au.js"
	},
	"/assets/plus-DskOaz9P.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-qk1qgxEm58tlcwUkKKFTJ374Cz8\"",
		"mtime": "2026-07-30T05:03:28.019Z",
		"size": 153,
		"path": "../public/assets/plus-DskOaz9P.js"
	},
	"/assets/react-dom-CEVbmmCH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e06-8Q4GwIZrJfmPgjH3ntZH8MmjVd8\"",
		"mtime": "2026-07-30T05:03:28.019Z",
		"size": 3590,
		"path": "../public/assets/react-dom-CEVbmmCH.js"
	},
	"/assets/purify.es-DuRL7t6i.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"68ff-UzqdquwlS23jMr/0lDNWmxy5AL0\"",
		"mtime": "2026-07-30T05:03:28.019Z",
		"size": 26879,
		"path": "../public/assets/purify.es-DuRL7t6i.js"
	},
	"/assets/search-BD7fbNc_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ae-4Pwd0NyviGdlzsorriKK2+9K3Tg\"",
		"mtime": "2026-07-30T05:03:28.019Z",
		"size": 174,
		"path": "../public/assets/search-BD7fbNc_.js"
	},
	"/assets/routes-DJ7LAi8J.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26-SoFMfAHVJ5oqB5t+mpFRoQvFIoc\"",
		"mtime": "2026-07-30T05:03:28.019Z",
		"size": 38,
		"path": "../public/assets/routes-DJ7LAi8J.js"
	},
	"/assets/rolldown-runtime-QTnfLwEv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b6-wnqLLSlp3SaE+lbe74bKNe5Rpds\"",
		"mtime": "2026-07-30T05:03:28.019Z",
		"size": 694,
		"path": "../public/assets/rolldown-runtime-QTnfLwEv.js"
	},
	"/assets/signup-jrLvjaPf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ff4-mhxrGsHKV3jM9MiQhIxf16emgUw\"",
		"mtime": "2026-07-30T05:03:28.019Z",
		"size": 4084,
		"path": "../public/assets/signup-jrLvjaPf.js"
	},
	"/assets/settings-v59i8gsC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e7-rdrLIWKoYRNm74FRmZ9QizyFtMM\"",
		"mtime": "2026-07-30T05:03:28.019Z",
		"size": 487,
		"path": "../public/assets/settings-v59i8gsC.js"
	},
	"/assets/shell-B6GL9jzZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"353f-/NCy9oEQO7BcWtEl4Tm+MWf+H2Y\"",
		"mtime": "2026-07-30T05:03:28.019Z",
		"size": 13631,
		"path": "../public/assets/shell-B6GL9jzZ.js"
	},
	"/assets/sparkles-CzNFf5qa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ee-CUBbqWpTa2Y8RHNVxjFJrsBm1sQ\"",
		"mtime": "2026-07-30T05:03:28.019Z",
		"size": 494,
		"path": "../public/assets/sparkles-CzNFf5qa.js"
	},
	"/assets/stat-card-BMgWIExx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3fd-930Ug6tiC7qoqpQk7iuBq186OQE\"",
		"mtime": "2026-07-30T05:03:28.019Z",
		"size": 1021,
		"path": "../public/assets/stat-card-BMgWIExx.js"
	},
	"/assets/styles-BhSPPaHs.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"16bca-DCwx79KMWlgCAXMrRm8nqbN0iRk\"",
		"mtime": "2026-07-30T05:03:28.043Z",
		"size": 93130,
		"path": "../public/assets/styles-BhSPPaHs.css"
	},
	"/assets/trending-up--Ug6piQk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"af-0F+xfzxFrjb28Z8S0yfdBxIXcxo\"",
		"mtime": "2026-07-30T05:03:28.027Z",
		"size": 175,
		"path": "../public/assets/trending-up--Ug6piQk.js"
	},
	"/assets/typeof-B5XbjTb1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10f-yPXEOGyFHb1Ws7OoWyWNEEBz4mQ\"",
		"mtime": "2026-07-30T05:03:28.029Z",
		"size": 271,
		"path": "../public/assets/typeof-B5XbjTb1.js"
	},
	"/assets/triangle-alert-CAAqoZfA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"109-qwN1ayr3qFN0UyTMnITtUcrvRNw\"",
		"mtime": "2026-07-30T05:03:28.029Z",
		"size": 265,
		"path": "../public/assets/triangle-alert-CAAqoZfA.js"
	},
	"/assets/trash-2-BJhxKnfb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"148-8wSILt6CIDyljC7AAwH/XUH/1ck\"",
		"mtime": "2026-07-30T05:03:28.027Z",
		"size": 328,
		"path": "../public/assets/trash-2-BJhxKnfb.js"
	},
	"/assets/upload-vSMOcxKa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"201-WKAOjI24fALNuuGf2oWG6NB9mcI\"",
		"mtime": "2026-07-30T05:03:28.029Z",
		"size": 513,
		"path": "../public/assets/upload-vSMOcxKa.js"
	},
	"/assets/useMutation-CvtiQz35.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8f6-Jibe02ZxrJ0rAU+YYEcn1HsPK7s\"",
		"mtime": "2026-07-30T05:03:28.031Z",
		"size": 2294,
		"path": "../public/assets/useMutation-CvtiQz35.js"
	},
	"/assets/user-check-DyweR5gj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f3-S/ayNwOVBqy1IDn1bRg7LXmpXAc\"",
		"mtime": "2026-07-30T05:03:28.035Z",
		"size": 243,
		"path": "../public/assets/user-check-DyweR5gj.js"
	},
	"/assets/useQuery-B9En83W5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"227d-3vEeJpYyLiLXJ4V01s1Jmz31UFU\"",
		"mtime": "2026-07-30T05:03:28.033Z",
		"size": 8829,
		"path": "../public/assets/useQuery-B9En83W5.js"
	},
	"/assets/useRouter-khAFy5ok.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c3-YQELCY82//GS+TsgMB0t4gRqflg\"",
		"mtime": "2026-07-30T05:03:28.033Z",
		"size": 195,
		"path": "../public/assets/useRouter-khAFy5ok.js"
	},
	"/assets/user-CrYmHlR8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c0-3ah38eZf6fXlO9jMMWCXUtbxXVY\"",
		"mtime": "2026-07-30T05:03:28.033Z",
		"size": 448,
		"path": "../public/assets/user-CrYmHlR8.js"
	},
	"/assets/x-CJiTQi3v.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a-6dwQdKMV8v+PLnU/bbptUiUHLZY\"",
		"mtime": "2026-07-30T05:03:28.035Z",
		"size": 154,
		"path": "../public/assets/x-CJiTQi3v.js"
	},
	"/assets/users-Bf9i7sdI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"132-PPQlNFp+HOhk2F4qOIan+de5PAQ\"",
		"mtime": "2026-07-30T05:03:28.035Z",
		"size": 306,
		"path": "../public/assets/users-Bf9i7sdI.js"
	},
	"/assets/utils-B6KiDbIe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6a7d-iNkBSvaSyIjvZOzWoTvEa49qwcI\"",
		"mtime": "2026-07-30T05:03:28.035Z",
		"size": 27261,
		"path": "../public/assets/utils-B6KiDbIe.js"
	},
	"/assets/volunteer-verification-DmHdR1mg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7ae-Ky7t7Tyy53wzvk93V6w7mQOyGBY\"",
		"mtime": "2026-07-30T05:03:28.035Z",
		"size": 1966,
		"path": "../public/assets/volunteer-verification-DmHdR1mg.js"
	},
	"/assets/volunteer-signup-DPD8uVAT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d50-NmWJR8JDlFApV6Y5b6PUmoRSrVQ\"",
		"mtime": "2026-07-30T05:03:28.035Z",
		"size": 3408,
		"path": "../public/assets/volunteer-signup-DPD8uVAT.js"
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
