/* ============================================================================
   RDCA SportsWeb One — site content data  (shared/data/site-data.js)
   ----------------------------------------------------------------------------
   SINGLE SOURCE OF CONTENT for the data-driven sections. Pages render FROM
   this file — content is never hard-buried inside page markup. To update the
   site today, RDCA edits this one file. Later, each block below becomes a
   SportsWeb One / Supabase collection (see // CONNECT notes).

   FLAGS
     real:true        → migrated from rdca.com, safe to use.
     needsReview:true → present but unverified / possibly outdated → UI shows
                        a "Needs RDCA review" pill.
     sample:true      → placeholder for layout only → UI shows a "Sample" pill.
   ========================================================================== */

window.RDCA_DATA = {
  /* Team selections by division. `entered` drives "latest" (most recent shown first). Mock data. */
  teamSelections: [
    { id:"ringwood-1xi-r15", club:"ringwood", team:"Ringwood CC \u2014 1st XI", grade:"Premier Division", round:"Round 15", date:"Sat 14 Dec", venue:"Ringwood Reserve", status:"Announced", entered:"2026-12-10",
      players:[ {n:1,name:"A. Robinson",role:"Opener"},{n:2,name:"J. Smith",role:"Batsman",c:true},{n:3,name:"T. Brown",role:"Batsman"},{n:4,name:"C. Williams",role:"All-rounder"},{n:5,name:"D. Clarke",role:"Batsman"},{n:6,name:"R. Evans",role:"W-Keeper",wk:true},{n:7,name:"P. Davis",role:"All-rounder"},{n:8,name:"S. Kumar",role:"Bowler"},{n:9,name:"M. Jones",role:"Bowler"},{n:10,name:"B. Taylor",role:"Bowler"},{n:11,name:"G. Morris",role:"Bowler"} ] },
    { id:"croydon-1xi-r15", club:"croydon", team:"Croydon CC \u2014 1st XI", grade:"Premier Division", round:"Round 15", date:"Sat 14 Dec", venue:"Dorset Reserve", status:"Announced", entered:"2026-12-09",
      players:[ {n:1,name:"L. Harper",role:"Opener"},{n:2,name:"N. Patel",role:"Opener"},{n:3,name:"D. Cruz",role:"Batsman",c:true},{n:4,name:"A. Singh",role:"All-rounder"},{n:5,name:"J. Murphy",role:"Batsman"},{n:6,name:"K. Lee",role:"W-Keeper",wk:true},{n:7,name:"R. Osei",role:"All-rounder"},{n:8,name:"M. Diaz",role:"Bowler"},{n:9,name:"T. Nguyen",role:"Bowler"},{n:10,name:"B. Walsh",role:"Bowler"},{n:11,name:"C. Reid",role:"Bowler"} ] },
    { id:"kilsyth-1xi-r15", club:"kilsyth", team:"Kilsyth CC \u2014 1st XI", grade:"Division 1", round:"Round 15", date:"Sat 14 Dec", venue:"Pinks Reserve", status:"Announced", entered:"2026-12-08",
      players:[ {n:1,name:"O. Reilly",role:"Opener"},{n:2,name:"H. Ali",role:"Opener"},{n:3,name:"S. Tran",role:"Batsman",c:true},{n:4,name:"W. Cole",role:"All-rounder"},{n:5,name:"F. Romano",role:"Batsman"},{n:6,name:"G. Tan",role:"W-Keeper",wk:true},{n:7,name:"P. Vella",role:"All-rounder"},{n:8,name:"D. Khan",role:"Bowler"},{n:9,name:"J. Park",role:"Bowler"},{n:10,name:"L. Brooks",role:"Bowler"},{n:11,name:"E. Ford",role:"Bowler"} ] },
    { id:"coldstream-1xi-r15", club:"coldstream", team:"Coldstream CC \u2014 1st XI", grade:"Division 2", round:"Round 15", date:"Sat 14 Dec", venue:"Coldstream Rec", status:"Provisional", entered:"2026-12-07",
      players:[ {n:1,name:"B. Singh",role:"Opener"},{n:2,name:"L. Ward",role:"Opener"},{n:3,name:"M. Hale",role:"Batsman",c:true},{n:4,name:"K. Roy",role:"All-rounder"},{n:5,name:"J. Otto",role:"Batsman"},{n:6,name:"T. Brooks",role:"W-Keeper",wk:true},{n:7,name:"A. Bell",role:"All-rounder"},{n:8,name:"S. Howard",role:"Bowler"},{n:9,name:"N. Price",role:"Bowler"},{n:10,name:"D. Scott",role:"Bowler"},{n:11,name:"R. Cole",role:"Bowler"} ] }
  ],

  board: {
    note:"RDCA Board of Management — governs the Association across all sections.",
    members: [
      { role:"President",                name:"Michael Finn",   phone:"0400 700 606", email:"president@rdca.com", photo:"https://static.wixstatic.com/media/bad3dd_6f15d366553945be94fdd286d2d90f83~mv2.jpg/v1/fill/w_220,h_220,al_c,q_85,enc_avif,quality_auto/bad3dd_6f15d366553945be94fdd286d2d90f83~mv2.jpg", real:true },
      { role:"Vice President",           name:"Pat Meehan",                                                       photo:"https://static.wixstatic.com/media/c4acf1_6be612129ee9478bb0a6862c7ada6aeb~mv2.jpg/v1/fill/w_220,h_220,al_c,q_85,enc_avif,quality_auto/c4acf1_6be612129ee9478bb0a6862c7ada6aeb~mv2.jpg", real:true },
      { role:"Finance Manager",          name:"Graeme Seymour", phone:"0439 114 843", email:"finance@rdca.com",  photo:"https://static.wixstatic.com/media/9e3e38_a80cee731bb24a6d9cf1eca20284baa9~mv2.jpg/v1/fill/w_220,h_220,al_c,q_85,enc_avif,quality_auto/9e3e38_a80cee731bb24a6d9cf1eca20284baa9~mv2.jpg", real:true },
      { role:"Senior Chairman",          name:"Wayne Hartley",  phone:"0411 403 149", real:true },
      { role:"Admin Manager",            name:"Timothy Court",  phone:"0407 838 275", email:"court@rdca.com",    photo:"https://static.wixstatic.com/media/bad3dd_1a740526e320490489b01534c604bce3~mv2.jpg/v1/fill/w_220,h_220,al_c,q_85,enc_avif,quality_auto/bad3dd_1a740526e320490489b01534c604bce3~mv2.jpg", real:true },
      { role:"Umpires Chairman",         name:"Jordan Russell", phone:"0413 357 444", email:"j_brussell@outlook.com", photo:"https://static.wixstatic.com/media/9e3e38_25b16187e9dd42bc82f6374e0570750d~mv2.jpg/v1/fill/w_220,h_220,al_c,q_85,enc_avif,quality_auto/9e3e38_25b16187e9dd42bc82f6374e0570750d~mv2.jpg", real:true },
      { role:"Marketing & Sponsorship",  name:"Jo Fairy",       phone:"0411 313 334", email:"marketing@rdca.com",photo:"https://static.wixstatic.com/media/bad3dd_f9f0950efb9048f3b8388b1a54351292~mv2.jpg/v1/fill/w_220,h_220,al_c,q_85,enc_avif,quality_auto/bad3dd_f9f0950efb9048f3b8388b1a54351292~mv2.jpg", real:true }
    ]
  },
  meta: {
    assoc: "Ringwood & District Cricket Association",
    short: "RDCA",
    est: 1892,
    contentSource: "rdca.com",
    lastMigrated: "2026-06-08"
  },

  /* ==========================================================================
     CLUBS  — 12 names are REAL (carried from the approved homepage).
     RDCA has 28 member clubs; the remaining 16 are flagged to be added.
     // CONNECT later: SportsWeb One "Clubs" collection / Supabase `clubs` table.
     // logo: Cloudinary (account dozdbhjhs). Per-club logo URLs still need
     //       mapping — until then the card shows the club initials.
     ========================================================================== */
  clubsNote: "12 of RDCA's 28 member clubs shown. Remaining 16 + per-club logos to be added from rdca.com / RDCA records.",
  /* ============================================================================
     MEDIA — photo galleries (Field of View) + video (FrogBox live + archive)
     photoAlbums.url are the REAL Field of View / ShootProof season galleries.
     cover/thumb images are PLACEHOLDER action shots — swap for real RDCA photos.
     ========================================================================== */
  photosNote: "Match-day galleries are shot by Field of View Photography (an RDCA partner) and hosted on their site. Cover images here are placeholders \u2014 swap each for the season's real cover.",
  photoAlbums: [
    { season:"Season 2025/26",              tag:"Latest",  url:"https://fieldofviewphotography.shootproof.com/gallery/28411719/album/21236651", cover:"https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&q=70&auto=format&fit=crop" },
    { season:"Season 2024/25",              tag:"",        url:"https://fieldofviewphotography.shootproof.com/gallery/25299604/album/18262926", cover:"https://images.unsplash.com/photo-1595210382051-4d2c31fcc2f4?w=600&q=70&auto=format&fit=crop" },
    { season:"Season 2023/24",              tag:"",        url:"https://fieldofviewphotography.shootproof.com/gallery/19340167/album/15929979", cover:"https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=70&auto=format&fit=crop" },
    { season:"Season 2022/23",              tag:"",        url:"https://fieldofviewphotography.shootproof.com/gallery/19340167/album/13278529", cover:"https://images.unsplash.com/photo-1512719994953-eabf50895df7?w=600&q=70&auto=format&fit=crop" },
    { season:"Premiership Posters 2024/25", tag:"Posters", url:"https://fieldofviewphotography.shootproof.com/gallery/15321413/album/19797650", cover:"https://images.unsplash.com/photo-1607734834519-d8576ae60ea6?w=600&q=70&auto=format&fit=crop" },
    { season:"Premiership Posters 2023/24", tag:"Posters", url:"https://fieldofviewphotography.shootproof.com/gallery/15321413/album/16811579", cover:"https://images.unsplash.com/photo-1593766827228-8737b4534aa6?w=600&q=70&auto=format&fit=crop" }
  ],
  photoStrip: ["https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&q=70&auto=format&fit=crop","https://images.unsplash.com/photo-1595210382051-4d2c31fcc2f4?w=600&q=70&auto=format&fit=crop","https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=70&auto=format&fit=crop","https://images.unsplash.com/photo-1512719994953-eabf50895df7?w=600&q=70&auto=format&fit=crop","https://images.unsplash.com/photo-1607734834519-d8576ae60ea6?w=600&q=70&auto=format&fit=crop","https://images.unsplash.com/photo-1593766827228-8737b4534aa6?w=600&q=70&auto=format&fit=crop","https://images.unsplash.com/photo-1595210382051-4d2c31fcc2f4?w=600&q=70&auto=format&fit=crop","https://images.unsplash.com/photo-1512719994953-eabf50895df7?w=600&q=70&auto=format&fit=crop","https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&q=70&auto=format&fit=crop","https://images.unsplash.com/photo-1607734834519-d8576ae60ea6?w=600&q=70&auto=format&fit=crop"],
  liveStream: { status:"offline", title:"RDCA Match of the Round", sub:"Live streaming returns each Saturday during the season.", sponsor:"Your business here", embedUrl:null, channelUrl:"https://www.frogbox.live/" },
  videosNote: "Selected RDCA games are streamed live via FrogBox and replays are kept here. The archive below is placeholder \u2014 wire it to the RDCA FrogBox channel.",
  videos: [
    { title:"Premier Division \u2014 Ringwood v Croydon", comp:"Premier Division", date:"Sat 14 Feb", thumb:"https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&q=70&auto=format&fit=crop", url:"#", mock:true },
    { title:"Division 1 \u2014 Kilsyth v Lilydale",        comp:"Division 1",       date:"Sat 14 Feb", thumb:"https://images.unsplash.com/photo-1595210382051-4d2c31fcc2f4?w=600&q=70&auto=format&fit=crop", url:"#", mock:true },
    { title:"Women's \u2014 Grand Final",                 comp:"Women's",          date:"Sun 1 Feb",  thumb:"https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=70&auto=format&fit=crop", url:"#", mock:true },
    { title:"Premier Division \u2014 Semi Final",          comp:"Finals",           date:"Sat 7 Feb",  thumb:"https://images.unsplash.com/photo-1512719994953-eabf50895df7?w=600&q=70&auto=format&fit=crop", url:"#", mock:true },
    { title:"Juniors \u2014 U16 Grand Final",              comp:"Juniors",          date:"Sun 8 Feb",  thumb:"https://images.unsplash.com/photo-1607734834519-d8576ae60ea6?w=600&q=70&auto=format&fit=crop", url:"#", mock:true },
    { title:"Veterans \u2014 Round 12",                    comp:"Veterans",         date:"Sat 31 Jan", thumb:"https://images.unsplash.com/photo-1593766827228-8737b4534aa6?w=600&q=70&auto=format&fit=crop", url:"#", mock:true }
  ],
  /* ----- players: profile + trading-card data (illustrative mock) ----- */
  playersNote: "Player profiles are illustrative mock data for layout. Real players, photos and season stats to be supplied by clubs / PlayHQ.",
  players: [
    { key:"jake-smith", name:"Jake Smith", club:"ringwood", grade:"Premier Division", role:"Opening Batter",
      bats:"Right-hand bat", bowls:"Right-arm medium", number:34, born:"2001", town:"Ringwood",
      rarity:"Season Top Scorer", photo:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=760&q=75&auto=format&fit=crop&crop=faces", season:"2024/25",
      bat:{ M:15, Runs:687, HS:"142", Avg:57.3, SR:81.2, "50s":5, "100s":2 },
      bowl:{ M:15, Wkts:6, Best:"2/14", Avg:31.0, Econ:4.6 }, mock:true },
    { key:"mia-chen", name:"Mia Chen", club:"croydon", grade:"Premier Division", role:"All-rounder",
      bats:"Left-hand bat", bowls:"Right-arm off-spin", number:7, born:"2003", town:"Croydon",
      rarity:"Players' Player", photo:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=760&q=75&auto=format&fit=crop&crop=faces", season:"2024/25",
      bat:{ M:14, Runs:431, HS:"88", Avg:39.2, SR:74.5, "50s":3, "100s":0 },
      bowl:{ M:14, Wkts:21, Best:"4/22", Avg:18.6, Econ:3.8 }, mock:true },
    { key:"sam-rivera", name:"Sam Rivera", club:"kilsyth", grade:"Division 1", role:"Fast Bowler",
      bats:"Right-hand bat", bowls:"Right-arm fast", number:88, born:"2000", town:"Kilsyth",
      rarity:"Most Wickets", photo:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=760&q=75&auto=format&fit=crop&crop=faces", season:"2024/25",
      bat:{ M:13, Runs:142, HS:"34*", Avg:17.7, SR:96.0, "50s":0, "100s":0 },
      bowl:{ M:13, Wkts:34, Best:"6/31", Avg:13.4, Econ:3.2 }, mock:true },
    { key:"tom-okafor", name:"Tom Okafor", club:"heathmont", grade:"Premier Division", role:"Wicketkeeper-Batter",
      bats:"Right-hand bat", bowls:"-", number:1, born:"1999", town:"Heathmont",
      rarity:"Most Dismissals", photo:"https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=600&h=760&q=75&auto=format&fit=crop&crop=faces", season:"2024/25",
      bat:{ M:15, Runs:509, HS:"96", Avg:42.4, SR:88.1, "50s":4, "100s":0 },
      bowl:{ M:15, Wkts:0, Best:"-", Avg:0, Econ:0 }, mock:true }
  ],
  socialNote:"Live feeds from the RDCA and the wider Victorian and Australian cricket community \u2014 Facebook timelines pulled straight from each official page, with quick links to follow along on Instagram and beyond.",
  social:[
    { key:"rdca", name:"RDCA", tag:"Ringwood & District Cricket Association", fb:"https://www.facebook.com/ringwooddca",
      links:[
        {t:"Facebook", u:"https://www.facebook.com/ringwooddca", i:"brand-facebook"},
        {t:"Instagram", u:"https://www.instagram.com/rdca6519", i:"brand-instagram"},
        {t:"Website",  u:"https://www.rdca.com",                 i:"world"}
      ], real:true },
    { key:"cv", name:"Cricket Victoria", tag:"State governing body \u00b7 Victoria", fb:"https://www.facebook.com/cricketvictoria",
      links:[
        {t:"Facebook",  u:"https://www.facebook.com/cricketvictoria",  i:"brand-facebook"},
        {t:"Instagram", u:"https://www.instagram.com/cricketvictoria", i:"brand-instagram"},
        {t:"X",         u:"https://x.com/CricketVic",                   i:"brand-x"},
        {t:"Website",   u:"https://www.cricketvictoria.com.au",         i:"world"}
      ], real:true },
    { key:"ca", name:"Cricket Australia", tag:"National governing body", fb:"https://www.facebook.com/cricketcomau",
      links:[
        {t:"Facebook",  u:"https://www.facebook.com/cricketcomau",      i:"brand-facebook"},
        {t:"Instagram", u:"https://www.instagram.com/cricketaustralia", i:"brand-instagram"},
        {t:"X",         u:"https://x.com/CricketAus",                   i:"brand-x"},
        {t:"YouTube",   u:"https://www.youtube.com/cricketaustralia",   i:"brand-youtube"},
        {t:"Website",   u:"https://www.cricket.com.au",                 i:"world"}
      ], real:true },
  ],
  clubs: [
    { key:"ringwood",      name:"Ringwood CC",       grade:"Premier Division", logo:"/logos/ringwood.webp", colors:["#9aa1a8","#2b2f36"], real:true },
    { key:"croydon",       name:"Croydon CC",        grade:"Premier Division", logo:"/logos/croydon.webp", colors:["#f2c200","#1a1a1a"], real:true },
    { key:"heathmont",     name:"Heathmont CC",      grade:"Premier Division", logo:null, colors:["#7a1020","#4d0a14"], real:true },
    { key:"wongapark",     name:"Wonga Park CC",     grade:"Premier Division", logo:"/logos/wongapark.webp", colors:["#7c3fa1","#27b6c7"], real:true },
    { key:"kilsyth",       name:"Kilsyth CC",        grade:"Division 1",       logo:"/logos/kilsyth.webp", colors:["#c8102e","#1a1a1a"], real:true },
    { key:"lilydale",      name:"Lilydale CC",       grade:"Division 1",       logo:"/logos/lilydale.webp", colors:["#2f63c6","#15306b"], real:true },
    { key:"warranwood",    name:"Warranwood CC",     grade:"Division 1",       logo:"/logos/warranwood.webp", colors:["#2f5aa8","#16306b"], real:true },
    { key:"montrose",      name:"Montrose CC",       grade:"Division 1",       logo:"/logos/montrose.webp", colors:["#6b7178","#1e9fc4"], real:true },
    { key:"coldstream",    name:"Coldstream CC",     grade:"Division 2",       logo:"/logos/coldstream.webp", colors:["#5fb52b","#2c6e17"], real:true },
    { key:"mtevelyn",      name:"Mt Evelyn CC",      grade:"Division 2",       logo:"/logos/mtevelyn.webp", colors:["#3aa0d8","#1b2730"], real:true },
    { key:"chirnsidepark", name:"Chirnside Park CC", grade:"Division 2",       logo:"/logos/chirnsidepark.webp", colors:["#2f6fc6","#15224a"], real:true },
    { key:"mooroolbark",   name:"Mooroolbark CC",    grade:"Division 2",       logo:"/logos/mooroolbark.webp", colors:["#202740","#b11722"], real:true },
    { key:"seville", name:"Seville CC", grade:"Premier Division", logo:"/logos/seville.webp", colors:["#9aa1a8","#3a3f45"], real:true },
    { key:"healesville", name:"Healesville CC", grade:"Premier Division", logo:"/logos/healesville.webp", colors:["#f4761b","#d51f12"], real:true },
    { key:"warrandyte", name:"Warrandyte CC", grade:"Division 1", logo:"/logos/warrandyte.webp", colors:["#c39a3b","#9e1b22"], real:true },
    { key:"norwood", name:"Norwood CC", grade:"Division 1", logo:"/logos/norwood.webp", colors:["#caa23a","#8a5a20"], real:true },
    { key:"templeton", name:"Templeton CC", grade:"Division 2", logo:"/logos/templeton.webp", colors:["#2f8a3e","#33383d"], real:true },
    { key:"croydonnorth", name:"Croydon North CC", grade:"Division 2", logo:"/logos/croydonnorth.webp", colors:["#8b9298","#c8102e"], real:true },
    { key:"wantirnasouth", name:"Wantirna South CC", grade:"Division 3", logo:"/logos/wantirnasouth.webp", colors:["#d51f23","#1a1a1a"], real:true },
    { key:"powelltown", name:"Powelltown CC", grade:"Division 3", logo:"/logos/powelltown.webp", colors:["#c8202a","#1a1a1a"], real:true },
    { key:"hoddlescreek", name:"Hoddles Creek CC", grade:"Division 3", logo:"/logos/hoddlescreek.webp", colors:["#7a5a2e","#202c45"], real:true },
    { key:"ainsliepark", name:"Ainslie Park CC", grade:"Division 3", logo:"/logos/ainsliepark.webp", colors:["#1f7a3a","#172419"], real:true },
    { key:"standrews", name:"St Andrews CC", grade:"Division 3", logo:"/logos/standrews.webp", colors:["#c8a23a","#1a1a1a"], real:true },
    { key:"boronia", name:"Boronia CC", grade:"Division 3", logo:"/logos/boronia.webp", colors:["#caa23a","#1a1a1a"], real:true },
    { key:"launchingplace", name:"Launching Place CC", grade:"Division 4", logo:"/logos/launchingplace.webp", colors:["#cc2222","#5a626b"], real:true },
    { key:"heathwood", name:"Heathwood CC", grade:"Division 4", logo:"/logos/heathwood.webp", colors:["#e8821e","#2a2018"], real:true },
    { key:"southwarrandyte", name:"South Warrandyte CC", grade:"Division 4", logo:"/logos/southwarrandyte.webp", colors:["#8b9298","#caa23a"], real:true },
    { key:"bayswater", name:"Bayswater CC", grade:"Division 4", logo:"/logos/bayswater.webp", colors:["#2f8bd6","#16306b"], real:true },
    { key:"wantirna", name:"Wantirna CC", grade:"Division 4", logo:"/logos/wantirna.webp", colors:["#8b9298","#cf3a1f"], real:true },
    { key:"yarrajunction", name:"Yarra Junction CC", grade:"Division 4", logo:"/logos/yarrajunction.webp", colors:["#aeb4ba","#2b2f36"], real:true },
    { key:"eastringwood", name:"East Ringwood CC", grade:"Division 4", logo:"/logos/eastringwood.webp", colors:["#ef7d12","#3a3f45"], real:true },
    { key:"yarraglen", name:"Yarra Glen CC", grade:"Division 5", logo:"/logos/yarraglen.webp", colors:["#cc2222","#3a3f45"], real:true },
    { key:"wooriyallock", name:"Woori Yallock CC", grade:"Division 5", logo:"/logos/wooriyallock.webp", colors:["#f2c200","#1a1a1a"], real:true },
    { key:"northringwood", name:"North Ringwood CC", grade:"Division 5", logo:"/logos/northringwood.webp", colors:["#d11f23","#2b2f36"], real:true },
    { key:"eastfield", name:"Eastfield CC", grade:"Division 5", logo:"/logos/eastfield.webp", colors:["#aeb4ba","#2b2f36"], real:true },
    { key:"southcroydon", name:"South Croydon CC", grade:"Division 5", logo:"/logos/southcroydon.webp", colors:["#1f9aa8","#0f5a63"], real:true },
    { key:"croydonranges", name:"Croydon Ranges CC", grade:"Division 5", logo:"/logos/croydonranges.webp", colors:["#8b9298","#1f2740"], real:true },
    { key:"wandin", name:"Wandin CC", grade:"Division 5", logo:"/logos/wandin.webp", colors:["#3a6ea5","#16243f"], real:true }
  ],

  /* ==========================================================================
     SECTIONS  — the grade-based structure of RDCA. Each links to the REAL
     rdca.com pages (so the rebuilt section pages are useful immediately) and
     to its PlayHQ competition (see playhq.js). Do NOT collapse RDCA into only
     Premier/Div1/Div2 — these sections are first-class.
     // CONNECT later: SportsWeb One "Sections" + linked committee/docs collections.
     ========================================================================== */
  sections: {
    juniors: {
      title:"Juniors", icon:"ti-friends",
      blurb:"Junior cricket across boys' and girls' age groups, including representative pathways.",
      playhqKey:"juniors",
      aboutText:"<p>RDCA junior cricket caters for boys and girls across a range of age groups, from entry-level formats through to under-17s. Alongside weekly club fixtures, the Association runs representative (rep) team pathways that give talented juniors the chance to test themselves against the best in the region.</p>",
      conduct:{ summary:"<p>Junior matches are played in the true spirit of cricket, with an emphasis on safety, enjoyment and good sportsmanship. The Code of Conduct sets out what is expected of players, coaches, parents and spectators &mdash; respect for umpires and opponents, fair play, and zero tolerance for abuse or discrimination &mdash; and works alongside the Association&rsquo;s child safety commitments.</p>", url:"https://www.rdca.com/juniors-code-of-conduct" },
      committee:{ label:"Junior Committee", url:"/committees.html#junior-committee", internal:true, real:true },
      docList:[
        { title:"Junior Code of Conduct (PDF)", cat:"Conduct & Safety", url:"/docs/RDCA-Code-of-Conduct.pdf", icon:"ti-clipboard-check" },
        { title:"Registration Form", cat:"Forms & Rules", url:"https://www.rdca.com/_files/ugd/c846e3_7ca10e17623b49e8ad0a6e9e4b08f6c3.pdf", icon:"ti-file-text", real:true },
        { title:"Clearances & Transfers Guide", cat:"Forms & Rules", url:"https://www.rdca.com/_files/ugd/c846e3_2337caa1f5584ee99832599a9812cdf3.pdf", icon:"ti-file-text", real:true },
        { title:"Member Protection By Law", cat:"Conduct & Safety", url:"https://www.rdca.com/_files/ugd/c846e3_0a2aae2dc6d949109796cb2c9c333793.pdf", icon:"ti-shield-check", real:true },
        { title:"Member Protection Policy", cat:"Conduct & Safety", url:"https://www.rdca.com/_files/ugd/c846e3_a8fd9209cf6541a5968832c02220cf6a.pdf", icon:"ti-shield-check", real:true },
        { title:"Children & Young People Policy", cat:"Child Safety", url:"https://www.rdca.com/_files/ugd/5d13eb_50ec172962db450a85ac926f9f1ce71e.pdf", icon:"ti-shield-check", real:true },
        { title:"Looking After Our Kids", cat:"Child Safety", url:"https://www.rdca.com/_files/ugd/5d13eb_8fc85fe2be194b16aeae2526d5955372.pdf", icon:"ti-shield-check", real:true },
        { title:"Junior By-Laws & Playing Conditions", cat:"Forms & Rules — RDCA to supply file", url:"/docs/RDCA-Junior-Documents-README.pdf", icon:"ti-file-text", needsReview:true }
      ],
      codeOfConduct:{ label:"Junior Code of Conduct", file:"/docs/RDCA-Code-of-Conduct.pdf", real:true },
      repTeams:[
        { label:"Rep Team — U12 Boys",  url:"https://www.rdca.com/juniors-under-12s", real:true, blank:true },
        { label:"Rep Team — U12 Girls", url:"https://www.rdca.com/junior-rep-girls", real:true, blank:true },
        { label:"Rep Team — U14 Boys",  url:"https://www.rdca.com/juniors-under-14s", real:true, blank:true },
        { label:"Rep Team — U14 Girls", url:"https://www.rdca.com/copy-of-rep-team-girls", real:true, blank:true },
        { label:"Rep Team — U16 Boys",  url:"https://www.rdca.com/juniors-under-16s", real:true, blank:true },
        { label:"Rep Team — U17 Girls", url:"https://www.rdca.com/copy-2-of-rep-team-girls", real:true, blank:true },
        { label:"Rep Team — U17 Boys",  url:"https://www.rdca.com/juniors-under-18s", real:true, blank:true }
      ]
    },
    seniors: {
      title:"Seniors", icon:"ti-trophy",
      blurb:"RDCA senior grade cricket — the core Saturday competition across divisions.",
      playhqKey:"seniors",
      aboutText:"<p>Senior cricket is the heart of the RDCA &mdash; the traditional Saturday competition contested across multiple grades, from Premier Division through the lower divisions. Clubs field teams to suit players of every standard, from those chasing premierships to weekend social cricketers.</p>",
      conduct:{ summary:"<p>RDCA matches are played in the true spirit of cricket. The Code of Conduct &mdash; based on the Victorian Metropolitan Cricket Union (VMCU) code &mdash; sets out the standards of behaviour expected of players, club officials, coaches and spectators: respect for umpires and opponents, fair play, and zero tolerance for abuse, intimidation or discrimination. Serious or repeated breaches can lead to reports and suspensions.</p>", url:"https://www.rdca.com/seniors-code-of-conduct" },
      committee:{ label:"Senior Committee", url:"/committees.html#senior-committee", internal:true, real:true },
      documents:{ label:"Seniors Documents", url:"https://www.rdca.com/seniors-documents", real:true },
      codeOfConduct:{ label:"Senior Code of Conduct", url:"https://www.rdca.com/seniors-code-of-conduct", real:true },
      links:[ { label:"Suspended Players", url:"https://www.rdca.com/suspended-players", real:true } ]
    },
    veterans: {
      title:"Veterans", icon:"ti-medal",
      blurb:"Veterans cricket for older players who want to keep enjoying the game.",
      playhqKey:"veterans",
      aboutText:"<p>RDCA Veterans cricket is an Over-40s Big Bash &mdash; a relaxed Twenty20 format for players who want to keep enjoying the game in their later cricketing years. Teams nominate each season, and players of all backgrounds are welcome.</p><p style='margin-top:10px'><em>The Veterans&rsquo; motto: &ldquo;Strive to do your best, never give up and treat people with respect.&rdquo;</em></p><p style='margin-top:10px'>To get involved, speak to your club or call Peter Chamings on <a href='tel:+61419693097'>0419 693 097</a>. Forms: <a href='https://www.rdca.com/_files/ugd/bad3dd_ff323a6c498c495692aee01743d6d570.docx?dn=RDCA%20Over%2040s%20Big%20Bash%207%20Team%20Nomination%20form%202026.docx' target='_blank' rel='noopener'>Team Nomination (2026)</a> &middot; <a href='https://www.rdca.com/_files/ugd/bad3dd_bdb67564cd4347b49a516f68f16879f8.docx?dn=RDCA%20Big%20Bash%20Veterans%20T20%20Rules%202026.docx' target='_blank' rel='noopener'>Big Bash T20 Rules (2026)</a>.</p>",
      conduct:{ summary:"<p>Veterans cricket is played in great spirit, true to the section&rsquo;s motto. The Code of Conduct sets out the behaviour expected of all participants &mdash; respect for opponents and officials, fair play, and no abuse, intimidation or discrimination.</p>", url:"https://www.rdca.com/veterans-code-of-conduct" },
      about:{ label:"About Veterans", url:"https://www.rdca.com/about-veterans", real:true },
      committee:{ label:"Veterans Committee", url:"/committees.html#veterans-committee", internal:true, real:true },
      documents:{ label:"Veterans Documents", url:"https://www.rdca.com/veterans-documents", real:true },
      codeOfConduct:{ label:"Veterans Code of Conduct", url:"https://www.rdca.com/veterans-code-of-conduct", real:true }
    },
    womens: {
      title:"Women's", icon:"ti-ball-baseball",
      blurb:"Women's cricket in the RDCA, played in the East competition.",
      playhqKey:"womens",
      aboutText:"<p>Women&rsquo;s cricket in the RDCA is played in the East competition, offering a welcoming and competitive environment for women and girls to take up or continue playing. New players of all experience levels are encouraged to get involved through their local club.</p>",
      committee:{ label:"Women's Committee", url:"/committees.html#women-s-committee", internal:true, real:true },
      documents:{ label:"Women's Documents", url:"https://www.rdca.com/copy-of-documents", real:true }
    }
  },

  /* ==========================================================================
     REP (REPRESENTATIVE) CRICKET — senior + junior pathways for men & women.
     Each rep side is a container that leads to its line-up, fixtures, results
     and news. Squad/fixture/result data will be driven by the PlayHQ feed /
     RDCA records once connected; until then links point to PlayHQ / rdca.com
     or are flagged (needsReview) for RDCA to confirm.
     // CONNECT later: PlayHQ API (gradeId per rep team) + SportsWeb One squads.
     ========================================================================== */
  repCricketNote: "Representative cricket pathways across Seniors and Juniors, for men/boys and women/girls. Each side opens its line-up, fixtures, results and news. Squad lists and live fixtures/results will be driven by the PlayHQ feed once connected — items marked \u201cconfirm\u201d need RDCA to supply the link or data.",
  repCricket: {
    pathways: [
      {
        key:"senior", label:"Senior Representative",
        blurb:"RDCA senior representative pathway for men and women.",
        sides:[
          { name:"Senior Men's Rep", cat:"Men", icon:"ti-trophy",
            lineup:{ url:"#", needsReview:true }, fixtures:{ playhq:"seniors" },
            results:{ playhq:"seniors" }, news:{ url:"/news.html" } },
          { name:"Senior Women's Rep", cat:"Women", icon:"ti-trophy",
            lineup:{ url:"#", needsReview:true }, fixtures:{ playhq:"womens" },
            results:{ playhq:"womens" }, news:{ url:"/news.html" } }
        ]
      },
      {
        key:"junior", label:"Junior Representative",
        blurb:"RDCA junior representative pathway across boys' and girls' age groups.",
        sides:[
          { name:"U12 Boys", cat:"Boys", icon:"ti-shield-half-filled", info:"https://www.rdca.com/juniors-under-12s",
            lineup:{ url:"https://www.rdca.com/juniors-under-12s", blank:true, needsReview:true }, fixtures:{ playhq:"juniors" }, results:{ playhq:"juniors" }, news:{ url:"/news.html" } },
          { name:"U12 Girls", cat:"Girls", icon:"ti-shield-half-filled", info:"https://www.rdca.com/junior-rep-girls",
            lineup:{ url:"https://www.rdca.com/junior-rep-girls", blank:true, needsReview:true }, fixtures:{ playhq:"juniors" }, results:{ playhq:"juniors" }, news:{ url:"/news.html" } },
          { name:"U14 Boys", cat:"Boys", icon:"ti-shield-half-filled", info:"https://www.rdca.com/juniors-under-14s",
            lineup:{ url:"https://www.rdca.com/juniors-under-14s", blank:true, needsReview:true }, fixtures:{ playhq:"juniors" }, results:{ playhq:"juniors" }, news:{ url:"/news.html" } },
          { name:"U14 Girls", cat:"Girls", icon:"ti-shield-half-filled", info:"https://www.rdca.com/copy-of-rep-team-girls",
            lineup:{ url:"https://www.rdca.com/copy-of-rep-team-girls", blank:true, needsReview:true }, fixtures:{ playhq:"juniors" }, results:{ playhq:"juniors" }, news:{ url:"/news.html" } },
          { name:"U16 Boys", cat:"Boys", icon:"ti-shield-half-filled", info:"https://www.rdca.com/juniors-under-16s",
            lineup:{ url:"https://www.rdca.com/juniors-under-16s", blank:true, needsReview:true }, fixtures:{ playhq:"juniors" }, results:{ playhq:"juniors" }, news:{ url:"/news.html" } },
          { name:"U17 Boys", cat:"Boys", icon:"ti-shield-half-filled", info:"https://www.rdca.com/juniors-under-18s",
            lineup:{ url:"https://www.rdca.com/juniors-under-18s", blank:true, needsReview:true }, fixtures:{ playhq:"juniors" }, results:{ playhq:"juniors" }, news:{ url:"/news.html" } },
          { name:"U17 Girls", cat:"Girls", icon:"ti-shield-half-filled", info:"https://www.rdca.com/copy-2-of-rep-team-girls",
            lineup:{ url:"https://www.rdca.com/copy-2-of-rep-team-girls", blank:true, needsReview:true }, fixtures:{ playhq:"juniors" }, results:{ playhq:"juniors" }, news:{ url:"/news.html" } }
        ]
      }
    ]
  },

  /* ==========================================================================
     MATCH CENTRE — multiple live/recent games for the Match Centre page.
     Mock detail for layout; real ball-by-ball will come from the PlayHQ feed.
     status: "live" | "tea" | "stumps" | "result"
     ========================================================================== */
  matchCentreNote: "Live and recent RDCA games across all grades. Scores shown are illustrative — once the PlayHQ feed is connected this page updates ball-by-ball, and each card opens the official Match Centre for that game.",
  matchCentre: [
    { id:"prem-r14-ring-croy", grade:"Premier Division", round:"Round 14", venue:"Ringwood Reserve", status:"live",
      home:{ club:"ringwood", name:"Ringwood CC", score:"4/187", overs:"42.2", batting:true },
      away:{ club:"croydon", name:"Croydon CC", score:"223", overs:"", note:"Bowled 223" },
      required:"37 off 48", rrr:"4.63", crr:"4.41",
      partnership:{ bat:"J. Smith 68*", bat2:"T. Brown 34*", runs:"72 runs" },
      bestBowler:"M. Jones 2/34 (9 ov)", lastWicket:"P. Davis b Jones 31 · Over 38.4",
      lastSix:["1","4","6","0","1","2"], url:"#" },
    { id:"prem-r14-lily-nring", grade:"Premier Division", round:"Round 14", venue:"Lilydale Oval", status:"live",
      home:{ club:"northringwood", name:"North Ringwood CC", score:"3/96", overs:"28.0", batting:true },
      away:{ club:"lilydale", name:"Lilydale CC", score:"142", overs:"", note:"All out 142" },
      required:"47 runs", rrr:"2.14", crr:"3.43",
      partnership:{ bat:"A. Khan 41*", bat2:"D. Lee 12*", runs:"38 runs" },
      bestBowler:"S. Patel 3/29 (10 ov)", lastWicket:"R. Otto c & b Patel 18 · Over 24.1",
      lastSix:["0","1","4","1","W","2"], url:"#" },
    { id:"d1-r14-cold-mtev", grade:"Division 1", round:"Round 14", venue:"Coldstream Rec", status:"live",
      home:{ club:"coldstream", name:"Coldstream CC", score:"3/178", overs:"36.0", batting:true },
      away:{ club:"mtevelyn", name:"Mt Evelyn CC", score:"211", overs:"", note:"All out 211" },
      required:"34 off 24", rrr:"8.50", crr:"4.94",
      partnership:{ bat:"B. Singh 77*", bat2:"L. Ward 22*", runs:"61 runs" },
      bestBowler:"K. Roy 2/41 (8 ov)", lastWicket:"M. Hale b Roy 40 · Over 31.2",
      lastSix:["4","2","1","6","0","1"], url:"#" },
    { id:"d1-r14-kil-mont", grade:"Division 1", round:"Round 14", venue:"Pinks Reserve", status:"tea",
      home:{ club:"montrose", name:"Montrose CC", score:"1/40", overs:"12.0", batting:true },
      away:{ club:"kilsyth", name:"Kilsyth CC", score:"156", overs:"", note:"All out 156" },
      required:"117 runs", rrr:"3.07", crr:"3.33",
      partnership:{ bat:"T. Nguyen 24*", bat2:"C. Park 10*", runs:"29 runs" },
      bestBowler:"J. Reid 1/18 (5 ov)", lastWicket:"H. Ali c Reid 9 · Over 6.3",
      lastSix:["1","0","2","1","0","4"], url:"#" },
    { id:"prem-r14-wonga-warr", grade:"Premier Division", round:"Round 14", venue:"Wonga Park Reserve", status:"stumps",
      home:{ club:"wongapark", name:"Wonga Park CC", score:"2/201", overs:"38.0", batting:false },
      away:{ club:"warranwood", name:"Warranwood CC", score:"264", overs:"", note:"Bowled 264" },
      required:"Day 2 — 64 to win", rrr:"-", crr:"5.29",
      partnership:{ bat:"O. Reilly 102*", bat2:"N. Cole 58*", runs:"141 runs" },
      bestBowler:"G. Tan 1/52 (12 ov)", lastWicket:"P. Vella c Tan 7 · Over 9.5",
      lastSix:["6","1","4","2","1","1"], url:"#" },
    { id:"d2-r14-scro-moor", grade:"Division 2", round:"Round 14", venue:"Walker Park", status:"result",
      home:{ club:"southcroydon", name:"South Croydon CC", score:"243", overs:"", note:"All out 243" },
      away:{ club:"mooroolbark", name:"Mooroolbark CC", score:"198", overs:"", note:"All out 198", batting:false },
      required:"South Croydon won by 45 runs", rrr:"-", crr:"-",
      partnership:{ bat:"Player of match", bat2:"D. Cruz 88 (112)", runs:"" },
      bestBowler:"D. Cruz 4/37 (14 ov)", lastWicket:"Match complete",
      lastSix:[], url:"#" }
  ],

  /* ==========================================================================
     UMPIRES  — real rdca.com links.
     // CONNECT later: SportsWeb One "Umpires" section + panel collection.
     ========================================================================== */
  umpires: {
    blurb:"Umpiring in the RDCA — get involved, get accredited, and access resources.",
    links:[
      { label:"About Umpires",            url:"/about-umpires.html", icon:"ti-info-circle", internal:true, real:true },
      { label:"Umpires Committee",        url:"/committees.html#umpires-committee", icon:"ti-users", internal:true, real:true },
      { label:"Become an Umpire",         url:"/become-an-umpire.html", icon:"ti-user-plus", internal:true, real:true },
      { label:"Training",                 url:"/umpire-training.html", icon:"ti-school", internal:true, real:true },
      { label:"Umpire Documents",         url:"/umpire-documents.html", icon:"ti-file-text", internal:true, real:true },
      { label:"Laws of Cricket (MCC)",    url:"https://www.lords.org/mcc/the-laws-of-cricket", icon:"ti-book", real:true, external:true },
      { label:"Umpire (re)Accreditation", url:"https://www.cricketvictoria.com.au/umpiring/level-two-umpire-accreditation/", icon:"ti-certificate", real:true, external:true }
    ]
  },

  /* ==========================================================================
     DOCUMENTS / POLICIES / FORMS  — these point at the real rdca.com document
     hubs per section. Individual downloadable files (PDFs) still need to be
     collected/hosted (Cloudinary or SportsWeb One) — flagged where missing.
     // CONNECT later: SportsWeb One "Documents" library / Supabase storage.
     ========================================================================== */
  documents: [
    // Key forms / rules / policies — direct files on rdca.com (live; no upload needed)
    { title:"Registration Form", cat:"Forms & Rules",              url:"https://www.rdca.com/_files/ugd/c846e3_7ca10e17623b49e8ad0a6e9e4b08f6c3.pdf", type:"pdf", icon:"ti-file-text", real:true },
    { title:"Senior Rules 2026-27", cat:"Forms & Rules",           url:"https://www.rdca.com/_files/ugd/5d13eb_213140ec8e044fe589d6a95ab6b7af43.pdf", type:"pdf", icon:"ti-file-text", real:true },
    { title:"Adverse Weather Policy 2026-27", cat:"Forms & Rules", url:"https://www.rdca.com/_files/ugd/5d13eb_5e0a952f27094f01815aa4c57eb5171a.pdf", type:"pdf", icon:"ti-file-text", real:true },
    { title:"Clearances & Transfers Guide", cat:"Forms & Rules",   url:"https://www.rdca.com/_files/ugd/c846e3_2337caa1f5584ee99832599a9812cdf3.pdf", type:"pdf", icon:"ti-file-text", real:true },
    // Veterans — real files from rdca.com/veterans-documents
    { title:"Veterans Rules", cat:"Veterans",               url:"https://www.rdca.com/_files/ugd/c846e3_aab45fab5ef74cf2aae47e6b5b66bdc7.pdf", type:"pdf", icon:"ti-file-text", real:true },
    { title:"Big Bash (Over 40s T20) Rules 2026", cat:"Veterans", url:"https://www.rdca.com/_files/ugd/bad3dd_bdb67564cd4347b49a516f68f16879f8.docx?dn=RDCA%20Big%20Bash%20Veterans%20T20%20Rules%202026.docx", type:"doc", icon:"ti-file-text", real:true },
    { title:"Extreme Conditions Policy", cat:"Veterans",    url:"https://www.rdca.com/_files/ugd/c846e3_9c33b8f940324a8ab989d56220d4d6a6.pdf", type:"pdf", icon:"ti-file-text", real:true },
    { title:"Member Protection By Law", cat:"Veterans",     url:"https://www.rdca.com/_files/ugd/c846e3_0a2aae2dc6d949109796cb2c9c333793.pdf", type:"pdf", icon:"ti-shield-check", real:true },
    { title:"Member Protection Policy", cat:"Veterans",     url:"https://www.rdca.com/_files/ugd/c846e3_a8fd9209cf6541a5968832c02220cf6a.pdf", type:"pdf", icon:"ti-shield-check", real:true },
    { title:"Clearances & Transfers Guide", cat:"Veterans", url:"https://www.rdca.com/_files/ugd/c846e3_2337caa1f5584ee99832599a9812cdf3.pdf", type:"pdf", icon:"ti-file-text", real:true },
    { title:"Personal Accident Claim Form", cat:"Veterans", url:"https://www.rdca.com/_files/ugd/c846e3_274cf01dc51a4dd994e3a3652c7fb04c.pdf", type:"pdf", icon:"ti-file-text", real:true },
    { title:"Game Day Checklist", cat:"Veterans",           url:"https://www.rdca.com/_files/ugd/c846e3_110a01d5affe459f9780aaddddde7d78.pdf", type:"pdf", icon:"ti-file-text", real:true },
    { title:"MyCricket Results Entry Guide", cat:"Veterans", url:"https://www.rdca.com/_files/ugd/c846e3_7a6d5730dbc94944bdd8256f31bc8ba2.pdf", type:"pdf", icon:"ti-file-text", real:true },
    { title:"Team Nomination Form", cat:"Veterans",         url:"https://www.rdca.com/_files/ugd/bad3dd_ff323a6c498c495692aee01743d6d570.docx?dn=RDCA%20Over%2040s%20Big%20Bash%207%20Team%20Nomination%20form%202026.docx", type:"doc", icon:"ti-file-text", real:true },
    { title:"Business Continuity Plan", cat:"Veterans",     url:"https://www.rdca.com/_files/ugd/c846e3_bd2f9385d4ef401ea4fddfa35c5c1445.pdf", type:"pdf", icon:"ti-file-text", real:true },
    { title:"Club Questionaire", cat:"Veterans",            url:"https://www.rdca.com/_files/ugd/c846e3_3abc462ec3084e199e845ac0766e7b5a.doc?dn=rdca_Insurance_Questionaire.doc", type:"doc", icon:"ti-file-text", real:true },
    { title:"Cricket Ball Order Form 2024/25", cat:"Veterans", url:"https://www.rdca.com/_files/ugd/5d13eb_3e2a22b3f51f4f8a88d6d6b43e5d1c9a.docx?dn=CRICKET%20BALL%20ORDER%20FORM%202024-25%20.docx", type:"doc", icon:"ti-file-text", real:true },
    { title:"Ball Ordering Instructions", cat:"Veterans",   url:"https://www.rdca.com/_files/ugd/5d13eb_c7b3d20837664ca0a944321f72b01171.pdf", type:"pdf", icon:"ti-file-text", real:true },
    { title:"RDCA Constitution 2021/22", cat:"Veterans",    url:"https://www.rdca.com/_files/ugd/93eb8a_bd9553ab5f894123813939041e0ab0ff.pdf", type:"pdf", icon:"ti-file-text", real:true },
    // Women's — real files from rdca.com/copy-of-documents (RDCA Women's East)
    { title:"Women's East Rules 2025/26", cat:"Women's",        url:"https://www.rdca.com/_files/ugd/5d13eb_f761d7028cb34ed6a80ed7c314ab3c4f.pdf", type:"pdf", icon:"ti-file-text", real:true },
    { title:"Discipline & Protests Framework 2025/26", cat:"Women's", url:"https://www.rdca.com/_files/ugd/5d13eb_b3305ed8bc68421bb3427d9ea786205d.pdf", type:"pdf", icon:"ti-file-text", real:true },
    { title:"Code of Conduct — Captains 2025/26", cat:"Women's", url:"https://www.rdca.com/_files/ugd/23872a_dd49cc301761453e9b8f9568a2f94e01.pdf", type:"pdf", icon:"ti-file-text", real:true },
    { title:"Code of Conduct — Players 2025/26", cat:"Women's",  url:"https://www.rdca.com/_files/ugd/23872a_b2a5fd52c19d4d6b914086e876204765.pdf", type:"pdf", icon:"ti-file-text", real:true },
    { title:"Member Protection By Law", cat:"Women's",          url:"https://www.rdca.com/_files/ugd/c846e3_4916c09b103f4a52b94ca2f554d2b540.pdf", type:"pdf", icon:"ti-shield-check", real:true },
    { title:"Member Protection Policy", cat:"Women's",          url:"https://www.rdca.com/_files/ugd/c846e3_a8fd9209cf6541a5968832c02220cf6a.pdf", type:"pdf", icon:"ti-shield-check", real:true },
    { title:"Registration Form", cat:"Women's",                 url:"https://www.rdca.com/_files/ugd/c846e3_7ca10e17623b49e8ad0a6e9e4b08f6c3.pdf", type:"pdf", icon:"ti-file-text", real:true },
    { title:"Clearances & Transfers Guide", cat:"Women's",      url:"https://www.rdca.com/_files/ugd/c846e3_2337caa1f5584ee99832599a9812cdf3.pdf", type:"pdf", icon:"ti-file-text", real:true },
    { title:"MyCricket Results Entry Guide", cat:"Women's",     url:"https://www.rdca.com/_files/ugd/c846e3_7a6d5730dbc94944bdd8256f31bc8ba2.pdf", type:"pdf", icon:"ti-file-text", real:true },
    { title:"Cricket Ball Order Form 2025/26", cat:"Women's",   url:"https://www.rdca.com/_files/ugd/5d13eb_56cb020fd62c47f8aa1595960fbedea7.docx?dn=CRICKET%20BALL%20ORDER%20FORM%202025-26%20.docx", type:"doc", icon:"ti-file-text", real:true },
    { title:"Children & Young People Policy", cat:"Women's",    url:"https://www.rdca.com/_files/ugd/5d13eb_50ec172962db450a85ac926f9f1ce71e.pdf", type:"pdf", icon:"ti-shield-check", real:true },
    { title:"Looking After Our Kids", cat:"Women's",            url:"https://www.rdca.com/_files/ugd/5d13eb_8fc85fe2be194b16aeae2526d5955372.pdf", type:"pdf", icon:"ti-shield-check", real:true },
    { title:"Action Plan — Commitment Statement", cat:"Women's", url:"https://www.rdca.com/_files/ugd/5d13eb_aed92464d2e5486594b707c9707ea38b.pdf", type:"pdf", icon:"ti-shield-check", real:true },
    { title:"Ball Ordering Instructions", cat:"Women's",       url:"https://www.rdca.com/_files/ugd/5d13eb_c7b3d20837664ca0a944321f72b01171.pdf", type:"pdf", icon:"ti-file-text", real:true },
    { title:"Business Continuity Plan", cat:"Women's",         url:"https://www.rdca.com/_files/ugd/c846e3_7a9d4dfb5bac4134932b34845795a179.pdf", type:"pdf", icon:"ti-file-text", real:true },
    { title:"RDCA Constitution 2021/22", cat:"Women's",        url:"https://www.rdca.com/_files/ugd/93eb8a_bd9553ab5f894123813939041e0ab0ff.pdf", type:"pdf", icon:"ti-file-text", real:true },
    // Section document hubs — open the current pages on rdca.com (sections without an inline tab)
    { title:"Junior Documents", cat:"By Section",   url:"https://www.rdca.com/juniors-documents",  type:"hub", icon:"ti-folder", real:true },
    { title:"Seniors Documents", cat:"By Section",  url:"https://www.rdca.com/seniors-documents",  type:"hub", icon:"ti-folder", real:true },
    { title:"Umpire Documents", cat:"By Section",   url:"https://www.rdca.com/umpires-documents",  type:"hub", icon:"ti-folder", real:true },
    { title:"Safeguarding Children & Young People Policy", cat:"Child Safety", url:"https://resources.playcommunity.pulselive.com/playcommunity/document/2024/11/27/9ddd3384-e1e0-4488-9d3a-dc25eaeefa71/Australian-Cricket-s-Policy-for-Safeguarding-Children-Young-People.pdf", type:"pdf", icon:"ti-shield-check", real:true },
    { title:"'Looking After Our Kids' Code of Behaviour", cat:"Child Safety", url:"https://resources.playcommunity.pulselive.com/playcommunity/document/2024/11/27/7587ce1b-83d1-4c80-aa92-8d085ec1faf0/Australian-Cricket-s-Looking-After-Our-Kids-Code-of-Behaviour.pdf", type:"pdf", icon:"ti-shield-check", real:true },
    { title:"Commitment to Safeguarding Children & Young People", cat:"Child Safety", url:"https://resources.playcommunity.pulselive.com/playcommunity/document/2024/11/27/850b4058-29f6-4d85-a3d8-b44202221d7c/Australian-Cricket-s-Statement-of-Commitment-for-Safeguarding-Children-and-Young-People.pdf", type:"pdf", icon:"ti-shield-check", real:true },
    { title:"Cricket Victoria Member Protection Policy 2024", cat:"Child Safety", url:"https://www.cricketvictoria.com.au/wp-content/uploads/2024/11/2024-Member-Protection-Policy.pdf", type:"pdf", icon:"ti-shield-check", real:true },
    { title:"Member Protection Policy By-Law", cat:"Child Safety", url:"https://www.cricketvictoria.com.au/wp-content/uploads/2021/12/Member-Protection-Policy-ByLaw-07-12-2021.pdf", type:"pdf", icon:"ti-shield-check", real:true }
  ],

  /* ==========================================================================
     COMMITTEES / BOARD  — structure is real (links to rdca.com committee
     pages). Individual member names/photos still to be migrated → SAMPLE rows
     are placeholders so the layout is reviewable.
     // CONNECT later: SportsWeb One "People/Committee" collection.
     ========================================================================== */
  committees: {
    note:"The volunteers and officials who run RDCA across each section of the competition.",
    groups:[
      { name:"Senior Committee", real:true, members:[
        { role:"Chair", name:"Wayne Hartley", phone:"0411 403 149", email:"hartleyfam@bigpond.com" },
        { role:"Senior Secretary", name:"Paul Broussard", phone:"0438 342 358", email:"seniors@rdca.com", photo:"https://static.wixstatic.com/media/c4acf1_2a526edbf4a441e1a0f16ace087f3a24~mv2.jpg/v1/crop/x_0,y_10,w_2250,h_2242/fill/w_263,h_262,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Paul%20Brousard_edited.jpg" },
        { role:"Asst. Secretary — Minutes & Rules", name:"Chris Anderson", phone:"0401 945 830", email:"Christopher.Anderson@education.vic.gov.au", photo:"https://static.wixstatic.com/media/93eb8a_6a891c8f31e94c6bb260c61d267b8630~mv2.jpg/v1/crop/x_0,y_608,w_2432,h_2432/fill/w_258,h_258,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Staff%20-%20Mr%20Chris%20Anderson.jpg" },
        { role:"VMCU Rep", name:"Pat Meehan", photo:"https://static.wixstatic.com/media/c4acf1_6be612129ee9478bb0a6862c7ada6aeb~mv2.jpg/v1/fill/w_199,h_258,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Pat%20Meehan%20medium.jpg" },
        { role:"Veterans Secretary", name:"Peter Chamings", phone:"0419 693 097", email:"peter.chamings@gmail.com", photo:"https://static.wixstatic.com/media/c4acf1_ad7dc3b3abaf4c539244e1f4c7fc6a43~mv2.jpg/v1/crop/x_0,y_181,w_1368,h_1363/fill/w_283,h_282,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/peter%20chamings%20veterans_edited_edited_jp.jpg" },
        { role:"General Committee", name:"David Peel", photo:"https://static.wixstatic.com/media/c4acf1_5ebb0c94f1f54f0b92cc820c61d77dfe~mv2.jpg/v1/crop/x_0,y_386,w_2316,h_2316/fill/w_258,h_258,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/David%20Peel.jpg" },
        { role:"General Committee", name:"Steve Oxley", photo:"https://static.wixstatic.com/media/c4acf1_296dfa3e8b4e4a559841e5fbf2e50cb1~mv2.webp/v1/fill/w_276,h_276,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Steve%20Oxley.webp" },
        { role:"PlayHQ", name:"Adam Kuklych", phone:"0402 382 899", email:"adam@mcservices.com.au" }
      ]},
      { name:"Junior Committee", real:true, members:[
        { role:"Junior President", name:"Gavin Kellar", phone:"0401 032 404", email:"gkellar@whitefriars.vic.edu.au", photo:"https://static.wixstatic.com/media/23872a_00948f2b62c64c3a9f6cb9edf9750219~mv2.jpg/v1/crop/x_0,y_84,w_652,h_652/fill/w_258,h_258,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/unnamed%20(18).jpg" },
        { role:"Secretary", name:"Bill Stafford", phone:"0400 442 050", email:"billstafford1@bigpond.com", photo:"https://static.wixstatic.com/media/c846e3_87c61cb8cb344a71a7b9f2404cf45504~mv2.jpg/v1/crop/x_0,y_16,w_1078,h_1078/fill/w_258,h_258,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Bill.jpg" },
        { role:"Girls' Coordinator", name:"Cherie Howland", phone:"0479 196 435", email:"RDCAgirls@gmail.com" },
        { role:"Junior Umpire Coordinator", name:"Doug Dowling", phone:"0432 374 748", email:"dougdowling03@gmail.com" },
        { role:"Girls' Rep Cricket & Development", name:"Dave Sykes", phone:"0419 388 196", email:"dave_sykes_6@yahoo.com.au" },
        { role:"Committee", name:"Kristi Disney", phone:"0431 309 269", email:"kristidisney@bigpond.com" },
        { role:"Committee", name:"Eloise Howland", email:"howlands179@gmail.com" },
        { role:"Committee", name:"Luke Henderson", phone:"0418 313 850", email:"luke.henderson3@bigpond.com" },
        { role:"Committee", name:"Leah Parker", phone:"0411 417 253", email:"leahandstuart@hotmail.com" }
      ]},
      { name:"Women's Committee", real:true, members:[
        { role:"Chair", name:"Linda Bailey", email:"lindabb101@gmail.com", photo:"https://static.wixstatic.com/media/c846e3_156ff6f95fc8411184bd0343bebfb850~mv2.jpg/v1/crop/x_0,y_368,w_2208,h_2208/fill/w_258,h_258,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/20201022_123117.jpg" },
        { role:"Secretary", name:"Pamela Vodopier", phone:"0407 728 786", email:"pvods74@gmail.com" },
        { role:"Secretary", name:"Timothy Court", email:"womens@rdca.com" },
        { role:"BOM Rep", name:"Pat Meehan", phone:"9758 4037", email:"pcmeehan@bigpond.net.au" },
        { role:"Communications Coordinator", name:"Briony Polkinghorne" },
        { role:"Rules", name:"Dee Callanan", phone:"0427 330 733", email:"dee.callanan@yahoo.com" },
        { role:"FTGDCA Rep", name:"Belinda Cunningham" },
        { role:"Junior Liaison", name:"Jas Harrison" }
      ]},
      { name:"Umpires Committee", real:true, members:[
        { role:"President", name:"Jordan Russell", phone:"0413 357 444", email:"j_brussell@outlook.com", photo:"https://static.wixstatic.com/media/9e3e38_25b16187e9dd42bc82f6374e0570750d~mv2.jpg/v1/crop/x_0,y_32,w_412,h_412/fill/w_258,h_258,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Jordan%202.jpg" },
        { role:"Secretary", name:"Doug Wooles" },
        { role:"Selector", name:"Andy Laws", phone:"0418 545 175", email:"alaws2709@gmail.com", photo:"https://static.wixstatic.com/media/9e3e38_b284b8f5d7be414aa5e26843995635a9~mv2.jpg/v1/crop/x_0,y_504,w_3024,h_3024/fill/w_258,h_258,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Andy%20Laws.jpg" },
        { role:"Mentor", name:"Steve Pascoe OAM", phone:"0431 170 963", email:"steve.ann1@outlook.com", photo:"https://static.wixstatic.com/media/bad3dd_f90584f1c3d443a788570bb91be5a33e~mv2.jpg/v1/crop/x_1,y_0,w_350,h_350/fill/w_258,h_258,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/steve-pascoe%20umpires.jpg" },
        { role:"Committee Member", name:"Lothar Pilz", email:"rdca.lothar.pilz@gmail.com", photo:"https://static.wixstatic.com/media/9e3e38_6d8ba35774df489a9a1881b468676bdb~mv2.jpg/v1/fill/w_258,h_258,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Lothar.jpg" },
        { role:"Merchandise", name:"Barry Johnson", phone:"0417 102 057", email:"barbaradawnjohnson@gmail.com", photo:"https://static.wixstatic.com/media/9e3e38_3cecca6276f842ce81619ee9653a38d6~mv2.jpg/v1/crop/x_0,y_80,w_480,h_480/fill/w_264,h_263,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Barry%20Johnson.jpg" },
        { role:"Recruitment", name:"TBA" }
      ]},
      { name:"Veterans Committee", real:true, note:"RDCA Veterans cricket is administered by the Senior Committee — see the Veterans Secretary, Peter Chamings, above.", members:[] }
    ]
  },

  /* ==========================================================================
     SPONSORS  — REAL set carried from the approved homepage.
     // CONNECT later: SportsWeb One "Sponsors" collection (logo on Cloudinary).
     ========================================================================== */
  sponsors: [
    { name:"SEDA College", tier:"Education Partner", url:"https://seda.vic.edu.au",
      logo:"https://res.cloudinary.com/dozdbhjhs/image/upload/v1780760760/seda-vic-logo_cxgyvs.svg",
      grad:["#081828","#0d2a4a"], logoMode:"invert", cta:"Learn More",
      blurb:"Sport & Education Development Australia — combining VCE studies with elite sporting pathways for the next generation of cricketers.", real:true },
    { name:"Grant Professionals", tier:"Proud Sponsor", url:"https://www.grantprofessionals.com.au/",
      logo:"https://res.cloudinary.com/dozdbhjhs/image/upload/v1780769907/images_18_iq66l4.png",
      grad:["#1a4a78","#2f7bbf"], logoMode:"chip", cta:"Visit Website",
      blurb:"A proud supporter of cricket in Melbourne's east. Partnering with RDCA to develop the game at all levels of the community.", real:true },
    { name:"Altegra", tier:"Official Supplier", url:"https://altegra.com.au",
      logo:"https://res.cloudinary.com/dozdbhjhs/image/upload/v1780760760/Altegra.com_.au-logo_350x100_tqmti7.png",
      grad:["#0a1f0a","#1a3a1a"], logoMode:"invert", cta:"Shop Now",
      blurb:"Premium gazebos, marquees and shade structures. The official outdoor equipment supplier to RDCA clubs.", real:true },
    { name:"Field of View", tier:"Photography Partner", url:"https://www.fieldofview.com.au/",
      logo:"https://res.cloudinary.com/dozdbhjhs/image/upload/v1780760760/FOV_p2scu1.avif",
      grad:["#176635","#25a54f"], logoMode:"chip", cta:"View Portfolio",
      blurb:"Capturing the moments that matter. RDCA's official photographer — covering matches, events and finals all season.", real:true },
    { name:"Dorset Gardens Hotel", tier:"Hospitality Partner", url:"https://www.dorsetgardenshotel.com.au/",
      logo:"https://res.cloudinary.com/dozdbhjhs/image/upload/v1780769044/images_4_x9mrk5.jpg",
      grad:["#3a1a05","#7a3a10"], logoMode:"bare", cta:"Book a Table",
      blurb:"Ringwood's premier hospitality venue — great food, cold drinks and sport on every screen.", real:true },
    { name:"Bendigo Bank Mooroolbark", tier:"Banking Partner", url:"https://www.bendigobank.com.au/branch/vic/community-bank-mooroolbark/",
      logo:"https://res.cloudinary.com/dozdbhjhs/image/upload/v1780769147/Resized_Sponsor_logos10_jgn2lt.avif",
      grad:["#4a0e20","#721444"], logoMode:"chip", cta:"Visit Branch",
      blurb:"Community Bank Mooroolbark — local banking that gives back. Proudly supporting RDCA cricket.", real:true },
    { name:"Fridge Repairs Today", tier:"Official Sponsor", url:"https://www.fridgerepairs.net.au/",
      logo:"https://res.cloudinary.com/dozdbhjhs/image/upload/v1780769263/Fridge-Repairs-Melbourne_gxvytd.webp",
      grad:["#051a2a","#0a3050"], logoMode:"bare", cta:"Get a Free Quote",
      blurb:"Melbourne's trusted fridge and appliance repair specialists. Fast, affordable, same-day service.", real:true },
    { name:"Good Sports", tier:"Community Wellbeing Partner", url:"https://goodsports.com.au/",
      logo:"https://res.cloudinary.com/dozdbhjhs/image/upload/v1780770434/good-sports-social.width-1280_uvdayn.png",
      grad:["#0a8aaa","#4acae4"], logoMode:"chip", cta:"Learn More",
      blurb:"Supporting 12,000+ Australian community clubs to reduce alcohol and drug harms — fostering healthier, safer environments.", real:true }
  ,
    { name:"Cricket Victoria", tier:"State Body", url:"https://www.cricketvictoria.com.au/",
      logo:"https://static.wixstatic.com/media/c846e3_3001cafca72f4f7f80fbdcd9f9e40840~mv2.jpg/v1/fit/w_320,h_280,q_85,enc_avif,quality_auto/c846e3_3001cafca72f4f7f80fbdcd9f9e40840~mv2.jpg",
      grad:["#081a38","#103063"], logoMode:"chip", cta:"Visit Website",
      blurb:"Home of Victorian cricket — elite pathways, coaching and the indoor centre where the state's future stars train.", real:true },
    { name:"Kookaburra Sport", tier:"Cricket Equipment", url:"https://www.kookaburrasport.com.au/cricket/",
      logo:"https://static.wixstatic.com/media/c846e3_b5469719eebe4fd48cbe902842c98a51~mv2.jpg/v1/fit/w_320,h_280,q_85,enc_avif,quality_auto/c846e3_b5469719eebe4fd48cbe902842c98a51~mv2.jpg",
      grad:["#6e0a14","#b81428"], logoMode:"chip", cta:"Shop Cricket Gear",
      blurb:"The iconic Australian cricket brand — bats, balls and protective gear to take your game to the next level.", real:true },
    { name:"Saxon Sports", tier:"Facilities & Coaching", url:"https://www.saxonsports.com.au/",
      logo:"https://static.wixstatic.com/media/c846e3_4ebe3f8d2f934246b2207e2c99ca3fed~mv2.jpg/v1/fit/w_320,h_280,q_85,enc_avif,quality_auto/c846e3_4ebe3f8d2f934246b2207e2c99ca3fed~mv2.jpg",
      grad:["#0a2e3a","#13616f"], logoMode:"chip", cta:"Book Online",
      blurb:"State-of-the-art indoor cricket facilities and coaching for individuals, groups and clubs across Melbourne's east.", real:true },
    { name:"Club Builder", tier:"Club Development", url:"https://www.club-builder.com.au/",
      logo:"https://static.wixstatic.com/media/c846e3_5cd9e36249554dc5abfcf84cd995c270~mv2.jpg/v1/fit/w_320,h_280,q_85,enc_avif,quality_auto/c846e3_5cd9e36249554dc5abfcf84cd995c270~mv2.jpg",
      grad:["#0d3a2a","#1a7a55"], logoMode:"chip", cta:"Learn More",
      blurb:"Strategic planning and governance support helping community clubs grow and thrive for generations.", real:true },
    { name:"McPhail & Partners", tier:"Accounting Partner", url:"https://www.mcphailandpartners.com.au/",
      logo:"https://static.wixstatic.com/media/bad3dd_269fc0d2a92441fcb7085a65482c03ae~mv2.jpg/v1/fit/w_320,h_280,q_85,enc_avif,quality_auto/bad3dd_269fc0d2a92441fcb7085a65482c03ae~mv2.jpg",
      grad:["#0a2440","#14467a"], logoMode:"chip", cta:"Visit Website",
      blurb:"Eastern-suburbs accounting and advisory firm — tax, audit and business services for families and businesses alike.", real:true },
    { name:"Brown & Co Lawyers", tier:"Legal Partner", url:"https://www.browncolawyers.com.au/",
      logo:"https://static.wixstatic.com/media/bad3dd_5142bf9dfdad45248731f5135ecc4789~mv2.png/v1/fit/w_320,h_280,q_85,enc_avif,quality_auto/bad3dd_5142bf9dfdad45248731f5135ecc4789~mv2.png",
      grad:["#14181f","#2a3340"], logoMode:"chip", cta:"Visit Website",
      blurb:"Ringwood-based law firm offering family law, wills & estates, litigation and more across Melbourne's east.", real:true },
    { name:"MoneyQuest Camberwell", tier:"Finance Partner", url:"https://www.moneyquest.com.au/broker/jason-butcher/",
      logo:"https://static.wixstatic.com/media/c846e3_d9768029a6674160ac50a887cadf5d39~mv2.png/v1/fit/w_320,h_280,q_85,enc_avif,quality_auto/c846e3_d9768029a6674160ac50a887cadf5d39~mv2.png",
      grad:["#7a1408","#c8501a"], logoMode:"chip", cta:"Get in Touch",
      blurb:"Mortgage brokers servicing Melbourne's east — home, investment and commercial finance that gives back to local clubs.", real:true },
    { name:"Noel Jones", tier:"Real Estate Partner", url:"https://noeljones.com.au/",
      logo:"https://static.wixstatic.com/media/c846e3_1d15d2a318934c12aacab593c5c3ed4e~mv2.jpg/v1/fit/w_320,h_280,q_85,enc_avif,quality_auto/c846e3_1d15d2a318934c12aacab593c5c3ed4e~mv2.jpg",
      grad:["#0a2342","#13447a"], logoMode:"chip", cta:"Visit Website",
      blurb:"Trusted local agents with 40+ years selling and managing property across Melbourne's eastern suburbs.", real:true },
    { name:"Matrix Roofing", tier:"Roofing Partner", url:"https://matrixroofing.com.au/",
      logo:"https://static.wixstatic.com/media/c846e3_4cbed2531b0e45f7a63dc8543a295562~mv2.jpg/v1/fit/w_320,h_280,q_85,enc_avif,quality_auto/c846e3_4cbed2531b0e45f7a63dc8543a295562~mv2.jpg",
      grad:["#16181c","#2c3138"], logoMode:"chip", cta:"Get a Quote",
      blurb:"Roof restoration and repair specialists servicing Melbourne's eastern and south-eastern suburbs.", real:true },
    { name:"Shieldguard Security", tier:"Security Partner", url:"https://www.shieldguard.com.au/",
      logo:"https://static.wixstatic.com/media/c846e3_0f97cb15dfce4f66b896d3a39208dfe6~mv2.jpg/v1/fit/w_320,h_280,q_85,enc_avif,quality_auto/c846e3_0f97cb15dfce4f66b896d3a39208dfe6~mv2.jpg",
      grad:["#15181d","#2e353f"], logoMode:"chip", cta:"Visit Website",
      blurb:"Melbourne family business since 1974 — custom steel and wrought-iron security doors, gates and grilles.", real:true },
    { name:"Best Embroidery", tier:"Apparel Partner", url:"https://bestembroidery.com.au/",
      logo:"https://static.wixstatic.com/media/c846e3_4488d45c1d93450c808c0e937ab9203e~mv2.jpg/v1/fit/w_320,h_280,q_85,enc_avif,quality_auto/c846e3_4488d45c1d93450c808c0e937ab9203e~mv2.jpg",
      grad:["#3a0e1a","#7a1f38"], logoMode:"chip", cta:"Get a Quote",
      blurb:"Melbourne embroidery specialists — custom logos on workwear, uniforms and corporate apparel.", real:true },
    { name:"ChildSafe", tier:"Child Safety Partner", url:"https://www.childsafe.org.au/",
      logo:"https://static.wixstatic.com/media/c846e3_52d6aa933bc64d7e9200a265329c2e2d~mv2.jpg/v1/fit/w_320,h_280,q_85,enc_avif,quality_auto/c846e3_52d6aa933bc64d7e9200a265329c2e2d~mv2.jpg",
      grad:["#0a3a3f","#127a72"], logoMode:"chip", cta:"Learn More",
      blurb:"Helping clubs meet child safety standards and build a strong culture of protecting young players.", real:true },
    { name:"Outside the Locker Room", tier:"Wellbeing Partner", url:"https://otlr.org.au/",
      logo:"https://static.wixstatic.com/media/23872a_70c19482bff5426182eda9ee6fc844ec~mv2.png/v1/fit/w_320,h_280,q_85,enc_avif,quality_auto/23872a_70c19482bff5426182eda9ee6fc844ec~mv2.png",
      grad:["#0a3a44","#11808f"], logoMode:"chip", cta:"Learn More",
      blurb:"Mental health education and support that helps sporting clubs look after their players and communities.", real:true },
    { name:"Radio Eastern FM", tier:"Community Radio", url:"http://www.radioeasternfm.com.au/",
      logo:"https://static.wixstatic.com/media/c846e3_2b1f596dfc2d4ad88f33d5c12d4c992f~mv2.jpg/v1/fit/w_320,h_280,q_85,enc_avif,quality_auto/c846e3_2b1f596dfc2d4ad88f33d5c12d4c992f~mv2.jpg",
      grad:["#2a0e44","#5a2090"], logoMode:"chip", cta:"Tune In",
      blurb:"Community radio for Melbourne's east — local news, information and music powered by members and sponsors.", real:true },
    { name:"Michael Sukkar MP", tier:"Federal Member for Deakin", url:"http://www.michaelsukkar.com.au/",
      logo:"https://static.wixstatic.com/media/c846e3_d4e23c794e2249f9b4ff05c153f1a7ed~mv2.jpg/v1/fit/w_320,h_280,q_85,enc_avif,quality_auto/c846e3_d4e23c794e2249f9b4ff05c153f1a7ed~mv2.jpg",
      grad:["#0a2746","#13497e"], logoMode:"chip", cta:"Visit Website",
      blurb:"Federal Member for Deakin, proudly supporting community sport across Melbourne's eastern suburbs.", real:true },
    { name:"David Hodgett MP", tier:"State Member for Croydon", url:"https://davidhodgett.com.au/",
      logo:"https://static.wixstatic.com/media/c846e3_a15141a0f87d40b18d2391f76b47e019~mv2.jpg/v1/fit/w_320,h_280,q_85,enc_avif,quality_auto/c846e3_a15141a0f87d40b18d2391f76b47e019~mv2.jpg",
      grad:["#0c2240","#154173"], logoMode:"chip", cta:"Visit Website",
      blurb:"State Member for Croydon, backing local residents, businesses and community clubs.", real:true },
    { name:"SportsWeb Australia", tier:"Website Partner", url:"https://sportsweb.com.au",
      logo:"https://static.wixstatic.com/media/23872a_5a7011130e6b4c21bc54751b83b21577~mv2.png/v1/fit/w_320,h_280,q_85,enc_avif,quality_auto/23872a_5a7011130e6b4c21bc54751b83b21577~mv2.png",
      grad:["#10153a","#2a3a8a"], logoMode:"chip", cta:"Visit Website",
      blurb:"Specialist websites for cricket clubs and associations — boosting your online presence and sponsorship.", real:true }
  ],

  /* ==========================================================================
     NEWS  — SAMPLE items for layout. Replace with real match reports / notices.
     // CONNECT later: SportsWeb One "News" collection / Supabase `articles`.
     ========================================================================== */
  /* ==========================================================================
     ARTICLES — full news article bodies, opened by article.html?slug=...
     Mock editorial content for layout; real articles come from the CMS/feed.
     ========================================================================== */
  articles: [
    { slug:"ringwood-edge-croydon-thriller", title:"Ringwood edge Croydon in thriller as Smith steers chase with unbeaten 89",
      cat:"Match Report", date:"2026-02-14", author:"RDCA Media", readMins:3,
      meta:"Premier Division · Round 13",
      image:"https://images.unsplash.com/photo-1593766827228-8737b4534aa6?w=1200&q=78&auto=format&fit=crop",
      body:"<p>Ringwood CC held their nerve in a tense run chase at Ringwood Reserve, overhauling Croydon&rsquo;s 223 with two wickets to spare thanks to an unbeaten 89 from opener Jake Smith.</p><p>Chasing 224, Ringwood lost early wickets before Smith and a composed middle order rebuilt the innings. With 37 needed off the final eight overs, Smith accelerated, finding the boundary at key moments to settle any nerves in the rooms.</p><p>Croydon&rsquo;s bowlers fought hard, with Jones the pick of the attack, but the home side&rsquo;s experience told in the closing overs. The result tightens the Premier Division ladder heading into the final rounds.</p><p><em>Full scorecards and ladders are available on PlayHQ via the Competition Hub.</em></p>", sample:true },
    { slug:"season-registrations-2026-27", title:"Season 2026-27 registrations now open",
      cat:"Announcement", date:"2026-09-01", author:"RDCA", readMins:3,
      meta:"Association",
      image:"https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&q=78&auto=format&fit=crop",
      body:"<p>Player registrations for the 2026-27 RDCA season are now open across all grades and age groups &mdash; Seniors, Juniors, Women&rsquo;s and Veterans.</p><p>New and returning players should register through their local club. Clubs will confirm training nights, fees and grading closer to the season start.</p><p>Not sure which club is closest? Browse the full Club Directory to find your nearest RDCA club, its home ground and contacts.</p>", sample:true },
    { slug:"four-rdca-juniors-u17-squad", title:"Four RDCA juniors named in U17 state squad",
      cat:"Junior Pathway", date:"2026-08-26", author:"RDCA Media", readMins:3,
      meta:"Representative",
      image:"https://images.unsplash.com/photo-1599982946086-eb42d9e14eb8?w=1200&q=78&auto=format&fit=crop",
      body:"<p>Four RDCA juniors have been selected in the U17 state squad following strong representative carnival campaigns, a terrific reward for the Association&rsquo;s rep pathway.</p><p>The quartet came through RDCA junior rep teams, balancing club commitments with the demands of representative cricket across the season.</p><p>RDCA congratulates the players, their clubs and the coaches and volunteers who support the junior pathway.</p>", sample:true },
    { slug:"croydon-cc-ground-redevelopment", title:"Croydon CC complete major ground redevelopment",
      cat:"Club News", date:"2026-08-07", author:"RDCA Media", readMins:3,
      meta:"Clubs",
      image:"https://images.unsplash.com/photo-1607734834519-d8576ae60ea6?w=1200&q=78&auto=format&fit=crop",
      body:"<p>Croydon CC has completed a major redevelopment of its home ground, including upgraded turf wickets, nets and pavilion facilities for players and supporters.</p><p>The works, supported by council and club volunteers, position the club to host more matches and grow participation across senior, junior and women&rsquo;s cricket.</p><p>The club thanked its members, sponsors and the wider RDCA community for their support throughout the project.</p>", sample:true }
  ],

  news: [
    // image: URL of the article's photo → shown as the card thumbnail.
    // Leave null to fall back to the white-on-navy category icon.
    { title:"Season 2026-27 registrations now open", date:"2026-09-01", cat:"Association", excerpt:"Player registrations for the new season are open across all grades and age groups.", url:"#", image:null, slug:"season-registrations-2026-27", sample:true },
    { title:"Representative squads announced", date:"2026-08-20", cat:"Representative", excerpt:"Junior representative squads have been named ahead of the carnival season.", url:"#", image:null, slug:"four-rdca-juniors-u17-squad", sample:true },
    { title:"Umpire accreditation course dates", date:"2026-08-10", cat:"Umpires", excerpt:"Upcoming Level 1 and Level 2 umpire accreditation sessions across the east.", url:"#", image:null, sample:true }
  ],
  newsArchive: [
    { title:"Grand Final wrap: Premier Division decided in a thriller", cat:"Finals",         date:"Apr 2025", url:"https://www.rdca.com", sample:true },
    { title:"RDCA representative squads announced for 2024/25",         cat:"Representative", date:"Nov 2024", url:"https://www.rdca.com", sample:true },
    { title:"Life Membership awarded at annual presentation night",     cat:"Association",    date:"May 2024", url:"https://www.rdca.com", sample:true },
    { title:"Junior Blast program returns for summer",                  cat:"Juniors",        date:"Oct 2024", url:"https://www.rdca.com", sample:true },
    { title:"Umpire panel expands ahead of the new season",             cat:"Umpires",        date:"Sep 2024", url:"https://www.rdca.com", sample:true },
    { title:"Women's competition grows to record numbers",              cat:"Women's",        date:"Aug 2024", url:"https://www.rdca.com", sample:true }
  ],

  /* ==========================================================================
     HONOURS / RECORDS  — SAMPLE rows for layout. Replace with real honour board.
     // CONNECT later: SportsWeb One "Honours" collection.
     ========================================================================== */
  honours: {
    lifeMembers: [
      { season:"2021/22", name:"Stuart Minetti",   assoc:"RDCA", doc:"https://www.rdca.com/_files/ugd/93eb8a_77bdb4ba63eb4390b065c54da9f4c596.pdf", real:true },
      { season:"2019/20", name:"Gregor Mason",      assoc:"RDCA", doc:"https://www.rdca.com/_files/ugd/c846e3_af032b3e495b427eb7b7ac8209fe11a2.pdf", real:true },
      { season:"2014/15", name:"Greg Mitchell",     assoc:"YVCA", doc:"https://www.rdca.com/_files/ugd/c846e3_fd01d16ca4374ab19cea7192da5cac20.docx?dn=YVCA%2520LM%2520G.Mitchell.docx", real:true },
      { season:"2014/15", name:"Ian Dench",         assoc:"RDCA", doc:"https://www.rdca.com/_files/ugd/c846e3_aa2a9fb4f48d43c68c5450b8737b4f1c.pdf", real:true },
      { season:"2012/13", name:"Bill Stafford",     assoc:"RDCA", doc:"https://www.rdca.com/_files/ugd/c846e3_42a62ab1eeb64df3aefe98c205913eb7.pdf", real:true },
      { season:"2012/13", name:"Tony Gawne",        assoc:"RDCA", doc:"https://www.rdca.com/_files/ugd/c846e3_3f24ce4104544806b5b52d3c64a16084.pdf", real:true },
      { season:"2011/12", name:"Tim Court",         assoc:"RDCA", doc:"https://www.rdca.com/_files/ugd/c846e3_39867587b8c346d58254ae0d472b82bd.pdf", real:true },
      { season:"2009/10", name:"Adrian Hammond",    assoc:"YVCA", doc:"https://www.rdca.com/_files/ugd/c846e3_e7baf7b8a0cd4c07ab6738ed56ac6f6f.pdf", real:true },
      { season:"2009/10", name:"Ian Spencer",       assoc:"RDCA", doc:"https://www.rdca.com/_files/ugd/c846e3_1272969a87e444d9b0975621d1853723.pdf", real:true },
      { season:"2009/10", name:"Josh Browne *",     assoc:"RDCA", doc:"https://www.rdca.com/_files/ugd/c846e3_f5390ae572da429198dcdbd924d5602c.pdf", real:true },
      { season:"2007/08", name:"John Springett *",  assoc:"RDCA", doc:"https://www.rdca.com/_files/ugd/c846e3_2ce38531f30740e598da3f46c7d180e4.pdf", real:true }
    ],
    premiers: [
      { season:"2024/25", winners:[ {grade:"Premier Division",club:""},{grade:"Division 1",club:""},{grade:"Division 2",club:""} ], sample:true },
      { season:"2023/24", winners:[ {grade:"Premier Division",club:""},{grade:"Division 1",club:""},{grade:"Division 2",club:""} ], sample:true },
      { season:"2022/23", winners:[ {grade:"Premier Division",club:""},{grade:"Division 1",club:""},{grade:"Division 2",club:""} ], sample:true },
      { season:"2021/22", winners:[ {grade:"Premier Division",club:""},{grade:"Division 1",club:""},{grade:"Division 2",club:""} ], sample:true },
      { season:"2020/21", winners:[ {grade:"Premier Division",club:""},{grade:"Division 1",club:""},{grade:"Division 2",club:""} ], sample:true }
    ],
    boards: [
      { label:"Hall of Fame",       url:"/hall-of-fame.html",        icon:"ti-award",          note:"Legends & inductees",      real:true },
      { label:"Honour Board",       url:"/honour-board.html",        icon:"ti-clipboard-list", note:"Life members & premiers",  real:true },
      { label:"Awards",             url:"/awards.html",              icon:"ti-medal",          note:"Season award winners",      real:true },
      { label:"Premiership Photos", url:"/premiership-photos.html",  icon:"ti-photo",          note:"Premiership galleries",     real:true }
    ]
  },
  events: [
    {
      slug:"awards-night", day:"28", month:"JAN", dateLabel:"Saturday 28 January 2027",
      time:"6:30 PM \u2013 11:00 PM", category:"Association Event",
      title:"RDCA Annual Awards Night", venue:"Ringwood Function Centre", address:"Ringwood, Victoria",
      image:"https://res.cloudinary.com/dozdbhjhs/image/upload/v1780761368/480425379_9162514167130775_2819874434032542497_n_o6gikt.jpg",
      summary:"The Association's night of nights \u2014 celebrating the season's standout players, clubs and volunteers across every RDCA grade.",
      details:[
        "Join us for the RDCA Annual Awards Night, where we recognise the best of the season across senior, junior, women's and veterans cricket. The evening includes presentation of the batting, bowling and all-rounder awards for each grade, along with club champion and volunteer recognition.",
        "Tickets are arranged through clubs. Tables of ten are available, and clubs are encouraged to book early as the night sells out most seasons. Dress is smart/cocktail."
      ],
      sample:true
    },
    {
      slug:"secretary-forum", day:"31", month:"JAN", dateLabel:"Friday 31 January 2027",
      time:"7:00 PM \u2013 8:30 PM", category:"Administration",
      title:"Club Secretary Forum", venue:"RDCA Offices, Ringwood", address:"Ringwood, Victoria",
      image:"https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&q=80&auto=format&fit=crop",
      summary:"A working session for club secretaries covering finals procedures, registrations and end-of-season administration.",
      details:[
        "This forum walks club secretaries through the back half of the season: finals eligibility and paperwork, PlayHQ administration, transfers, and key reporting dates. It is a good chance to raise questions directly with the Board and Operations team.",
        "One representative per club is requested. An agenda and supporting documents are circulated to club contacts in the week prior."
      ],
      sample:true
    },
    {
      slug:"premier-finals", day:"14", month:"FEB", dateLabel:"Saturday 14 February 2027",
      time:"From 10:00 AM", category:"Finals Cricket",
      title:"RDCA Premier Division Finals", venue:"Ringwood Reserve", address:"Ringwood, Victoria",
      image:"https://images.unsplash.com/photo-1512719994953-eabf50895df7?w=1200&q=80&auto=format&fit=crop",
      summary:"The blue-riband fixture of the RDCA season \u2014 the Premier Division Grand Final at Ringwood Reserve.",
      details:[
        "The top two Premier Division sides meet across the two-day Grand Final for the Association's premier senior title. Entry is free and all cricket supporters are welcome \u2014 canteen and bar facilities operate across both days.",
        "Live scoring is available via PlayHQ. Play begins at 10:00 AM on day one; refer to the competition hub closer to the date for the latest start times and any weather updates."
      ],
      sample:true
    }
  ]
};
