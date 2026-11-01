import { deviceCatalog, phoneCatalog } from "./sellCatalog";
import { slugify } from "./vehicles";
import logoAcer from "../assets/images/logo-acer.svg";
import logoAlienware from "../assets/images/logo-alienware.svg";
import logoAmazon from "../assets/images/logo-amazon.svg";
import logoApple from "../assets/images/logo-apple.svg";
import logoAsus from "../assets/images/logo-asus.svg";
import logoAtari from "../assets/images/logo-atari.svg";
import logoBoat from "../assets/images/logo-boat.svg";
import logoBose from "../assets/images/logo-bose.svg";
import logoDell from "../assets/images/logo-dell.svg";
import logoDji from "../assets/images/logo-dji.svg";
import logoFitbit from "../assets/images/logo-fitbit.svg";
import logoFujifilm from "../assets/images/logo-fujifilm.svg";
import logoGarmin from "../assets/images/logo-garmin.svg";
import logoGoogle from "../assets/images/logo-google.webp";
import logoHonor from "../assets/images/logo-honor.svg";
import logoHp from "../assets/images/logo-hp.svg";
import logoHuawei from "../assets/images/logo-huawei.svg";
import logoInsta360 from "../assets/images/logo-insta360.svg";
import logoJbl from "../assets/images/logo-jbl.svg";
import logoKodak from "../assets/images/logo-kodak.svg";
import logoLeica from "../assets/images/logo-leica.svg";
import logoLenovo from "../assets/images/logo-lenovo.svg";
import logoLg from "../assets/images/logo-lg.svg";
import logoMicrosoft from "../assets/images/logo-microsoft.svg";
import logoMotorola from "../assets/images/logo-motorola.svg";
import logoMsi from "../assets/images/logo-msi.svg";
import logoNikon from "../assets/images/logo-nikon.svg";
import logoNintendo from "../assets/images/logo-nintendo.svg";
import logoNokia from "../assets/images/logo-nokia.svg";
import logoOneplus from "../assets/images/logo-oneplus.svg";
import logoOppo from "../assets/images/logo-oppo.svg";
import logoPanasonic from "../assets/images/logo-panasonic.svg";
import logoPlaystation from "../assets/images/logo-playstation.svg";
import logoRazer from "../assets/images/logo-razer.svg";
import logoRogally from "../assets/images/logo-rogally.svg";
import logoSamsung from "../assets/images/logo-samsung.svg";
import logoSega from "../assets/images/logo-sega.svg";
import logoSennheiser from "../assets/images/logo-sennheiser.svg";
import logoSony from "../assets/images/logo-sony.svg";
import logoSteamdeck from "../assets/images/logo-steamdeck.svg";
import logoToshiba from "../assets/images/logo-toshiba.svg";
import logoVivo from "../assets/images/logo-vivo.svg";
import logoXiaomi from "../assets/images/logo-xiaomi.svg";

