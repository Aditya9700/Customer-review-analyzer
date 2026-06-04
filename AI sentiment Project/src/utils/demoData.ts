import { ReviewData } from '../types';

export const demoReviews: ReviewData[] = [
  // Battery Reviews
  {
    id: "demo-1",
    productName: "ApexFit Smartwatch V2",
    reviewText: "The battery life on the ApexFit V2 is stellar! I've been wearing it for a full week, including sleep tracking, and it still has 35% battery left. Fast charging gets me from 10% to full in under 45 minutes.",
    sentiment: "Positive",
    category: "Battery",
    confidenceScore: 0.98,
    date: "2026-06-15"
  },
  {
    id: "demo-2",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "Disappointed with the active playtime. The specs claim 8 hours, but with ANC enabled, the right earbud dies in just under 4 hours. The charging case doesn't hold as many charges as advertised either.",
    sentiment: "Negative",
    category: "Battery",
    confidenceScore: 0.92,
    date: "2026-06-12"
  },
  {
    id: "demo-3",
    productName: "BassDrop Wireless Speaker",
    reviewText: "Battery is average. Lasts about 10 hours at medium volume. Takes about 3 hours to charge fully via USB-C. Nothing special, but handles a day at the beach just fine.",
    sentiment: "Neutral",
    category: "Battery",
    confidenceScore: 0.88,
    date: "2026-06-10"
  },
  {
    id: "demo-4",
    productName: "Horizon OLED Smartwatch",
    reviewText: "Only gets about 1.5 days of battery because of the always-on display. I knew this going in, but it is still annoying to charge it almost every night compared to my previous band.",
    sentiment: "Negative",
    category: "Battery",
    confidenceScore: 0.79,
    date: "2026-05-28"
  },
  {
    id: "demo-5",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "The case charges quickly and the earbuds last all day for my zoom calls. Very convenient wireless charging compatibility as well.",
    sentiment: "Positive",
    category: "Battery",
    confidenceScore: 0.95,
    date: "2026-05-20"
  },
  
  // Connectivity Reviews
  {
    id: "demo-6",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "Constant audio dropouts when walking through busy downtown intersections. It seems like the Bluetooth antenna has interference issues when my phone is in my back pocket. Very frustrating for high-end earbuds.",
    sentiment: "Negative",
    category: "Connectivity",
    confidenceScore: 0.96,
    date: "2026-06-19"
  },
  {
    id: "demo-7",
    productName: "BassDrop Wireless Speaker",
    reviewText: "Pairs instantly with my iPhone and Macbook. I can walk across the house into the kitchen (about 40 feet away with walls in between) and the music plays without a single stutter. Multipoint bluetooth is a game changer.",
    sentiment: "Positive",
    category: "Connectivity",
    confidenceScore: 0.99,
    date: "2026-06-14"
  },
  {
    id: "demo-8",
    productName: "ApexFit Smartwatch V2",
    reviewText: "Syncing reviews with the companion app is a bit slow. It takes about 2 minutes to transfer my workout log from the morning. Once connected, it stays paired, but the sync rate could definitely be optimized.",
    sentiment: "Neutral",
    category: "Connectivity",
    confidenceScore: 0.81,
    date: "2026-06-08"
  },
  {
    id: "demo-9",
    productName: "Horizon OLED Smartwatch",
    reviewText: "Bluetooth disconnected during my run and didn't log my GPS path properly. This has happened three times this week. I might have to return this watch if a software update doesn't fix it.",
    sentiment: "Negative",
    category: "Connectivity",
    confidenceScore: 0.94,
    date: "2026-05-29"
  },
  {
    id: "demo-10",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "Setup was simple enough. It popped up automatically on my Android phone for quick pairing. The companion app requested too many permissions, but the basic Bluetooth connection works fine.",
    sentiment: "Neutral",
    category: "Connectivity",
    confidenceScore: 0.85,
    date: "2026-05-15"
  },

  // Audio Reviews
  {
    id: "demo-11",
    productName: "BassDrop Wireless Speaker",
    reviewText: "Wow, the sound stage on this small speaker is incredible! Deep, punchy bass that doesn't muddy the mid-range. Vocals are crisp even at maximum volume. It easily fills a large living room.",
    sentiment: "Positive",
    category: "Audio",
    confidenceScore: 0.99,
    date: "2026-06-18"
  },
  {
    id: "demo-12",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "The active noise cancellation is top-tier. It blocks out the low hum of airplane engines and office chatter completely. Sound quality is rich with a very balanced frequency response out of the box.",
    sentiment: "Positive",
    category: "Audio",
    confidenceScore: 0.97,
    date: "2026-06-16"
  },
  {
    id: "demo-13",
    productName: "Horizon OLED Smartwatch",
    reviewText: "The speaker on this watch for taking phone calls is tinny and quiet. I can barely hear the other person if there is any ambient traffic noise outside. The microphone is okay, but audio output is disappointing.",
    sentiment: "Negative",
    category: "Audio",
    confidenceScore: 0.91,
    date: "2026-06-05"
  },
  {
    id: "demo-14",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "There's a subtle background hiss in the left earbud whenever audio is paused. It goes away when music starts playing, but if you like to wear earbuds just for silence, it becomes noticeable and annoying.",
    sentiment: "Negative",
    category: "Audio",
    confidenceScore: 0.86,
    date: "2026-05-25"
  },
  {
    id: "demo-15",
    productName: "BassDrop Wireless Speaker",
    reviewText: "Sound quality is decent. It lacks a bit of sub-bass, but the treble is clear. You can adjust the EQ in the app which helps balance things out a bit, but don't expect audiophile level precision.",
    sentiment: "Neutral",
    category: "Audio",
    confidenceScore: 0.89,
    date: "2026-05-12"
  },

  // Display Reviews
  {
    id: "demo-16",
    productName: "Horizon OLED Smartwatch",
    reviewText: "This OLED screen is gorgeous! The blacks are perfectly deep, and the colors pop. It gets bright enough to read clearly under direct sunlight, which my old watch could never do.",
    sentiment: "Positive",
    category: "Display",
    confidenceScore: 0.98,
    date: "2026-06-17"
  },
  {
    id: "demo-17",
    productName: "ApexFit Smartwatch V2",
    reviewText: "The screen is a bit reflective and washes out outdoors. The auto-brightness sensor is also slow to respond, often staying dim for 5-10 seconds after I wake the screen in a bright room.",
    sentiment: "Negative",
    category: "Display",
    confidenceScore: 0.88,
    date: "2026-06-11"
  },
  {
    id: "demo-18",
    productName: "Horizon OLED Smartwatch",
    reviewText: "The display is fine, but the touch response around the curved edges is a bit hit-or-miss. Sometimes I have to swipe twice to pull down the quick settings menu.",
    sentiment: "Neutral",
    category: "Display",
    confidenceScore: 0.84,
    date: "2026-06-02"
  },
  {
    id: "demo-19",
    productName: "ApexFit Smartwatch V2",
    reviewText: "Very crisp font rendering. The interface animations look incredibly smooth at 60Hz. Makes navigating the menus feel premium.",
    sentiment: "Positive",
    category: "Display",
    confidenceScore: 0.94,
    date: "2026-05-18"
  },
  {
    id: "demo-20",
    productName: "Horizon OLED Smartwatch",
    reviewText: "The colors are nice but the screen scratched on day two. I didn't drop it or scrape it against anything metal, so the glass coating might not be as durable as claimed.",
    sentiment: "Negative",
    category: "Display",
    confidenceScore: 0.87,
    date: "2026-05-05"
  },

  // Delivery Reviews
  {
    id: "demo-21",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "Ordered on Monday, arrived on Tuesday morning! The packaging was pristine, with thick bubble wrap protecting the retail box. Outstanding shipping speed.",
    sentiment: "Positive",
    category: "Delivery",
    confidenceScore: 0.99,
    date: "2026-06-20"
  },
  {
    id: "demo-22",
    productName: "BassDrop Wireless Speaker",
    reviewText: "Package was delayed by 4 days with no tracking updates. When it finally arrived, the shipping box was heavily crushed. Luckily the speaker inside was undamaged, but the shipping experience was stressful.",
    sentiment: "Negative",
    category: "Delivery",
    confidenceScore: 0.95,
    date: "2026-06-13"
  },
  {
    id: "demo-23",
    productName: "ApexFit Smartwatch V2",
    reviewText: "Arrived within the estimated delivery window of 3-5 days. The package tracking link worked. Standard delivery, no issues but nothing exceptional.",
    sentiment: "Neutral",
    category: "Delivery",
    confidenceScore: 0.90,
    date: "2026-06-07"
  },
  {
    id: "demo-24",
    productName: "Horizon OLED Smartwatch",
    reviewText: "The courier left the package on the curb in the rain instead of on the covered porch. The cardboard box was soaked through. Very irresponsible delivery driver.",
    sentiment: "Negative",
    category: "Delivery",
    confidenceScore: 0.93,
    date: "2026-05-30"
  },
  {
    id: "demo-25",
    productName: "BassDrop Wireless Speaker",
    reviewText: "Super fast shipping, got it just in time for the weekend party. Appreciate the email alerts at every step of the shipping process.",
    sentiment: "Positive",
    category: "Delivery",
    confidenceScore: 0.96,
    date: "2026-05-22"
  },

  // Additional reviews to make it dense and realistic (75 more reviews, varied dates)
  {
    id: "demo-26",
    productName: "ApexFit Smartwatch V2",
    reviewText: "The sleep tracking feature on this watch is spot on. Helps me monitor my sleep phases. The battery barely drops 4% overnight.",
    sentiment: "Positive",
    category: "Battery",
    confidenceScore: 0.95,
    date: "2026-06-15"
  },
  {
    id: "demo-27",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "Sound quality is stellar but pairing is a headache. I have to turn my phone's Bluetooth off and on again to get it to connect half the time.",
    sentiment: "Negative",
    category: "Connectivity",
    confidenceScore: 0.89,
    date: "2026-06-14"
  },
  {
    id: "demo-28",
    productName: "BassDrop Wireless Speaker",
    reviewText: "The build quality feels solid. It has a nice rubberized grip and the buttons have a satisfying click. Sound is clean but lacks stereo separation.",
    sentiment: "Neutral",
    category: "Audio",
    confidenceScore: 0.83,
    date: "2026-06-14"
  },
  {
    id: "demo-29",
    productName: "Horizon OLED Smartwatch",
    reviewText: "The screen is bright, but the auto-brightness is way too sensitive. It fluctuates constantly when I'm sitting near a window. I ended up setting it manually.",
    sentiment: "Neutral",
    category: "Display",
    confidenceScore: 0.86,
    date: "2026-06-13"
  },
  {
    id: "demo-30",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "Shipping took almost two weeks to arrive. The seller used a budget carrier and there was no tracking details available for the first 9 days.",
    sentiment: "Negative",
    category: "Delivery",
    confidenceScore: 0.91,
    date: "2026-06-13"
  },
  {
    id: "demo-31",
    productName: "ApexFit Smartwatch V2",
    reviewText: "Battery dies within 12 hours if GPS tracking is active. This is useless for ultramarathons or day-long hikes. Charging is fast but doesn't make up for it.",
    sentiment: "Negative",
    category: "Battery",
    confidenceScore: 0.97,
    date: "2026-06-11"
  },
  {
    id: "demo-32",
    productName: "BassDrop Wireless Speaker",
    reviewText: "The bluetooth range is incredible. I can leave my phone in the house and take the speaker to the backyard pool (around 60 feet) without audio drops.",
    sentiment: "Positive",
    category: "Connectivity",
    confidenceScore: 0.98,
    date: "2026-06-10"
  },
  {
    id: "demo-33",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "Audio has a beautiful depth. Vocal tracks sound like the artist is in the room. The treble is bright without being harsh. Strongly recommend for jazz listeners.",
    sentiment: "Positive",
    category: "Audio",
    confidenceScore: 0.99,
    date: "2026-06-09"
  },
  {
    id: "demo-34",
    productName: "Horizon OLED Smartwatch",
    reviewText: "The screen is great, very easy to read my notifications. However, the scratch resistance is poor. I already have two hairline scratches on the glass.",
    sentiment: "Negative",
    category: "Display",
    confidenceScore: 0.92,
    date: "2026-06-09"
  },
  {
    id: "demo-35",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "Delivered next day, even without a premium membership. The packing slip was included, box was intact. Perfect.",
    sentiment: "Positive",
    category: "Delivery",
    confidenceScore: 0.97,
    date: "2026-06-08"
  },
  {
    id: "demo-36",
    productName: "ApexFit Smartwatch V2",
    reviewText: "I only charge this watch twice a month. It is incredible. I keep notifications on and track 3 workouts a week. A battery beast.",
    sentiment: "Positive",
    category: "Battery",
    confidenceScore: 0.99,
    date: "2026-06-05"
  },
  {
    id: "demo-37",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "The connection drops randomly for 2 seconds. Happens once or twice an hour. Not a dealbreaker, but annoying for this price range.",
    sentiment: "Neutral",
    category: "Connectivity",
    confidenceScore: 0.78,
    date: "2026-06-04"
  },
  {
    id: "demo-38",
    productName: "BassDrop Wireless Speaker",
    reviewText: "Audio quality is muddy at higher volumes. The bass distorts the mid-range terribly if you turn it past 70%. Good for audiobooks, bad for rock music.",
    sentiment: "Negative",
    category: "Audio",
    confidenceScore: 0.94,
    date: "2026-06-03"
  },
  {
    id: "demo-39",
    productName: "Horizon OLED Smartwatch",
    reviewText: "OLED display looks amazing in the dark. The ambient watch faces are elegant. Touch accuracy is decent but there's a slight swipe lag.",
    sentiment: "Positive",
    category: "Display",
    confidenceScore: 0.91,
    date: "2026-06-01"
  },
  {
    id: "demo-40",
    productName: "ApexFit Smartwatch V2",
    reviewText: "Box arrived crushed, look like someone stepped on it. Luckily the watch has a metal bezel and survived. Courier needs to be more careful.",
    sentiment: "Negative",
    category: "Delivery",
    confidenceScore: 0.89,
    date: "2026-05-28"
  },
  {
    id: "demo-41",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "Charging case is solid. Magnetic snap feels premium. It gives an extra 24 hours of charge. The LED indicator tells you exactly how much juice is left.",
    sentiment: "Positive",
    category: "Battery",
    confidenceScore: 0.96,
    date: "2026-05-26"
  },
  {
    id: "demo-42",
    productName: "BassDrop Wireless Speaker",
    reviewText: "Struggles to connect to Windows laptops. Works instantly with my phone, but Windows keeps throwing driver errors. Had to use an aux cable.",
    sentiment: "Negative",
    category: "Connectivity",
    confidenceScore: 0.95,
    date: "2026-05-25"
  },
  {
    id: "demo-43",
    productName: "Horizon OLED Smartwatch",
    reviewText: "Sound volume from speaker is fine for notifications, but calls are barely audible. It's okay, but don't expect to hold long conversations.",
    sentiment: "Neutral",
    category: "Audio",
    confidenceScore: 0.84,
    date: "2026-05-24"
  },
  {
    id: "demo-44",
    productName: "ApexFit Smartwatch V2",
    reviewText: "The screen has a low resolution compared to newer smartwatches. You can see the pixels on the text if you look closely. It's readable, but feels dated.",
    sentiment: "Negative",
    category: "Display",
    confidenceScore: 0.88,
    date: "2026-05-23"
  },
  {
    id: "demo-45",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "Shipping took 6 days instead of 2. There was a holiday in the middle, but customer service was not helpful in providing updates.",
    sentiment: "Negative",
    category: "Delivery",
    confidenceScore: 0.85,
    date: "2026-05-20"
  },
  {
    id: "demo-46",
    productName: "Horizon OLED Smartwatch",
    reviewText: "Battery runs down fast if you enable heart rate alerts and breathing metrics. I have to disable features to make it last through the weekend.",
    sentiment: "Negative",
    category: "Battery",
    confidenceScore: 0.91,
    date: "2026-05-17"
  },
  {
    id: "demo-47",
    productName: "ApexFit Smartwatch V2",
    reviewText: "Quick pairing works. The companion app connects fine. Updating the firmware took about 20 minutes though, which felt like forever.",
    sentiment: "Neutral",
    category: "Connectivity",
    confidenceScore: 0.82,
    date: "2026-05-15"
  },
  {
    id: "demo-48",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "The bass is incredibly deep! Playing electronic music sounds awesome. Noise isolation is great even without turning ANC on.",
    sentiment: "Positive",
    category: "Audio",
    confidenceScore: 0.98,
    date: "2026-05-14"
  },
  {
    id: "demo-49",
    productName: "Horizon OLED Smartwatch",
    reviewText: "The screen colors are super vivid. The touch response is instantaneous. Tapping feels responsive and fast.",
    sentiment: "Positive",
    category: "Display",
    confidenceScore: 0.97,
    date: "2026-05-12"
  },
  {
    id: "demo-50",
    productName: "BassDrop Wireless Speaker",
    reviewText: "Delivery was delayed by custom clearance issues. When it got here, the product packaging was sealed and secure. Okay experience overall.",
    sentiment: "Neutral",
    category: "Delivery",
    confidenceScore: 0.80,
    date: "2026-05-10"
  },

  // Month of May / April Reviews
  {
    id: "demo-51",
    productName: "ApexFit Smartwatch V2",
    reviewText: "Charging connector is magnetic but very weak. It pops off the watch if it is bumped. I wish they used a more secure cradle.",
    sentiment: "Negative",
    category: "Battery",
    confidenceScore: 0.90,
    date: "2026-05-02"
  },
  {
    id: "demo-52",
    productName: "BassDrop Wireless Speaker",
    reviewText: "Bluetooth 5.3 is great. Stays connected to both my work laptop and personal phone at the same time. Audio sources transition automatically.",
    sentiment: "Positive",
    category: "Connectivity",
    confidenceScore: 0.97,
    date: "2026-04-28"
  },
  {
    id: "demo-53",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "Mids are recessed, making acoustic tracks sound a bit hollow. Bass is nice, but if you listen to vocal-focused tracks, these might not be for you.",
    sentiment: "Neutral",
    category: "Audio",
    confidenceScore: 0.87,
    date: "2026-04-24"
  },
  {
    id: "demo-54",
    productName: "Horizon OLED Smartwatch",
    reviewText: "The watchface has a massive black bezel. The screen itself is small inside a large watch case. It doesn't look as modern as the promo photos.",
    sentiment: "Negative",
    category: "Display",
    confidenceScore: 0.89,
    date: "2026-04-20"
  },
  {
    id: "demo-55",
    productName: "BassDrop Wireless Speaker",
    reviewText: "Super fast shipping, was delivered on Sunday. Tracking history was clear and updated in real-time.",
    sentiment: "Positive",
    category: "Delivery",
    confidenceScore: 0.98,
    date: "2026-04-16"
  },
  {
    id: "demo-56",
    productName: "ApexFit Smartwatch V2",
    reviewText: "Battery is decent. Lasts about 5 days of normal usage. Charging is fast enough. No real complaints here.",
    sentiment: "Neutral",
    category: "Battery",
    confidenceScore: 0.85,
    date: "2026-04-12"
  },
  {
    id: "demo-57",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "Bluetooth pairs but then drops out in the right earbud. Occurs about 5 minutes into every phone call. I have to disconnect and reconnect.",
    sentiment: "Negative",
    category: "Connectivity",
    confidenceScore: 0.94,
    date: "2026-04-08"
  },
  {
    id: "demo-58",
    productName: "BassDrop Wireless Speaker",
    reviewText: "The mic for speakerphone is trash. People on the other end say I sound like I'm underwater. Buy it for music, not for calls.",
    sentiment: "Negative",
    category: "Audio",
    confidenceScore: 0.93,
    date: "2026-04-05"
  },
  {
    id: "demo-59",
    productName: "Horizon OLED Smartwatch",
    reviewText: "Display is very bright, readable during my midday cycling workouts. Touch gestures work even with sweat on my fingers.",
    sentiment: "Positive",
    category: "Display",
    confidenceScore: 0.96,
    date: "2026-03-30"
  },
  {
    id: "demo-60",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "Courier left it with my neighbor without my permission, and they forgot to tell me for two days. Courier service could be improved.",
    sentiment: "Neutral",
    category: "Delivery",
    confidenceScore: 0.75,
    date: "2026-03-25"
  },
  
  // March / Feb Reviews
  {
    id: "demo-61",
    productName: "ApexFit Smartwatch V2",
    reviewText: "Amazing battery life. I went on a 4-day camping trip, used GPS for 2 hours daily, and still returned home with 30% battery remaining.",
    sentiment: "Positive",
    category: "Battery",
    confidenceScore: 0.98,
    date: "2026-03-20"
  },
  {
    id: "demo-62",
    productName: "BassDrop Wireless Speaker",
    reviewText: "Takes forever to reconnect when powered on. Sometimes it sits flashing blue for 30 seconds before finding my phone. Older models were quicker.",
    sentiment: "Negative",
    category: "Connectivity",
    confidenceScore: 0.88,
    date: "2026-03-18"
  },
  {
    id: "demo-63",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "Sound quality is superb. The bass has real vibration, mids are warm, and highs are detailed. Compares well to over-ear models.",
    sentiment: "Positive",
    category: "Audio",
    confidenceScore: 0.98,
    date: "2026-03-15"
  },
  {
    id: "demo-64",
    productName: "Horizon OLED Smartwatch",
    reviewText: "The resolution is a bit low, making small notifications fuzzy. You have to squint to read smaller messages.",
    sentiment: "Negative",
    category: "Display",
    confidenceScore: 0.85,
    date: "2026-03-10"
  },
  {
    id: "demo-65",
    productName: "ApexFit Smartwatch V2",
    reviewText: "Arrived in a plain brown box instead of the original packaging. Felt like I was sent a refurbished item instead of new. Watch was fine though.",
    sentiment: "Neutral",
    category: "Delivery",
    confidenceScore: 0.81,
    date: "2026-03-05"
  },
  {
    id: "demo-66",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "Right earbud fails to charge if not aligned perfectly in the case pins. I have to wiggle it and check the light each time I put it away.",
    sentiment: "Negative",
    category: "Battery",
    confidenceScore: 0.92,
    date: "2026-02-28"
  },
  {
    id: "demo-67",
    productName: "BassDrop Wireless Speaker",
    reviewText: "Bluetooth range is decent. Can stream from 30 feet away inside my apartment. Pairing is fast.",
    sentiment: "Positive",
    category: "Connectivity",
    confidenceScore: 0.93,
    date: "2026-02-25"
  },
  {
    id: "demo-68",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "Sound signature is flat, very boring. No dynamics. Useful for podcasts but misses the punch required for action movies or pop music.",
    sentiment: "Neutral",
    category: "Audio",
    confidenceScore: 0.84,
    date: "2026-02-20"
  },
  {
    id: "demo-69",
    productName: "Horizon OLED Smartwatch",
    reviewText: "OLED display has nice brightness adjustments. Contrast is excellent. Text is clean and graphics look sharp.",
    sentiment: "Positive",
    category: "Display",
    confidenceScore: 0.96,
    date: "2026-02-15"
  },
  {
    id: "demo-70",
    productName: "ApexFit Smartwatch V2",
    reviewText: "Delivery took 10 days, with no shipment tracking for the first week. Standard customer service couldn't locate it. Poor courier choice.",
    sentiment: "Negative",
    category: "Delivery",
    confidenceScore: 0.94,
    date: "2026-02-10"
  },

  // Jan reviews
  {
    id: "demo-71",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "I charge them once a week. They last forever. Case battery capacity is massive, and support wireless charging pads.",
    sentiment: "Positive",
    category: "Battery",
    confidenceScore: 0.96,
    date: "2026-01-28"
  },
  {
    id: "demo-72",
    productName: "BassDrop Wireless Speaker",
    reviewText: "Constantly drop pairing with my Android TV. Works with phone, but tv connection drops every 10 minutes. Hard to recommend.",
    sentiment: "Negative",
    category: "Connectivity",
    confidenceScore: 0.89,
    date: "2026-01-25"
  },
  {
    id: "demo-73",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "Highs are somewhat harsh at volume levels over 80%. Had to download a third party EQ app to tame the sibilance in female vocals.",
    sentiment: "Neutral",
    category: "Audio",
    confidenceScore: 0.80,
    date: "2026-01-20"
  },
  {
    id: "demo-74",
    productName: "Horizon OLED Smartwatch",
    reviewText: "Colors are outstanding. Black levels are perfect. Really looks high-end. No scratches after 3 weeks.",
    sentiment: "Positive",
    category: "Display",
    confidenceScore: 0.98,
    date: "2026-01-15"
  },
  {
    id: "demo-75",
    productName: "BassDrop Wireless Speaker",
    reviewText: "Arrived in 2 days as expected. Packaging was neat. Product arrived intact and works straight out of the box.",
    sentiment: "Positive",
    category: "Delivery",
    confidenceScore: 0.97,
    date: "2026-01-10"
  },

  // Extra entries for statistical distribution and charts (to hit ~90 entries)
  {
    id: "demo-76",
    productName: "ApexFit Smartwatch V2",
    reviewText: "Battery works great. I'm very satisfied with the 6 days of runtime. Highly recommend.",
    sentiment: "Positive",
    category: "Battery",
    confidenceScore: 0.95,
    date: "2026-05-14"
  },
  {
    id: "demo-77",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "Bluetooth keeps stuttering when I'm running. Seems like body blockage affects the signal. Mildly annoying.",
    sentiment: "Negative",
    category: "Connectivity",
    confidenceScore: 0.87,
    date: "2026-05-18"
  },
  {
    id: "demo-78",
    productName: "BassDrop Wireless Speaker",
    reviewText: "Audio volume is high, easily fills the room. It has a heavy bass response, which is great for parties.",
    sentiment: "Positive",
    category: "Audio",
    confidenceScore: 0.96,
    date: "2026-05-22"
  },
  {
    id: "demo-79",
    productName: "Horizon OLED Smartwatch",
    reviewText: "The touch controls on the display are very snappy. Tapping and swiping feels fluid. Highly responsive.",
    sentiment: "Positive",
    category: "Display",
    confidenceScore: 0.98,
    date: "2026-05-24"
  },
  {
    id: "demo-80",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "Box had some scuffs but shipping speed was very fast. Product was secure and works well.",
    sentiment: "Positive",
    category: "Delivery",
    confidenceScore: 0.92,
    date: "2026-05-26"
  },
  {
    id: "demo-81",
    productName: "ApexFit Smartwatch V2",
    reviewText: "Charging puck is convenient, snaps right into place. Charges fast enough for a daily top up.",
    sentiment: "Positive",
    category: "Battery",
    confidenceScore: 0.91,
    date: "2026-04-05"
  },
  {
    id: "demo-82",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "No connectivity issues here. Connects immediately when I open the lid. Works well up to 20 feet.",
    sentiment: "Positive",
    category: "Connectivity",
    confidenceScore: 0.94,
    date: "2026-04-10"
  },
  {
    id: "demo-83",
    productName: "BassDrop Wireless Speaker",
    reviewText: "Decent sound quality. It lacks detail in the high notes, but mid-range vocals are clear enough.",
    sentiment: "Neutral",
    category: "Audio",
    confidenceScore: 0.82,
    date: "2026-04-14"
  },
  {
    id: "demo-84",
    productName: "Horizon OLED Smartwatch",
    reviewText: "Display suffers from minor burn-in after 2 months of using the always-on watchface. Disappointing durability.",
    sentiment: "Negative",
    category: "Display",
    confidenceScore: 0.90,
    date: "2026-04-18"
  },
  {
    id: "demo-85",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "Delivery was delayed because the package was sent to the wrong hub. Took an extra week.",
    sentiment: "Negative",
    category: "Delivery",
    confidenceScore: 0.88,
    date: "2026-04-22"
  },
  {
    id: "demo-86",
    productName: "ApexFit Smartwatch V2",
    reviewText: "Battery life has degraded significantly after 4 months of use. It barely lasts 2 days now.",
    sentiment: "Negative",
    category: "Battery",
    confidenceScore: 0.94,
    date: "2026-03-02"
  },
  {
    id: "demo-87",
    productName: "BassDrop Wireless Speaker",
    reviewText: "Pairs fine with my Android phone, but struggles with older Bluetooth devices. Standard performance.",
    sentiment: "Neutral",
    category: "Connectivity",
    confidenceScore: 0.79,
    date: "2026-03-06"
  },
  {
    id: "demo-88",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "The audio soundstage is wide. Instrumental separation is distinct. High quality output.",
    sentiment: "Positive",
    category: "Audio",
    confidenceScore: 0.97,
    date: "2026-03-10"
  },
  {
    id: "demo-89",
    productName: "Horizon OLED Smartwatch",
    reviewText: "The screen is bright, colors are deep. Easy to read messages, widgets look clean.",
    sentiment: "Positive",
    category: "Display",
    confidenceScore: 0.95,
    date: "2026-03-14"
  },
  {
    id: "demo-90",
    productName: "ApexFit Smartwatch V2",
    reviewText: "Arrived in double packaging. Heavy protection. Got here a day earlier than promised.",
    sentiment: "Positive",
    category: "Delivery",
    confidenceScore: 0.98,
    date: "2026-03-18"
  },
  {
    id: "demo-91",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "Battery runs out of charge too quickly during high-volume listening. Only got 3 hours today.",
    sentiment: "Negative",
    category: "Battery",
    confidenceScore: 0.92,
    date: "2026-02-05"
  },
  {
    id: "demo-92",
    productName: "BassDrop Wireless Speaker",
    reviewText: "Sometimes pairing fails and requires holding the Bluetooth button to reset. Frustrating experience.",
    sentiment: "Negative",
    category: "Connectivity",
    confidenceScore: 0.89,
    date: "2026-02-12"
  },
  {
    id: "demo-93",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "Microphone is muffled. Callers complain that they can't understand me when there is noise around.",
    sentiment: "Negative",
    category: "Audio",
    confidenceScore: 0.91,
    date: "2026-02-18"
  },
  {
    id: "demo-94",
    productName: "Horizon OLED Smartwatch",
    reviewText: "Display has great resolution. The always-on-display looks clean and stylish.",
    sentiment: "Positive",
    category: "Display",
    confidenceScore: 0.97,
    date: "2026-02-22"
  },
  {
    id: "demo-95",
    productName: "ApexFit Smartwatch V2",
    reviewText: "Shipping package was torn, box inside was dirty. Fortunately watch wasn't affected.",
    sentiment: "Negative",
    category: "Delivery",
    confidenceScore: 0.84,
    date: "2026-02-26"
  },
  {
    id: "demo-96",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "The battery lasts well and charging case supports type-C fast charging. Helpful feature.",
    sentiment: "Positive",
    category: "Battery",
    confidenceScore: 0.93,
    date: "2026-01-05"
  },
  {
    id: "demo-97",
    productName: "BassDrop Wireless Speaker",
    reviewText: "Stays connected without drops. Simple pairing, holds memory for up to 4 devices.",
    sentiment: "Positive",
    category: "Connectivity",
    confidenceScore: 0.96,
    date: "2026-01-12"
  },
  {
    id: "demo-98",
    productName: "AcousticMax Pro Earbuds",
    reviewText: "Sound quality is just standard. Not great, but completely acceptable for daily listening.",
    sentiment: "Neutral",
    category: "Audio",
    confidenceScore: 0.80,
    date: "2026-01-18"
  },
  {
    id: "demo-99",
    productName: "Horizon OLED Smartwatch",
    reviewText: "Excellent screen visibility under direct sunlight. Auto brightness level is responsive.",
    sentiment: "Positive",
    category: "Display",
    confidenceScore: 0.97,
    date: "2026-01-22"
  },
  {
    id: "demo-100",
    productName: "ApexFit Smartwatch V2",
    reviewText: "Delivery was delayed due to winter weather. Customer service was responsive and polite.",
    sentiment: "Neutral",
    category: "Delivery",
    confidenceScore: 0.86,
    date: "2026-01-26"
  }
];
