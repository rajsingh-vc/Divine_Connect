export const dashboardStats = {
  liveVisitors: { value: "18,432", change: "+12.4%", trend: "up" },
  todaysBookings: { value: "1,284", change: "+6.8%", trend: "up" },
  todaysDonations: { value: "₹42.8L", change: "+18.2%", trend: "up" },
  volunteersOnDuty: { value: "612 / 720", change: "85%", trend: "up" },
  avgQueueWait: { value: "24 min", change: "-3 min", trend: "down" },
  parkingOccupancy: { value: "78%", change: "+4%", trend: "up" },
  medicalAlerts: { value: "3", change: "active", trend: "flat" },
  revenueMTD: { value: "₹8.4 Cr", change: "+22%", trend: "up" },
};

export const visitorFlow = Array.from({ length: 12 }).map((_, i) => ({
  hour: `${(i * 2).toString().padStart(2, "0")}:00`,
  visitors: Math.round(600 + Math.sin(i / 2) * 400 + i * 120),
  bookings: Math.round(80 + Math.cos(i / 2) * 40 + i * 8),
}));

export interface AiInsight { title: string; detail: string }
export const aiInsights: AiInsight[] = [
  { title: "Peak arrival predicted", detail: "Expect 4,200 devotees between 6-8 PM. Open Gate 3." },
  { title: "Volunteer gap", detail: "Kitchen zone short by 12 volunteers for evening seva." },
  { title: "Donation surge", detail: "Online donations up 34% vs last Tuesday." },
  { title: "Queue anomaly", detail: "Darshan queue wait rising fast — deploy 2 more coordinators." },
];

export interface RevenueSlice { name: string; value: number; color: string }
export const revenueMix: RevenueSlice[] = [
  { name: "Sevas", value: 42, color: "hsl(35 90% 55%)" },
  { name: "Donations", value: 28, color: "hsl(15 80% 55%)" },
  { name: "Prasad", value: 14, color: "hsl(150 45% 45%)" },
  { name: "Events", value: 10, color: "hsl(210 70% 50%)" },
  { name: "Other", value: 6, color: "hsl(0 65% 55%)" },
];

export interface Alert { id: string; severity: "high" | "medium" | "low"; category: string; desc: string; time: string }
export const alerts: Alert[] = [
  { id: "ALT-2201", severity: "high", category: "Medical", desc: "Devotee collapse near Gate 2 — first-aid dispatched", time: "2m ago" },
  { id: "ALT-2202", severity: "medium", category: "Queue", desc: "Darshan queue exceeded 45 min threshold", time: "12m ago" },
  { id: "ALT-2203", severity: "high", category: "Fire", desc: "Smoke sensor triggered in kitchen zone B", time: "18m ago" },
  { id: "ALT-2204", severity: "low", category: "Inventory", desc: "Laddoo prasad stock below 20%", time: "34m ago" },
  { id: "ALT-2205", severity: "medium", category: "Parking", desc: "North lot at 95% occupancy", time: "48m ago" },
];

export const bookings = [
  { id: "BKG-50120", devotee: "Ramesh Iyer", seva: "Maha Moodganapati Seva", date: "2026-01-01", slot: "6:00 AM", amount: "₹5,100", channel: "Web", status: "Confirmed" },
  { id: "BKG-50121", devotee: "Priya Kulkarni", seva: "Anna Daan Seva", date: "2026-02-04", slot: "7:00 AM", amount: "₹2,500", channel: "Mobile", status: "Pending" },
  { id: "BKG-50122", devotee: "Anil Deshmukh", seva: "Tulabhar Seva", date: "2026-03-07", slot: "8:00 AM", amount: "₹11,000", channel: "Counter", status: "Confirmed" },
  { id: "BKG-50123", devotee: "Meera Sharma", seva: "Moodganapati Pooja", date: "2026-04-10", slot: "9:00 AM", amount: "₹1,500", channel: "WhatsApp", status: "Completed" },
  { id: "BKG-50124", devotee: "Suresh Nair", seva: "Abhishekam", date: "2026-04-12", slot: "5:30 AM", amount: "₹3,200", channel: "Web", status: "Cancelled" },
  { id: "BKG-50125", devotee: "Kavya Rao", seva: "Kalyanotsavam", date: "2026-04-14", slot: "10:00 AM", amount: "₹7,800", channel: "Mobile", status: "Confirmed" },
];

export const devotees = [
  { id: "DVT-10234", name: "Ramesh Iyer", mobile: "+91 9800000000", city: "Mumbai", visits: 3, donated: "₹1,000", tier: "VIP" },
  { id: "DVT-10235", name: "Priya Kulkarni", mobile: "+91 9800000137", city: "Pune", visits: 4, donated: "₹1,850", tier: "Member" },
  { id: "DVT-10236", name: "Anil Deshmukh", mobile: "+91 9800000274", city: "Bengaluru", visits: 5, donated: "₹2,700", tier: "Member" },
  { id: "DVT-10237", name: "Meera Sharma", mobile: "+91 9800000411", city: "Chennai", visits: 6, donated: "₹3,550", tier: "VIP" },
  { id: "DVT-10238", name: "Suresh Nair", mobile: "+91 9800000548", city: "Kochi", visits: 7, donated: "₹4,400", tier: "Member" },
];