export const sellBrandCatalog = {
  phone: {
    path: "/sell-phone",
    noun: "phone",
    crumb: "Sell Phone",
    icon: "fa-mobile-screen-button",
    searchHint: "e.g. iPhone 15",
    brands: [
      {
        key: "Apple",
        name: "Apple",
        tagline: "iPhone 16, 15, 14 & older",
        logo: logoApple,
        series: [
          "iPhone (numbered standard)",
          "iPhone Plus",
          "iPhone Pro",
          "iPhone Pro Max",
          "iPhone mini (legacy)",
          "iPhone Air",
          "iPhone e / SE (budget line)",
        ],
      },
      {
        key: "Samsung",
        name: "Samsung",
        tagline: "Galaxy S, Z Fold & Flip, A, M",
        logo: logoSamsung,
        wide: true,
        series: [
          "Galaxy S",
          "Galaxy Z Fold",
          "Galaxy Z Flip",
          "Galaxy A",
          "Galaxy M",
          "Galaxy F",
          "Galaxy XCover",
          "Galaxy Note (legacy)",
          "Galaxy J (legacy)",
          "Galaxy C (legacy/regional)",
          "Galaxy On (legacy)",
          "Galaxy Core (legacy)",
          "Galaxy Grand (legacy)",
          "Galaxy Ace (legacy)",
          "Galaxy Mega (legacy)",
          "Galaxy Y (legacy)",
        ],
      },
      {
        key: "OnePlus",
        name: "OnePlus",
        tagline: "Number series & Nord",
        logo: logoOneplus,
        series: [
          "Number Series",
          "R Series",
          "T Series (legacy)",
          "Nord",
          "Nord CE",
          "Nord N (regional)",
          "Nord 2T / CE Lite sub-lines",
          "Open (foldable)",
          "Ace (mainly China)",
          "Ace Pro (regional naming)",
        ],
      },
      {
        key: "Xiaomi",
        name: "Xiaomi",
        tagline: "Xiaomi 14, 13 & T series",
        logo: logoXiaomi,
        series: [
          "Xiaomi Number Series",
          "Xiaomi T Series",
          "Xiaomi MIX",
          "Xiaomi Civi",
          "Xiaomi Fold / MIX Fold (regional/legacy)",
          "Xiaomi A (Android One, legacy)",
        ],
      },
      {
        key: "Redmi",
        name: "Redmi",
        tagline: "Redmi Note & number series",
        wordmark: {
          text: "Redmi",
          className: "text-[#E1251B] font-bold tracking-tight",
        },
        series: [
          "Redmi Note",
          "Redmi Number",
          "Redmi A",
          "Redmi K",
          "Redmi Turbo",
          "Redmi C",
          "Redmi Y (legacy/regional)",
        ],
      },
      {
        key: "POCO",
        name: "POCO",
        tagline: "F, X, M & C series",
        wordmark: {
          text: "POCO",
          className: "bg-[#FFD100] text-black font-black italic px-2.5 py-0.5 rounded-md",
        },
        series: ["POCO F", "POCO X", "POCO M", "POCO C"],
      },
      {
        key: "Vivo",
        name: "Vivo",
        tagline: "X, V, T & Y series",
        logo: logoVivo,
        wide: true,
        series: [
          "X",
          "V",
          "Y",
          "T",
          "S",
          "X Fold",
          "NEX (legacy)",
          "U (legacy/regional)",
          "Z (legacy/regional)",
        ],
      },
      {
        key: "Oppo",
        name: "Oppo",
        tagline: "Find, Reno & A series",
        logo: logoOppo,
        wide: true,
        series: [
          "Find X",
          "Find N (foldables)",
          "Reno",
          "A",
          "F",
          "K",
          "R (legacy/regional)",
          "Ace (legacy / revived in some markets)",
          "N (legacy camera-focused)",
          "Neo (legacy/regional)",
          "Mirror (legacy/regional)",
          "Joy (legacy/regional)",
          "U (legacy/regional)",
        ],
      },
      {
        key: "Realme",
        name: "realme",
        tagline: "GT, Number, Narzo & C series",
        wordmark: {
          text: "realme",
          className: "bg-[#FFC915] text-black font-extrabold px-2.5 py-0.5 rounded-md",
        },
        series: [
          "GT",
          "Number Series",
          "Pro / Pro+",
          "P Series",
          "Narzo",
          "C Series",
          "V Series (China)",
          "Q Series (China)",
          "X Series (legacy)",
          "U Series (legacy)",
          "XT (legacy)",
          "N Series (regional/legacy)",
        ],
      },
      {
        key: "Motorola",
        name: "Motorola",
        tagline: "Razr, Edge & Moto G",
        logo: logoMotorola,
        series: [
          "Razr",
          "Edge",
          "Moto G",
          "Moto E",
          "Moto X (legacy / selective revival)",
          "Moto Z (legacy)",
          "Moto One (legacy)",
          "Moto C (legacy)",
          "Moto M (legacy)",
          "Moto P (regional/legacy)",
          "ThinkPhone",
          "Defy (rugged, selective releases)",
        ],
      },
      {
        key: "Nothing",
        name: "Nothing",
        tagline: "Phone (2), (2a), (1) & CMF",
        wordmark: {
          text: "NOTHING",
          className: "font-mono font-bold tracking-[0.2em] text-black",
        },
      },
      {
        key: "Nokia",
        name: "Nokia",
        tagline: "X, G & C series",
        logo: logoNokia,
        wide: true,
      },
      {
        key: "Infinix",
        name: "Infinix",
        tagline: "GT, Zero, Note & Hot",
        wordmark: {
          text: "Infinix",
          className: "text-black font-extrabold italic tracking-tight",
        },
      },
      {
        key: "Tecno",
        name: "Tecno",
        tagline: "Phantom, Camon, Pova & Spark",
        wordmark: {
          text: "TECNO",
          className: "text-[#0055B8] font-black tracking-wide",
        },
      },
      {
        key: "Honor",
        name: "Honor",
        tagline: "Magic, Number & X series",
        logo: logoHonor,
        wide: true,
      },
      {
        key: "iQOO",
        name: "iQOO",
        tagline: "Number, Neo & Z series",
        wordmark: {
          text: "iQOO",
          className: "text-black font-black italic tracking-tight",
        },
      },
      {
        key: "Asus",
        name: "Asus",
        tagline: "ROG Phone & Zenfone",
        logo: logoAsus,
        wide: true,
      },
      {
        key: "Sony",
        name: "Sony",
        tagline: "Xperia 1, 5 & 10",
        logo: logoSony,
        wide: true,
      },
      {
        key: "LG",
        name: "LG",
        tagline: "Wing, Velvet & G series",
        logo: logoLg,
        wide: true,
      },
      {
        key: "Google",
        name: "Google Pixel",
        tagline: "Pixel 8 & 7 series",
        logo: logoGoogle,
        wide: true,
        series: [
          "Pixel (number series)",
          "Pixel Pro",
          "Pixel Pro XL",
          "Pixel a Series",
          "Pixel Fold",
          "Pixel Pro Fold",
          "Pixel XL (legacy)",
          "Pixel 3a / 4a / 5a (legacy a generations)",
        ],
      },
      {
        key: "Huawei",
        name: "Huawei",
        tagline: "Mate, Pura, P & nova",
        logo: logoHuawei,
        series: [
          "Mate",
          "Pura",
          "P (legacy naming)",
          "nova",
          "Enjoy",
          "Mate X (foldables)",
          "Pocket",
          "P Smart (legacy/regional)",
          "Y (legacy/regional)",
        ],
      },
    ],
  },
  laptop: {
    path: "/sell-laptop",
    noun: "laptop",
    crumb: "Sell Laptop",
    icon: "fa-laptop",
    searchHint: "e.g. MacBook Air",
    brands: [
      {
        key: "Apple",
        name: "Apple",
        tagline: "MacBook Air & MacBook Pro",
        logo: logoApple,
        series: [
          "MacBook Neo",
          "MacBook Air",
          "MacBook Pro",
          "MacBook (legacy)",
          "PowerBook (legacy)",
          "iBook (legacy)",
        ],
      },
      {
        key: "Dell",
        name: "Dell",
        tagline: "XPS, Latitude, Inspiron & Vostro",
        logo: logoDell,
        series: [
          "Dell",
          "Dell Plus",
          "Dell Pro",
          "Dell Pro Plus",
          "Dell Pro Premium",
          "Dell Pro Max",
          "Dell Pro Precision",
          "XPS (current/returning line)",
          "Inspiron (legacy name)",
          "Latitude (legacy name)",
          "Vostro (legacy)",
          "Precision (legacy name)",
          "G Series (legacy gaming)",
          "Chromebook (legacy/select)",
        ],
      },
      {
        key: "HP",
        name: "HP",
        tagline: "Spectre, Omen, Envy, Victus & Pavilion",
        logo: logoHp,
        series: [
          "OmniBook",
          "Pavilion",
          "Envy (legacy / select models)",
          "Spectre (legacy / select models)",
          "EliteBook",
          "ProBook",
          "ZBook",
          "OMEN",
          "Victus",
          "HP Essential / Notebook",
          "Stream (legacy)",
          "Chromebook",
          "Dragonfly (legacy / select models)",
        ],
      },
      {
        key: "Lenovo",
        name: "Lenovo",
        tagline: "ThinkPad, Legion, Yoga & IdeaPad",
        logo: logoLenovo,
        wide: true,
        series: [
          "ThinkPad (T, X, E, L, P, Z, X1)",
          "ThinkBook",
          "IdeaPad (1, 3, 5, Pro, Slim, Flex)",
          "Yoga",
          "Legion (5, 7, 9, Pro, Slim)",
          "LOQ",
          "V Series",
          "Chromebook",
          "Essential (legacy)",
          "Miix (legacy 2-in-1)",
        ],
      },
      {
        key: "Asus",
        name: "Asus",
        tagline: "ROG, ZenBook, TUF & VivoBook",
        logo: logoAsus,
        wide: true,
        series: [
          "Zenbook",
          "Vivobook",
          "ProArt",
          "ExpertBook",
          "ROG Zephyrus",
          "ROG Strix",
          "ROG Flow",
          "TUF Gaming",
          "Chromebook",
          "Eee PC / EeeBook (legacy)",
          "Transformer (legacy)",
        ],
      },
      {
        key: "Acer",
        name: "Acer",
        tagline: "Predator, Nitro, Swift & Aspire",
        logo: logoAcer,
        wide: true,
        series: [
          "Aspire",
          "Swift",
          "Spin",
          "Switch (legacy 2-in-1)",
          "Extensa",
          "TravelMate",
          "Nitro",
          "Predator Helios",
          "Predator Triton (legacy/select)",
          "ConceptD (legacy)",
          "Enduro (rugged)",
          "Chromebook",
          "Aspire One (legacy)",
        ],
      },
      {
        key: "Microsoft",
        name: "Microsoft Surface",
        tagline: "Surface Laptop & Surface Pro",
        logo: logoMicrosoft,
        series: [
          "Surface Laptop",
          "Surface Laptop Studio",
          "Surface Pro (2-in-1)",
          "Surface Book (legacy)",
          "Surface Go (tablet/2-in-1)",
        ],
      },
      {
        key: "MSI",
        name: "MSI",
        tagline: "Raider, Stealth, Katana & Modern",
        logo: logoMsi,
        series: [
          "Titan",
          "Raider",
          "Stealth",
          "Vector",
          "Crosshair",
          "Pulse",
          "Katana",
          "Cyborg",
          "Thin",
          "Modern",
          "Prestige",
          "Summit",
          "Creator",
          "Commercial",
          "Bravo (legacy/select)",
          "Alpha (legacy)",
        ],
      },
      {
        key: "Alienware",
        name: "Alienware",
        tagline: "m-series & x-series gaming",
        logo: logoAlienware,
      },
      {
        key: "Razer",
        name: "Razer",
        tagline: "Razer Blade 14, 15 & 16",
        logo: logoRazer,
        series: [
          "Blade 14",
          "Blade 15",
          "Blade 16",
          "Blade 17 (legacy)",
          "Blade 18",
          "Blade Stealth (legacy)",
        ],
      },
      {
        key: "LG",
        name: "LG",
        tagline: "LG gram",
        logo: logoLg,
        wide: true,
        series: [
          "Gram",
          "Gram Pro",
          "Gram Style",
          "Gram 2-in-1",
          "Ultra PC (legacy)",
          "LG R / P Series (legacy)",
        ],
      },
      {
        key: "Samsung",
        name: "Samsung",
        tagline: "Galaxy Book Pro & 360",
        logo: logoSamsung,
        wide: true,
        series: [
          "Galaxy Book",
          "Galaxy Book Pro",
          "Galaxy Book Ultra",
          "Galaxy Book 360",
          "Galaxy Book Edge",
          "Galaxy Chromebook (select markets)",
          "Notebook 9 (legacy)",
          "Notebook 7 (legacy)",
          "Notebook Odyssey (legacy)",
        ],
      },
      {
        key: "Toshiba",
        name: "Toshiba / Dynabook",
        tagline: "Satellite Pro & Portégé",
        logo: logoToshiba,
        wide: true,
        series: [
          "Portégé",
          "Tecra",
          "Satellite Pro",
          "Satellite (legacy Toshiba)",
          "Dynabook G",
          "Dynabook X",
          "Chromebook (select markets)",
        ],
      },
      {
        key: "VAIO",
        name: "VAIO",
        tagline: "SX14, FE & E series",
        wordmark: {
          text: "VAIO",
          className: "text-black font-light tracking-[0.3em]",
        },
        series: [
          "VAIO SX",
          "VAIO S",
          "VAIO FE",
          "VAIO F",
          "VAIO Z (premium / legacy)",
          "VAIO C (legacy)",
        ],
      },
      {
        key: "Huawei",
        name: "Huawei",
        tagline: "MateBook X Pro, 14 & D",
        logo: logoHuawei,
        series: [
          "MateBook X",
          "MateBook X Pro",
          "MateBook",
          "MateBook D",
          "MateBook 14",
          "MateBook 16",
          "MateBook E (2-in-1)",
        ],
      },
      {
        key: "Honor",
        name: "Honor",
        tagline: "MagicBook Pro, X & 15",
        logo: logoHonor,
        wide: true,
        series: [
          "MagicBook",
          "MagicBook X",
          "MagicBook Pro",
          "MagicBook Art",
          "MagicBook View (regional naming)",
        ],
      },
      {
        key: "Gigabyte",
        name: "GIGABYTE",
        tagline: "AORUS, AERO & G series",
        wordmark: {
          text: "GIGABYTE",
          className: "font-black tracking-tight text-slate-900",
        },
        series: [
          "AORUS",
          "AERO",
          "G Series",
          "U Series (select models)",
          "Gaming (legacy/regional)",
        ],
      },
      {
        key: "Fujitsu",
        name: "Fujitsu",
        tagline: "LIFEBOOK, CELSIUS & STYLISTIC",
        wordmark: {
          text: "Fujitsu",
          className: "font-extrabold text-[#E60012] tracking-tight",
        },
        series: [
          "LIFEBOOK U",
          "LIFEBOOK E",
          "LIFEBOOK A (legacy/select)",
          "LIFEBOOK S (legacy)",
          "CELSIUS mobile workstation",
          "STYLISTIC (tablet/2-in-1)",
        ],
      },
      {
        key: "Framework",
        name: "Framework",
        tagline: "Laptop 13 & 16",
        wordmark: {
          text: "Framework",
          className: "font-extrabold text-slate-900 tracking-tight",
        },
        series: ["Laptop 13", "Laptop 16", "Laptop Chromebook Edition (13-inch family)"],
      },
      {
        key: "Chuwi",
        name: "CHUWI",
        tagline: "CoreBook, GemiBook & MiniBook",
        wordmark: {
          text: "CHUWI",
          className: "font-black text-[#1E6FD9] tracking-wide",
        },
        series: [
          "CoreBook",
          "CoreBook X",
          "GemiBook",
          "MiniBook",
          "FreeBook",
          "HeroBook",
          "UBook (2-in-1)",
        ],
      },
      {
        key: "Medion",
        name: "MEDION",
        tagline: "ERAZER & AKOYA",
        wordmark: {
          text: "MEDION",
          className: "font-black text-[#0058A3] tracking-wide",
        },
        series: ["ERAZER (gaming)", "AKOYA", "S-series", "E-series", "Convertible / 2-in-1 lines"],
      },
    ],
  },
  tablet: {
    path: "/sell-tablet",
    noun: "tablet",
    crumb: "Sell Tablet",
    icon: "fa-tablet-screen-button",
    searchHint: "e.g. iPad Air",
    brands: [
      {
        key: "Apple",
        name: "Apple",
        tagline: "iPad Pro, Air, Mini & iPad",
        logo: logoApple,
        series: [
          "iPad",
          "iPad mini",
          "iPad Air",
          "iPad Pro",
          "iPad (numbered generations)",
          "iPad 2 / 3 / 4 (legacy)",
        ],
      },
      {
        key: "Samsung",
        name: "Samsung",
        tagline: "Galaxy Tab S9 & A9 series",
        logo: logoSamsung,
        wide: true,
        series: [
          "Galaxy Tab S",
          "Galaxy Tab S FE",
          "Galaxy Tab A",
          "Galaxy Tab A Lite / A Kids (regional)",
          "Galaxy Tab Active",
          "Galaxy Tab Active Pro",
          "Galaxy Tab E (legacy)",
          "Galaxy Tab 3 / 4 (legacy)",
          "Galaxy Note 10.1 (legacy)",
        ],
      },
      {
        key: "Lenovo",
        name: "Lenovo",
        tagline: "Tab P12 & Tab M series",
        logo: logoLenovo,
        wide: true,
        series: [
          "Lenovo Tab",
          "Tab M",
          "Tab P",
          "Tab K (regional/legacy)",
          "Yoga Tab",
          "Yoga Book",
          "Legion Tab / Y700",
          "ThinkPad X Tablet (legacy)",
          "IdeaPad Duet Chromebook",
        ],
      },
      {
        key: "Xiaomi",
        name: "Xiaomi",
        tagline: "Xiaomi Pad & Redmi Pad",
        logo: logoXiaomi,
        series: [
          "Xiaomi Pad",
          "Xiaomi Pad Pro",
          "Xiaomi Pad SE",
          "Mi Pad (legacy)",
          "Redmi Pad",
          "Redmi Pad SE",
          "Redmi Pad Pro",
        ],
      },
      {
        key: "OnePlus",
        name: "OnePlus",
        tagline: "OnePlus Pad, Pad 2 & Pad Go",
        logo: logoOneplus,
        series: [
          "OnePlus Pad",
          "OnePlus Pad Go",
          "OnePlus Pad Pro",
          "OnePlus Pad 2",
          "OnePlus Pad Lite",
        ],
      },
      {
        key: "Realme",
        name: "realme",
        tagline: "realme Pad 2, X & Mini",
        wordmark: {
          text: "realme",
          className: "bg-[#FFC915] text-black font-extrabold px-2.5 py-0.5 rounded-md",
        },
      },
      {
        key: "Oppo",
        name: "Oppo",
        tagline: "Oppo Pad 2 & Pad Air",
        logo: logoOppo,
        wide: true,
        series: [
          "OPPO Pad",
          "OPPO Pad Air",
          "OPPO Pad Neo",
          "OPPO Pad 2",
          "OPPO Pad 3 / Pro (market-dependent)",
        ],
      },
      {
        key: "Vivo",
        name: "Vivo",
        tagline: "Vivo Pad 3 Pro, Pad 2 & Air",
        logo: logoVivo,
        wide: true,
        series: [
          "vivo Pad",
          "vivo Pad Air",
          "vivo Pad 2",
          "vivo Pad 3",
          "vivo Pad 3 Pro",
          "iQOO Pad",
          "iQOO Pad Air",
        ],
      },
      {
        key: "Honor",
        name: "Honor",
        tagline: "Honor Pad 9 & Pad X series",
        logo: logoHonor,
        wide: true,
        series: [
          "HONOR Pad",
          "HONOR Pad X",
          "HONOR Pad V",
          "HONOR Pad GT",
          "HONOR MagicPad",
          "MediaPad legacy (Huawei-era)",
        ],
      },
      {
        key: "Huawei",
        name: "Huawei",
        tagline: "MatePad Pro, 11.5 & SE",
        logo: logoHuawei,
        series: [
          "MatePad",
          "MatePad Pro",
          "MatePad Air",
          "MatePad SE",
          "MatePad Paper (e-ink)",
          "MediaPad M (legacy)",
          "MediaPad T (legacy)",
        ],
      },
      {
        key: "Microsoft",
        name: "Microsoft Surface",
        tagline: "Surface Pro & Surface Go",
        logo: logoMicrosoft,
        series: [
          "Surface Pro",
          "Surface Go",
          "Surface Pro X (legacy branding)",
          "Surface 3 (legacy)",
          "Surface RT / 2 (legacy)",
        ],
      },
      {
        key: "Nokia",
        name: "Nokia",
        tagline: "Nokia T21, T20 & T10",
        logo: logoNokia,
        wide: true,
        series: ["Nokia T Series", "N1 (legacy)", "Lumia 2520 (legacy Windows tablet)"],
      },
      {
        key: "Amazon",
        name: "Amazon",
        tagline: "Fire Max 11 & Fire HD",
        logo: logoAmazon,
        series: [
          "Fire HD 8",
          "Fire HD 10",
          "Fire Max 11",
          "Fire 7 (legacy / availability varies)",
          "Kindle Fire (legacy name)",
          "Fire Kids",
          "Fire Kids Pro",
        ],
      },
      {
        key: "Google",
        name: "Google Pixel",
        tagline: "Pixel Tablet, Nexus & Pixel C",
        logo: logoGoogle,
        wide: true,
        series: [
          "Pixel Tablet",
          "Nexus 7 (legacy)",
          "Nexus 9 (legacy)",
          "Pixel Slate (ChromeOS legacy)",
          "Pixel C (legacy)",
        ],
      },
      {
        key: "Asus",
        name: "Asus",
        tagline: "ZenPad, Transformer & ROG Flow Z13",
        logo: logoAsus,
        wide: true,
        series: [
          "ZenPad (legacy)",
          "Transformer Pad (legacy)",
          "Transformer Mini (legacy)",
          "ROG Flow Z13 (Windows tablet/laptop hybrid)",
          "VivoTab (legacy)",
          "MeMO Pad (legacy)",
        ],
      },
      {
        key: "Acer",
        name: "Acer",
        tagline: "Iconia, Switch & Enduro",
        logo: logoAcer,
        wide: true,
        series: [
          "Iconia Tab",
          "Iconia One (legacy)",
          "Iconia A (legacy)",
          "Switch (Windows 2-in-1)",
          "Enduro Urban T (rugged)",
          "Predator 8 (legacy gaming)",
        ],
      },
      {
        key: "TCL",
        name: "TCL",
        tagline: "TAB & NXTPAPER",
        wordmark: {
          text: "TCL",
          className: "font-black text-[#E4002B] tracking-wide",
        },
        series: [
          "TAB",
          "TAB 10",
          "TAB 11",
          "TAB 12",
          "NXTPAPER tablets",
          "MOVE / Alcatel tablet lines (legacy / related)",
        ],
      },
      {
        key: "Blackview",
        name: "Blackview",
        tagline: "Tab, Active & Mega",
        wordmark: {
          text: "Blackview",
          className: "font-extrabold text-slate-900 tracking-tight",
        },
        series: ["Tab Series", "Active Tab (rugged)", "Mega Tab", "Oscal Pad (related brand)"],
      },
      {
        key: "Ulefone",
        name: "Ulefone",
        tagline: "Armor Pad & Tab",
        wordmark: {
          text: "Ulefone",
          className: "font-extrabold text-[#F15A22] tracking-tight",
        },
        series: ["Armor Pad", "Armor Pad Pro", "Tab Series (regional naming)"],
      },
      {
        key: "Doogee",
        name: "DOOGEE",
        tagline: "T, U & rugged tablets",
        wordmark: {
          text: "DOOGEE",
          className: "font-black text-slate-900 tracking-wide",
        },
        series: [
          "T Series",
          "U Series",
          "Rugged tablet families",
          "Anywise (select regional products)",
        ],
      },
    ],
  },
  smartwatch: {
    path: "/sell-smartwatch",
    noun: "smartwatch",
    crumb: "Sell Smartwatch",
    icon: "fa-clock",
    searchHint: "e.g. Apple Watch",
    brands: [
      {
        key: "Apple",
        name: "Apple",
        tagline: "Apple Watch Ultra, Series & SE",
        logo: logoApple,
      },
      {
        key: "Samsung",
        name: "Samsung",
        tagline: "Galaxy Watch Ultra, 7, 6 & FE",
        logo: logoSamsung,
        wide: true,
      },
      {
        key: "OnePlus",
        name: "OnePlus",
        tagline: "OnePlus Watch 2, 2R & Nord",
        logo: logoOneplus,
      },
      {
        key: "Xiaomi",
        name: "Xiaomi",
        tagline: "Xiaomi Watch & Smart Band",
        logo: logoXiaomi,
      },
      {
        key: "Redmi",
        name: "Redmi",
        tagline: "Redmi Watch & Smart Band",
        wordmark: {
          text: "Redmi",
          className: "text-[#E1251B] font-bold tracking-tight",
        },
      },
      {
        key: "Huawei",
        name: "Huawei",
        tagline: "Watch GT, Watch Fit & Band",
        logo: logoHuawei,
      },
      {
        key: "FireBoltt",
        name: "Fire-Boltt",
        tagline: "Invincible, Phoenix & Ninja",
        wordmark: {
          text: "FIRE-BOLTT",
          className: "text-[#E4202A] font-black italic tracking-tight",
        },
      },
      {
        key: "Fastrack",
        name: "Fastrack",
        tagline: "Limitless, Optimus & Revoltt",
        wordmark: {
          text: "fastrack",
          className: "bg-black text-white font-black italic lowercase px-2.5 py-0.5 rounded-md",
        },
      },
      {
        key: "Titan",
        name: "Titan",
        tagline: "Celestor, Crest & Talk",
        wordmark: {
          text: "TITAN",
          className: "text-[#7A5C2E] font-serif font-semibold tracking-[0.25em]",
        },
      },
      {
        key: "Google",
        name: "Google Pixel Watch",
        tagline: "Pixel Watch 3, 2 & 1",
        logo: logoGoogle,
        wide: true,
      },
      {
        key: "Fitbit",
        name: "Fitbit",
        tagline: "Sense, Versa, Charge & Inspire",
        logo: logoFitbit,
      },
      {
        key: "Garmin",
        name: "Garmin",
        tagline: "Fenix, Epix, Forerunner & Venu",
        logo: logoGarmin,
        wide: true,
      },
      {
        key: "Amazfit",
        name: "Amazfit",
        tagline: "T-Rex, Balance, GTR & Bip",
        wordmark: {
          text: "AMAZFIT",
          className: "text-black font-extrabold tracking-[0.12em]",
        },
      },
      {
        key: "boAt",
        name: "boAt",
        tagline: "Lunar, Wave & Storm",
        logo: logoBoat,
      },
      {
        key: "Noise",
        name: "Noise",
        tagline: "NoiseFit Halo & ColorFit",
        wordmark: {
          text: "noise",
          className: "text-black font-black lowercase tracking-tight",
        },
      },
    ],
  },
  earbuds: {
    path: "/sell-earbuds",
    noun: "earbuds",
    crumb: "Sell Earbuds",
    icon: "fa-headphones",
    searchHint: "e.g. AirPods Pro",
    brands: [
      {
        key: "Apple",
        name: "Apple",
        tagline: "AirPods Pro, AirPods & Max",
        logo: logoApple,
      },
      {
        key: "Samsung",
        name: "Samsung",
        tagline: "Galaxy Buds 3 Pro, 2 Pro & FE",
        logo: logoSamsung,
        wide: true,
      },
      {
        key: "Sony",
        name: "Sony",
        tagline: "WF-1000XM, WH-1000XM & WF-C",
        logo: logoSony,
        wide: true,
      },
      {
        key: "OnePlus",
        name: "OnePlus",
        tagline: "Buds Pro & Nord Buds",
        logo: logoOneplus,
      },
      {
        key: "JBL",
        name: "JBL",
        tagline: "Tour, Live & Wave",
        logo: logoJbl,
        wide: true,
      },
      {
        key: "Bose",
        name: "Bose",
        tagline: "QuietComfort Ultra & Earbuds II",
        logo: logoBose,
        wide: true,
      },
      {
        key: "Sennheiser",
        name: "Sennheiser",
        tagline: "Momentum & Accentum",
        logo: logoSennheiser,
      },
      {
        key: "Nothing",
        name: "Nothing",
        tagline: "Ear, Ear (2) & Ear (a)",
        wordmark: {
          text: "NOTHING",
          className: "font-mono font-bold tracking-[0.2em] text-black",
        },
      },
      {
        key: "CMF",
        name: "CMF by Nothing",
        tagline: "CMF Buds Pro 2, Buds & Neckband",
        wordmark: {
          text: "CMF",
          className:
            "bg-[#FF5A00] text-black font-mono font-black tracking-widest px-2.5 py-0.5 rounded-md",
        },
      },
      {
        key: "Xiaomi",
        name: "Xiaomi",
        tagline: "Xiaomi Buds 5 Pro & 4 Pro",
        logo: logoXiaomi,
      },
      {
        key: "Redmi",
        name: "Redmi",
        tagline: "Redmi Buds 6 Pro, 5 Pro & 5",
        wordmark: {
          text: "Redmi",
          className: "text-[#E1251B] font-bold tracking-tight",
        },
      },
      {
        key: "Realme",
        name: "realme",
        tagline: "Buds Air 6 Pro, Air 6 & T300",
        wordmark: {
          text: "realme",
          className: "bg-[#FFC915] text-black font-extrabold px-2.5 py-0.5 rounded-md",
        },
      },
      {
        key: "Oppo",
        name: "Oppo",
        tagline: "Enco X2, Air 4 Pro & Buds 2",
        logo: logoOppo,
        wide: true,
      },
      {
        key: "Vivo",
        name: "Vivo",
        tagline: "Vivo TWS 3 Pro & Air 2",
        logo: logoVivo,
        wide: true,
      },
      {
        key: "Soundcore",
        name: "Anker Soundcore",
        tagline: "Liberty, Space, Life & R series",
        wordmark: {
          text: "soundcore",
          className: "text-[#00A7E1] font-bold tracking-tight",
        },
      },
      {
        key: "Skullcandy",
        name: "Skullcandy",
        tagline: "Crusher, Rail & Dime",
        wordmark: {
          text: "Skullcandy",
          className: "text-black font-black tracking-tight",
        },
      },
      {
        key: "FireBoltt",
        name: "Fire-Boltt",
        tagline: "Fire Pods Atlas & Ninja",
        wordmark: {
          text: "FIRE-BOLTT",
          className: "text-[#E4202A] font-black italic tracking-tight",
        },
      },
      {
        key: "Noise",
        name: "Noise",
        tagline: "Master Buds, Buds N1 & Two",
        wordmark: {
          text: "noise",
          className: "text-black font-black lowercase tracking-tight",
        },
      },
      {
        key: "boAt",
        name: "boAt",
        tagline: "Nirvana, Airdopes & Rockerz",
        logo: logoBoat,
      },
    ],
  },
  console: {
    path: "/sell-console",
    noun: "console",
    crumb: "Sell Console",
    icon: "fa-gamepad",
    searchHint: "e.g. PS5 or Switch",
    brands: [
      {
        key: "PlayStation",
        name: "PlayStation",
        tagline: "PS5 Pro, PS5, PS4 & Portal",
        logo: logoPlaystation,
      },
      {
        key: "Xbox",
        name: "Xbox",
        tagline: "Series X, Series S & One X",
        wordmark: {
          text: "XBOX",
          icon: "fa-brands fa-xbox",
          className: "text-[#107C10] font-black tracking-[0.15em]",
        },
      },
      {
        key: "Nintendo",
        name: "Nintendo",
        tagline: "Switch OLED, Switch & Lite",
        logo: logoNintendo,
        wide: true,
      },
      {
        key: "SteamDeck",
        name: "Steam Deck",
        tagline: "Steam Deck OLED & LCD",
        logo: logoSteamdeck,
      },
      {
        key: "ROGAlly",
        name: "ASUS ROG Ally",
        tagline: "ROG Ally X, Z1 Extreme & Z1",
        logo: logoRogally,
      },
      {
        key: "LegionGo",
        name: "Lenovo Legion Go",
        tagline: "Legion Go 1TB & 512GB",
        wordmark: {
          text: "LEGION GO",
          className: "text-black font-black italic tracking-[0.08em]",
        },
      },
      {
        key: "MSIClaw",
        name: "MSI Claw",
        tagline: "Claw 8 AI+ & Claw A1M",
        logo: logoMsi,
      },
      {
        key: "Atari",
        name: "Atari",
        tagline: "Atari VCS & 2600+",
        logo: logoAtari,
      },
      {
        key: "Sega",
        name: "Sega",
        tagline: "Genesis Mini, Mega Drive & Game Gear",
        logo: logoSega,
      },
    ],
  },
  camera: {
    path: "/sell-camera",
    noun: "camera",
    crumb: "Sell Camera",
    icon: "fa-camera",
    searchHint: "e.g. EOS R6 or GoPro",
    brands: [
      {
        key: "Canon",
        name: "Canon",
        tagline: "EOS R mirrorless & EOS DSLR",
        wordmark: {
          text: "Canon",
          className: "text-[#CC0000] font-black italic tracking-tight",
        },
      },
      {
        key: "Sony",
        name: "Sony",
        tagline: "Alpha, ZV & Cyber-shot",
        logo: logoSony,
        wide: true,
      },
      {
        key: "Nikon",
        name: "Nikon",
        tagline: "Z mirrorless & D-series DSLR",
        logo: logoNikon,
        wide: true,
      },
      {
        key: "Fujifilm",
        name: "Fujifilm",
        tagline: "X-H, X-T, X100 & Instax",
        logo: logoFujifilm,
        wide: true,
      },
      {
        key: "Panasonic",
        name: "Panasonic Lumix",
        tagline: "Lumix S, GH & G series",
        logo: logoPanasonic,
        wide: true,
      },
      {
        key: "GoPro",
        name: "GoPro",
        tagline: "Hero 13, 12, 11 & Max",
        wordmark: {
          text: "GoPro",
          className: "text-black font-black tracking-tight",
        },
      },
      {
        key: "OMSystem",
        name: "OM System",
        tagline: "OM-1, OM-5 & Olympus OM-D",
        wordmark: {
          text: "OM SYSTEM",
          className: "text-black font-semibold tracking-[0.12em]",
        },
      },
      {
        key: "Leica",
        name: "Leica",
        tagline: "M11, Q3, SL2 & D-Lux",
        logo: logoLeica,
      },
      {
        key: "Hasselblad",
        name: "Hasselblad",
        tagline: "X2D, 907X & X1D",
        wordmark: {
          text: "HASSELBLAD",
          className: "text-black font-light tracking-[0.18em]",
        },
      },
      {
        key: "DJI",
        name: "DJI",
        tagline: "Osmo Pocket, Action, 360 & Ronin",
        logo: logoDji,
      },
      {
        key: "Kodak",
        name: "Kodak",
        tagline: "PixPro & Smile instant",
        logo: logoKodak,
      },
      {
        key: "Insta360",
        name: "Insta360",
        tagline: "X4, Ace Pro & GO",
        logo: logoInsta360,
      },
      {
        key: "Polaroid",
        name: "Polaroid",
        tagline: "I-2, Now+ & Go",
        wordmark: {
          text: "Polaroid",
          className: "text-black font-bold tracking-tight",
        },
      },
      {
        key: "Blackmagic",
        name: "Blackmagic Design",
        tagline: "Pocket Cinema & Cinema Camera",
        wordmark: {
          text: "Blackmagic",
          className: "text-black font-semibold tracking-tight",
        },
      },
    ],
  },
};

