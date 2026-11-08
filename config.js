/* ════════════════════════════════════════════════════════════════════
   INDY CLASSIC — SITE CONFIG
   ────────────────────────────────────────────────────────────────────
   This is the ONE file to edit each year. Every page reads from here:
   dates, times, venues, links, hotel, raffle, committee, sponsors…

   Times are Eastern. Dates are "YYYY-MM-DD", times are 24h "HH:MM".

   Testing tip: add ?now=2027-06-04T12:30 to any page URL to preview
   what the site looks like at that moment (live mode, countdowns, etc.)
   ════════════════════════════════════════════════════════════════════ */

window.IC = {
  year: 2027,
  name: "Indy Classic",
  city: "Indianapolis, IN",
  logo: "profile.jpg.png",              // full logo (with title sponsor)
  startDate: "2027-06-03",               // Thursday
  endDate:   "2027-06-06",               // Sunday
  utcOffset: "-04:00",                   // EDT in June — leave alone

  // Pages listed here show a "Soon" tag and link to holdhorse.html
  // instead of the real page. Delete a line when that page is ready.
  comingSoon: [
    "Schedule.html",
    "tshirts.html",
    "Welcome.html",
    "Banquet.html",
    "hotel.html",
  ],

  links: {
    // TODO 2027: swap to new TournamentSoftware event URL
    register: "https://glta.tournamentsoftware.com/tournament/AB1C685D-29DA-4808-90E7-4FF1AC3C2E81",
    // TODO 2027: add Zeffy ticketing URL (button shows "Opens soon" while blank)
    payment: "",
    courts: "MatchDisplay6.html",
    consolation: "Consolation.html",
    club: "https://indyracquet.com/",
    charity: "https://thfgi.org/",
    charityName: "Our Charity",
    visitIndy: "https://www.visitindy.com",
  },

  contact: {
    email: "indytennisclassic@gmail.com",
    phone: "17085425972",
    phoneDisplay: "(708) 542-5972",
    phoneNote: "Please text, don't call",
  },

  venues: {
    // TODO 2027: confirm this is the right IRC location (Dean Rd vs. IRC East)
    club:   { name: "Indianapolis Racquet Club", short: "IRC", address: "8249 Dean Rd, Indianapolis, IN 46240" },
    metro:  { name: "Metro",  address: "707 Massachusetts Ave, Indianapolis, IN 46204" },
    radius: { name: "Radius", address: "723 S Capitol Ave, Indianapolis, IN 46225" },
    lounge: { name: "Upstairs Lounge", note: "at IRC" },
  },

  /* ── SCHEDULE ─────────────────────────────────────────────────────
     Each item: title, icon, start ("HH:MM"), end (optional),
     timeLabel (optional override, e.g. "7:30 AM – Gone"),
     venue (key from venues above), link (page), note, featured, gold   */
  schedule: [
    { date: "2027-06-03", items: [
      { title: "Welcome Party", icon: "🥂", start: "19:00", end: "21:00", venue: "metro", link: "Welcome.html", featured: true },
      { title: "Dinner", icon: "🍽️", start: "21:00", timeLabel: "After the party", quiet: true, note: "On your own — please support our sponsors 45 Degrees and Harrison's!" },
    ]},
    { date: "2027-06-04", items: [
      { title: "Coffee Bar", icon: "☕", start: "07:30", end: "11:00", timeLabel: "7:30 AM – Gone", venue: "lounge" },
      { title: "First & Second Round Play", icon: "🎾", start: "08:00", end: "22:00", venue: "club", link: "MatchDisplay6.html", play: true },
      { title: "Snacks", icon: "🍿", start: "08:00", end: "22:00", timeLabel: "All day", venue: "lounge", quiet: true },
      { title: "Lunch — BIBIBOP", icon: "🥗", start: "12:00", end: "13:30", timeLabel: "Noon", venue: "lounge" },
    ]},
    { date: "2027-06-05", items: [
      { title: "Coffee Bar", icon: "☕", start: "07:30", end: "11:00", timeLabel: "7:30 AM – Gone", venue: "lounge" },
      { title: "Main Draw & Consolation Play", icon: "🎾", start: "08:00", end: "17:00", venue: "club", link: "MatchDisplay6.html", play: true },
      { title: "Snacks", icon: "🍿", start: "08:00", end: "17:00", timeLabel: "All day", venue: "lounge", quiet: true },
      { title: "Lunch — Jimmy John's", icon: "🥪", start: "12:00", end: "13:30", timeLabel: "Noon", venue: "lounge" },
      { title: "Player's Banquet", icon: "🎉", start: "19:00", end: "22:00", venue: "radius", link: "Banquet.html", featured: true },
    ]},
    { date: "2027-06-06", items: [
      { title: "Championship Play", icon: "🏆", start: "08:00", end: "16:00", venue: "club", link: "MatchDisplay6.html", play: true, gold: true },
    ]},
  ],

  welcome: {
    title: "Welcome Party",
    tagline: "Meet other players · Talk trash · Win prizes",
    date: "2027-06-03", start: "19:00", end: "21:00",
    venue: "metro",
    perk: { icon: "🍹", title: "First $400 bar tab is on us", sub: "Plus finger foods — come hungry and thirsty" },
    notes: [
      "No cover charge — just show up",
      "Party is on the second floor — head upstairs!",
      "Open to all registered Indy Classic players",
      "Great chance to meet your opponents before play starts Friday",
      "Prizes given away throughout the evening",
    ],
    photo: "Welcome.jpg",
  },

  banquet: {
    title: "Player's Banquet",
    date: "2027-06-05", start: "19:00", end: "22:00",
    dinner: "8:00 PM",
    caterer: "Sahm's Catering",
    venue: "radius",
    dietary: "Vegan? Let us know ahead of time so we can take care of you!",
    cocktails: [
      { name: "The BJ (Blueberry Juice)", recipe: "Vodka, blueberry syrup, lemon juice, soda water, lemon garnish" },
      { name: "The Juicy Peach", recipe: "Tequila, peach syrup, lime juice, soda water, lime garnish" },
    ],
    cocktailTip: 'Ask for a "Double Fault" to make it a double!',
    // TODO 2027: confirm/refresh raffle prize list & years (carried over from 2026)
    raffle: [
      ["🎾", "Wilson Tennis Racquet (of your choice)"],
      ["🏫", "Free Lesson with Lucas Waak (IRC Pro)"],
      ["🏆", "2027 Indy Classic Free Entry"],
      ["🍊", "2027 Orange Blossom (Orlando) Free Entry"],
      ["🌴", "2026 Citrus Classic (Tampa Bay) Free Entry"],
      ["⚙️", "2027 Motor City Classic (Detroit) Free Entry"],
      ["🤠", "2027 Heart of Texas (Austin) Free Entry"],
      ["🌰", "2027 Columbus Classic Free Entry"],
      ["🌊", "2027 San Diego Open Free Entry"],
      ["🌸", "2026 Capital Classic (DC) Free Entry"],
      ["🌞", "2027 California Open Classic (Los Angeles) Free Entry"],
      ["🍑", "2026 Peach Championships (Atlanta) Free Entry"],
      ["🍁", "2027 Canadian Gay Open (Toronto) Free Entry"],
      ["🎸", "2026 Nashville Open Free Entry"],
    ],
    raffleMore: "More items being added — check back soon!",
    photo: "banquet.png",
  },

  hotel: {
    name: "",            // TODO 2027: hotel name (shows on the page when filled in)
    address: "",         // TODO 2027: hotel address (adds a map link when filled in)
    rate: "$189",        // TODO 2027: confirm nightly rate
    bookBy: "2027-05-14",// TODO 2027: confirm booking deadline
    checkIn: "2027-06-03",
    checkOut: "2027-06-06",
    // TODO 2027: replace with new Marriott group booking link
    bookingUrl: "https://app.marriott.com/reslink?id=1771864825079&key=GRP&app=resvlink",
    photo: "hotel.jpg",
  },

  shirts: {
    note: "Shirts are included with registration — pick your color when you sign up",
    colors: [
      { name: "Black",    hex: "#1a1a1a", img: "shirt1.jpg" },
      { name: "Aqua",     hex: "#22d3ee", img: "shirt2.jpg" },
      { name: "Cardinal", hex: "#9f1239", img: "shirt3.jpg" },
    ],
  },

  committee: [
    ["Tournament Director", "Dan Fox"],
    ["Entertainment Chair", "Brady Wagenknecht"],
    ["Marketing & Sponsorship Guru", "Mark Phillips"],
    ["Catering Coordinator", "Haley Bougher"],
    ["Brewmaster General", "Sherwin Bocade"],
    ["Masters of Miscellany", "Paul Warney & Garth Brazelton"],
  ],

  /* Sponsor logos: files are named tier1sponsor01.jpg, tier2sponsor01.jpg …
     Missing files hide themselves.
     Optional: add a website for any logo, e.g. links: { "tier2sponsor03": "https://…" } */
  sponsors: {
    counts: { 1: 1, 2: 3, 3: 3, 4: 1 },   // how many logos per tier — bump when you add one
    links: {},
  },

  financials: {
    label: "2026 Tournament Financials",
    heading: "2026 Indy Classic · Income Statement",
    revenueCsv: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTYwXJipDZfGHgIyCgAwUEw0BRU5qtbHXjHpYaCKkwZO8ABKt9gD5UvuhClZqK_pi_56creAK31sPGh/pub?gid=0&single=true&output=csv",
    expenseCsv: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTYwXJipDZfGHgIyCgAwUEw0BRU5qtbHXjHpYaCKkwZO8ABKt9gD5UvuhClZqK_pi_56creAK31sPGh/pub?gid=354141536&single=true&output=csv",
    sponsorCsv: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTYwXJipDZfGHgIyCgAwUEw0BRU5qtbHXjHpYaCKkwZO8ABKt9gD5UvuhClZqK_pi_56creAK31sPGh/pub?gid=1651801351&single=true&output=csv",
  },

  aroundIndyCsv: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSwtmbtFt6Gy3K8RO4hyOb5apbN9sT42_lBhk1ULoVP8JSxntpygBQ5fzAlb-RsQUn4Yi9NzdNh9xpZ/pub?gid=0&single=true&output=csv",

  /* FAQ on the home page. Use {links} freely — plain HTML is fine. */
  faq: [
    ["When does play start?", "First ball is <b>Friday at 8:00 AM</b> at the Indianapolis Racquet Club. Championships wrap up Sunday afternoon. Check <a href='MatchDisplay6.html'>Court Assignments</a> for your match times."],
    ["Is food provided?", "Yes! Coffee bar from 7:30 AM (until it's gone), snacks all day, and lunch at noon Friday and Saturday — all in the Upstairs Lounge."],
    ["Do I get a t-shirt?", "Yep — shirts are included with registration. You pick your color when you sign up."],
    ["Lost my first match. Now what?", "Sign up for the singles or doubles consolation draw on the <a href='Consolation.html'>Consolation hub</a> — sign-up windows and draws post there live."],
    ["How will I get updates during the weekend?", "If you opted in to texts during registration you'll get about 6–10 messages over tournament week (schedule changes, lunch is here, recaps). Reply STOP anytime."],
    ["Who can come to the Welcome Party?", "All registered players. No cover charge, and the first $400 of the bar tab is on us. It's on the second floor at Metro."],
    ["Who do I contact with questions?", "Text <a href='sms:+17085425972'>(708) 542-5972</a> or email <a href='mailto:indytennisclassic@gmail.com'>indytennisclassic@gmail.com</a>."],
  ],
};