export interface Seva { name: string; category: string; price: string; duration: string; slots: number; capacity: number; priest: string; desc: string }
export const sevas: Seva[] = [
  { name: "Maha Moodganapati Seva", category: "Grand Pooja", price: "₹5,100", duration: "45 min", slots: 4, capacity: 50, priest: "Pt. Ramesh Shastri", desc: "The most auspicious grand pooja performed at the temple sanctum." },
  { name: "Anna Daan Seva", category: "Charity", price: "₹2,500", duration: "All day", slots: 1, capacity: 500, priest: "Kitchen Committee", desc: "Sponsor the daily mahaprasad for hundreds of devotees." },
  { name: "Tulabhar Seva", category: "Special", price: "₹11,000", duration: "30 min", slots: 6, capacity: 20, priest: "Pt. Suresh Joshi", desc: "Traditional weighing ritual against grains, sugar or coconuts." },
  { name: "Abhishekam", category: "Daily", price: "₹1,100", duration: "20 min", slots: 8, capacity: 30, priest: "Pt. Vinod Bhat", desc: "Ceremonial bathing of the deity with sacred substances." },
  { name: "Kalyanotsavam", category: "Grand Pooja", price: "₹7,800", duration: "60 min", slots: 3, capacity: 25, priest: "Pt. Krishna Rao", desc: "Celestial wedding ceremony of the divine couple." },
  { name: "Sahasranama Archana", category: "Daily", price: "₹500", duration: "25 min", slots: 12, capacity: 40, priest: "Pt. Anand Sharma", desc: "Chanting the thousand names of the deity." },
];

export const donationTrend = [
  { month: "Jan", amount: 42 }, { month: "Feb", amount: 38 }, { month: "Mar", amount: 50 },
  { month: "Apr", amount: 55 }, { month: "May", amount: 60 }, { month: "Jun", amount: 62 },
  { month: "Jul", amount: 70 }, { month: "Aug", amount: 88 }, { month: "Sep", amount: 110 },
  { month: "Oct", amount: 92 }, { month: "Nov", amount: 84 }, { month: "Dec", amount: 68 },
];

export const volunteers = [
  { id: "VOL-3001", name: "Arjun Mehta", zone: "Gate 1", shift: "Morning", status: "On duty", hours: 42 },
  { id: "VOL-3002", name: "Sneha Reddy", zone: "Kitchen", shift: "Afternoon", status: "On duty", hours: 36 },
  { id: "VOL-3003", name: "Karan Patel", zone: "Darshan Queue", shift: "Evening", status: "Off duty", hours: 28 },
  { id: "VOL-3004", name: "Deepa Iyer", zone: "Medical", shift: "Morning", status: "On duty", hours: 51 },
  { id: "VOL-3005", name: "Rohit Verma", zone: "Parking", shift: "Night", status: "On duty", hours: 24 },
];

export const visitors = [
  { id: "VIS-9001", name: "Priya Sharma", checkIn: "06:12 AM", zone: "Sanctum", party: 4, status: "Inside" },
  { id: "VIS-9002", name: "Rakesh Kumar", checkIn: "06:34 AM", zone: "Darshan", party: 2, status: "Inside" },
  { id: "VIS-9003", name: "Neha Joshi", checkIn: "06:58 AM", zone: "Prasad Hall", party: 6, status: "Exited" },
  { id: "VIS-9004", name: "Vikram Singh", checkIn: "07:22 AM", zone: "Sanctum", party: 3, status: "Inside" },
];

export const inventory = [
  { sku: "PRS-001", item: "Laddoo Prasad (box)", stock: 1240, min: 500, status: "OK" },
  { sku: "PRS-002", item: "Kumkum Sachet", stock: 320, min: 500, status: "Low" },
  { sku: "PRS-003", item: "Tulasi Mala", stock: 90, min: 100, status: "Low" },
  { sku: "PRS-004", item: "Coconut", stock: 2400, min: 1000, status: "OK" },
  { sku: "PRS-005", item: "Ghee Diya", stock: 60, min: 200, status: "Critical" },
];

export const events = [
  { id: "EVT-77", name: "Rath Yatra", date: "2026-07-08", visitors: "1.2L", status: "Upcoming" },
  { id: "EVT-78", name: "Navratri Utsav", date: "2026-10-01", visitors: "3.5L", status: "Planning" },
  { id: "EVT-79", name: "Deepotsav", date: "2026-11-12", visitors: "5L", status: "Planning" },
  { id: "EVT-80", name: "Ganesh Chaturthi", date: "2026-09-04", visitors: "2.8L", status: "Confirmed" },
];