for (const t of sellBrandCatalog.phone.brands) {
  if (phoneCatalog.series[t.key]) {
    t.series = phoneCatalog.series[t.key];
  }
}

export const getSellConfig = (t) => sellBrandCatalog[t];

export const findSellBrand = (t, e) =>
  sellBrandCatalog[t].brands.find((brand) =>
    [brand.key, brand.name].some((item) => item.toLowerCase() === String(e).trim().toLowerCase()),
  );

export function resolveSellBrand(t, e, s) {
  if (e !== OTHER) {
    return findSellBrand(t, e);
  }
  const name2 = (s.get("brand") || "").trim();
  if (!name2) {
    return null;
  }
  const a = findSellBrand(t, name2);
  return (
    a || {
      key:
        Object.keys(deviceCatalog[t].models).find(
          (item) => item.toLowerCase() === name2.toLowerCase(),
        ) || name2,
      name: name2,
      custom: true,
      tagline: "",
      wordmark: {
        text: name2,
        className: "font-extrabold text-slate-900 tracking-tight",
      },
    }
  );
}

export const modelsFor = (t, e) => deviceCatalog[t].models[e] || [];

const parseGeneration = (t) => {
  const e = t.replace(/\s*\(.*?\)/g, "").match(/^(.*?)\s*(\d+)/);
  return (
    e && {
      family: e[1].toLowerCase(),
      gen: Number(e[2]),
    }
  );
};

export function sortByGeneration(t) {
  const e = t[0] && parseGeneration(t[0].name)?.family;
  if (!e) {
    return t;
  }
  const s = new Set();
  const n = new Set();
  for (const u of t) {
    const m = u.series || "";
    if (!n.has(m)) {
      n.add(m);
      if (parseGeneration(u.name)?.family === e) {
        s.add(m);
      }
    }
  }
  const a = [
    ...new Set(
      t
        .filter((item) => s.has(item.series || ""))
        .map((item) => parseGeneration(item.name))
        .filter((item) => item?.family === e)
        .map((item) => item.gen),
    ),
  ].sort((u, m) => m - u);
  const r = {};
  const o = t.map((item) => {
    const m = item.series || "";
    if (!s.has(m)) {
      return Infinity;
    }
    const p = parseGeneration(item.name);
    return (r[m] = p?.family === e ? a.indexOf(p.gen) : (r[m] ?? 0));
  });
  return t
    .map((item, index) => [item, o[index], index])
    .sort((u, m) => u[1] - m[1] || u[2] - m[2])
    .map(([u]) => u);
}

export const brandName = (t, e) => {
  return sellBrandCatalog[t]?.brands.find((a) => a.key === e)?.name || e;
};

const sellBrandPath = (t, e) =>
  `${sellBrandCatalog[t].path}/${e.custom ? OTHER : e.key.toLowerCase()}`;

const brandQuery = (t) =>
  t.custom
    ? `?${new URLSearchParams({
        brand: t.name,
      })}`
    : "";

export const sellBrandUrl = (t, e) => `${sellBrandPath(t, e)}${brandQuery(e)}`;

export const customBrandUrl = (t, e) =>
  sellBrandUrl(t, {
    custom: true,
    name: e.trim(),
  });

export const sellModelUrl = (t, e, s) => `${sellBrandPath(t, e)}/${slugify(s)}${brandQuery(e)}`;

export const customModelUrl = (t, e, s) =>
  `${sellBrandPath(t, e)}/${OTHER}?${new URLSearchParams({
    ...(e.custom && {
      brand: e.name,
    }),
    model: s.trim(),
  })}`;

export const findModelBySlug = (t, e, s) =>
  modelsFor(t, e).find((item) => slugify(item.name) === s);

export const OTHER = "other";

const stripParens = (t) => t.replace(/\s*\(.*\)$/, "");

export const seriesSlug = (t) => slugify(stripParens(t));

const matchesSeries = (t, e, { name: name2, series }) => {
  if (series) {
    return series === e;
  }
  const a = name2.toLowerCase().startsWith(`${t.name.toLowerCase()} `)
    ? name2.slice(t.name.length + 1)
    : name2;
  const r = stripParens(e).toLowerCase();
  return a.toLowerCase().startsWith(r) && /^(\d|\s|$)/.test(a.slice(r.length));
};

export function modelsInSeries(t, e, s) {
  const n = modelsFor(t, e.key);
  if (s === OTHER) {
    return n.filter((item) => !e.series.some((sery) => matchesSeries(e, sery, item)));
  }
  const a = e.series.find((sery) => seriesSlug(sery) === s);
  if (a) {
    return n.filter((item) => matchesSeries(e, a, item));
  } else {
    return null;
  }
}

export const sellSeriesUrl = (t, e, s) =>
  `${sellBrandPath(t, e)}?${new URLSearchParams({
    series: s,
  })}`;

export const sellCategoryPath = (t) => {
  return sellBrandCatalog[t]?.path || `/sell?cat=${t}`;
};
