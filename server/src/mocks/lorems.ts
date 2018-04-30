// http://meettheipsums.com/

// https://baconipsum.com/?paras=2&type=meat-and-filler&make-it-spicy=1
const bacon = [
  "Meatloaf hamburger turducken ham hock. Short loin drumstick kielbasa shank ham. Short loin tongue cow beef ribs sirloin boudin. Sunt ipsum nulla cupidatat anim swine short loin sirloin spare ribs frankfurter rump ex pancetta laborum brisket. Turducken pork kevin prosciutto sed proident, shank minim tempor fugiat pig meatloaf non.",
  "Adipisicing biltong aliqua filet mignon enim turkey swine velit commodo corned beef. Nostrud est laborum spare ribs magna.",
  "Flank salami prosciutto ball tip dolore pork est sint sirloin tenderloin doner. ",
  "Laboris do chicken kielbasa sed, exercitation ex labore rump short ribs ground round.",
  "Veniam quis cow venison andouille, pork loin lorem rump duis kevin swine magna prosciutto. ",
  "Elit et nostrud tenderloin ea strip steak, frankfurter picanha. Short loin culpa reprehenderit id, veniam ad voluptate. Shank eu sunt nulla. Sirloin porchetta filet mignon, chuck t-bone non shankle turducken leberkas.",
  "resaola jerky capicola consectetur in eiusmod tempor. Laboris do chicken kielbasa sed, exercitation ex labore rump short ribs ground round. Jowl filet mignon do pancetta, brisket aliquip exercitation non. Salami ut enim venison duis. Laboris sausage ex elit.Adipisicing reprehenderit turkey prosciutto esse sausage, ball tip fugiat shoulder spare ribs shankle velit kielbasa. Pariatur do jerky ad, ipsum pig nostrud.",
  "Adipisicing biltong aliqua filet mignon enim turkey swine velit commodo corned beef. Nostrud est laborum spare ribs magna. Veniam quis cow venison andouille, pork loin lorem rump duis kevin swine magna prosciutto. ",
  "Adipisicing pig sunt, pastrami venison chuck sausage do strip steak ribeye fugiat et sed capicola. Consequat fatback beef corned beef adipisicing. Consectetur in in, salami burgdoggen ball tip mollit strip steak quis turkey id chuck hamburger. Qui duis adipisicing salami. Capicola lorem veniam, officia fatback meatloaf beef ribs corned beef aliqua sausage tongue. Picanha tempor sed anim cupidatat landjaeger bresaola tenderloin pork loin shank pork belly buffalo cillum corned beef. Boudin pork belly pariatur buffalo pork ut tempor incididunt drumstick.",
  "Spicy jalapeno dolore do velit, alcatra swine shankle meatball. Ipsum culpa ut reprehenderit. Tempor sausage shank proident tail. Andouille id duis landjaeger. Sint veniam labore ribeye adipisicing. Swine irure leberkas deserunt landjaeger burgdoggen nulla, veniam pancetta tongue.",
  "Ullamco ut kevin strip steak deserunt enim. Short ribs dolore bresaola porchetta, consequat ball tip corned beef duis venison irure hamburger salami. Beef est ham hock, nulla et hamburger do burgdoggen minim ullamco in frankfurter brisket ut jowl.",
  "Consectetur laboris andouille, corned beef turducken jerky beef ribs fugiat nulla magna kielbasa ut shankle ham hamburger. Ipsum pastrami eu tongue bacon jerky ut consequat. Enim hamburger meatball brisket do aute.",
  "Ground round pariatur spare ribs ea enim.",
  "Lorem jowl cow dolore sausage eu, andouille eiusmod flank short loin prosciutto pariatur beef picanha. Bresaola magna ut alcatra tenderloin. Cow id beef leberkas prosciutto. Nostrud in tempor excepteur laborum, bacon doner fatback in pastrami. ",
  "Boudin qui kevin sausage pork chop. Culpa aliquip sint, drumstick kevin laborum pork loin quis kielbasa laboris.",
  "Strip steak turducken ball tip cillum ex venison burgdoggen picanha andouille short ribs boudin porchetta alcatra ea. ",
  "Aliquip pig est, tail jowl id spare ribs elit veniam chicken buffalo picanha. Ea excepteur cupim fatback elit. ",
  "Shankle nisi in pancetta deserunt, porchetta boudin. Esse fugiat burgdoggen jerky bacon.",
  "Aliqua eiusmod picanha occaecat pancetta. Anim incididunt dolor qui duis elit flank. ",
  "Pork belly excepteur officia, aliquip drumstick sausage laborum tenderloin occaecat mollit chicken enim andouille. Venison ea fugiat est minim strip steak. Ball tip fugiat mollit dolore spare ribs nostrud.",
  "Ut frankfurter aliqua proident culpa jowl fatback. Aute in salami qui, meatball ut enim exercitation buffalo nisi sausage.",
  "Corned beef mollit consequat, short ribs esse sed ullamco kevin beef minim ham hock sint. Short ribs doner tri-tip, t-bone ut culpa rump.",
  "Esse cillum rump, t-bone beef shoulder drumstick cupidatat beef ribs tail sint flank adipisicing duis elit. ",
  "Mollit doner chuck burgdoggen shoulder short loin sunt filet mignon beef kevin meatball.",
  "Tempor occaecat prosciutto rump. Eu ullamco shank dolore tongue kevin. Veniam andouille burgdoggen aute velit dolore fugiat nostrud."
];

// http://coffeeipsum.com/
const coffee = [
  "Qui robust, arabica half and half, et cultivar blue mountain whipped robusta grounds. Wings spoon, mug frappuccino half and half caramelization doppio iced rich variety. Variety caramelization black, macchiato barista viennese macchiato foam java. Mazagran mocha arabica in, sweet, blue mountain doppio foam body breve brewed.",
  "Et, café au lait iced extra steamed, java plunger pot dripper acerbic saucer. A sweet strong organic wings, in so, saucer variety and qui chicory. Cream a pumpkin spice caffeine black java blue mountain frappuccino con panna wings galão. Barista, aftertaste lungo pumpkin spice, mazagran, extra, barista rich cup eu percolator breve.",
  "Froth sugar, plunger pot, trifecta, turkish cultivar lungo aroma frappuccino carajillo strong. Redeye qui french press, caffeine con panna dripper decaffeinated aftertaste. Cup caramelization id, single origin grounds spoon irish body. Seasonal, siphon et percolator siphon, sugar wings cappuccino arabica in extraction lungo.",
  "Grounds instant, aromatic strong, trifecta, bar iced caffeine spoon variety. Bar affogato, iced con panna barista, to go roast caramelization et aged galão viennese. Cream grinder aftertaste americano whipped turkish aged filter. Con panna instant percolator, affogato wings ristretto cinnamon qui as macchiato roast.Rich caramelization flavour chicory affogato carajillo aroma. Whipped aromatic, barista cinnamon ristretto cream organic. Qui beans at so foam wings and sit extra.",
  "Organic mocha café au lait, steamed, espresso doppio kopi-luwak whipped filter. Crema cream cup extra galão cup redeye. Cup percolator, aroma viennese beans aromatic kopi-luwak.",
  "A qui robust id white skinny robust. Beans et body, robusta, aromatic breve, trifecta, so iced brewed white crema. Flavour, grinder americano, grinder cultivar robusta fair trade mocha siphon.",
  "Café au lait percolator, whipped cappuccino body and lungo. Percolator, dark, iced, pumpkin spice latte iced dripper grounds filter espresso cup grinder. Cup, caffeine aged, cultivar, java chicory turkish java at café au lait.",
  "Wings cappuccino aftertaste coffee at steamed, lungo, caffeine aftertaste robust café au lait grinder.",
  "Caffeine wings, aroma latte crema, extra fair trade siphon bar that. Filter percolator affogato saucer foam wings arabica turkish robust mug decaffeinated seasonal.",
  "Black froth, aged spoon affogato trifecta aftertaste crema irish brewed froth. Lungo, est french press at ut mocha siphon mocha robust.",
  "Cultivar ristretto aromatic, arabica, irish fair trade mug aftertaste redeye. Wings, arabica, coffee ristretto extraction skinny robust aroma single shot. ",
  "Cream grinder mug brewed, in espresso as rich breve. Mazagran percolator irish java et redeye mocha, fair trade a turkish latte french press.",
  "To go doppio crema cappuccino mocha grounds ut that strong.",
  "Cappuccino est sugar lungo viennese brewed redeye that cortado.",
  "Ut shop, decaffeinated, aftertaste as crema half and half whipped that steamed. ",
  "Single shot café au lait beans redeye, dripper, french press cup café au lait iced robust. Rich qui in filter, caffeine, that doppio beans pumpkin spice aftertaste.",
  "Mazagran, grounds whipped single origin frappuccino aroma whipped.",
  "Iced that, sweet robust extraction breve blue mountain. Coffee ristretto, trifecta single shot decaffeinated chicory aged filter. Id steamed instant, aromatic medium caramelization irish aftertaste.",
  "Steamed aromatic kopi-luwak iced trifecta mazagran dark steamed sit coffee milk ristretto. As, decaffeinated aftertaste aromatic spoon chicory roast.",
  "Aroma con panna, turkish id, roast froth coffee crema caramelization wings. Cultivar and espresso siphon shop trifecta skinny whipped grinder siphon.",
  "Fair trade cinnamon, turkish caramelization cream filter sugar cappuccino.",
  "Siphon beans dripper, foam froth galão so cinnamon aged single shot. Plunger pot, cinnamon café au lait, strong, americano, single shot siphon variety turkish percolator macchiato.",
  "Viennese coffee french press blue mountain coffee white, chicory latte galão aged body skinny. As at con panna cream coffee frappuccino cup as and ut grounds. Strong, white, siphon ristretto crema instant, cinnamon con panna beans robust extra. ",
  "Chicory café au lait mazagran crema as, fair trade at viennese breve kopi-luwak. Affogato, iced est viennese espresso chicory milk. Acerbic single origin aromatic",
  "Café au lait extra est, turkish wings mug whipped brewed. Filter mazagran crema grinder whipped body shop, percolator siphon medium a single origin.",
  "Ristretto, cup body, coffee sweet ristretto affogato cappuccino. Froth body coffee macchiato arabica sweet sit to go. ",
  "Americano carajillo lungo coffee, froth decaffeinated shop latte kopi-luwak cortado. Coffee ristretto that, instant, foam aged id java cream doppio. Sit, cappuccino instant cream robust single shot caffeine foam mug dripper americano single shot."
];

// http://nietzsche-ipsum.com/
const nietzsche = [
  "Self law truth moral will gains. Marvelous self burying battle virtues eternal-return. .",
  "Ascetic christianity prejudice suicide superiority mountains passion snare battle moral. Inexpedient snare convictions deceptions insofar inexpedient christian society truth love. Burying justice.",
  "Derive christianity decieve spirit oneself dead burying pious play moral overcome chaos convictions salvation. Play merciful right christian strong.",
  "Chaos spirit endless overcome strong hatred pious merciful fearful prejudice. Passion battle salvation noble good.",
  "Christian christianity god sea ultimate war burying horror. Love battle oneself zarathustra madness justice eternal-return oneself. Truth chaos madness madness.",
  "Gains fearful reason contradict law transvaluation sexuality merciful ascetic.",
  "Sea madness disgust decrepit deceptions gains. Decieve free battle convictions value inexpedient intentions battle will love. ",
  "Eternal-return contradict battle good overcome overcome fearful grandeur ideal noble.",
  "Zarathustra grandeur christianity war snare holiest god inexpedient abstract spirit faithful strong fearful pinnacle. ",
  "Passion pinnacle truth noble law justice strong value decrepit. Overcome abstract against ubermensch mountains selfish burying ultimate play intentions philosophy. ",
  "Philosophy evil snare oneself philosophy prejudice hatred ultimate ideal victorious abstract sexuality noble.",
  "Faith mountains overcome sexuality aversion fearful disgust law ultimate prejudice strong ubermensch. Truth superiority play endless philosophy.",
  "Morality depths ocean ultimate convictions philosophy pious transvaluation.",
  "Aversion inexpedient abstract joy strong strong ultimate decrepit disgust right chaos.",
  "Endless battle joy snare insofar merciful self justice transvaluation hope endless fearful sea pinnacle.",
  "Morality horror transvaluation disgust evil god derive right sea hatred hope. ",
  "Spirit christianity gains evil justice. Fearful joy fearful decrepit abstract play ultimate evil.",
  "Will decieve of victorious overcome revaluation love justice passion abstract virtues faithful.",
  "Chaos of madness ultimate moral moral play victorious faith ubermensch pious will.",
  "Christian evil joy eternal-return play decieve mountains.",
  "Zarathustra will burying christianity enlightenment decrepit christian ocean gains.",
  "Good ocean strong sexuality grandeur free superiority zarathustra selfish inexpedient reason.",
  "Abstract passion eternal-return sea moral decieve disgust mountains love war ultimate derive. ",
  "Decrepit ultimate chaos."
];

// http://officeipsum.com/
const office = [
  "Are we in agreeance show pony. Fire up your browser back to the drawing-board high touch client so open door policy, but dog and pony show powerpoint Bunny, or we need to socialize the comms with the wider stakeholder community. Great plan! let me diarize this, and we can synchronise ourselves at a later timepoint back of the net, and this is a no-brainer, but cloud strategy and I just wanted to give you a heads-up closing these latest prospects is like putting socks on an octopus.",
  "Beef up drink the Kool-aid, for put your feelers out ramp up, or shotgun approach. Cannibalize shelfware goalposts, but imagineer thought shower. Moving the goalposts i don't want to drain the whole swamp, i just want to shoot some alligators, but get all your ducks in a row locked and loaded marketing computer development html roi feedback team website synergize productive mindfulness.",
  "Win-win-win punter and close the loop but high touch client. Can I just chime in on that one.",
  "Churning anomalies we need a paradigm shift pulling teeth, yet in this space. ",
  "We need to future-proof this",
  "I also believe it's important for every member to be involved and invested in our company and this is one way to do so. Curate.",
  "Pushback.",
  "Guerrilla marketing we don't want to boil the ocean we need to leverage our synergies touch base",
  'The sprint is over please use "solutionise" instead of solution ideas! :). ',
  "Move the needle drink from the firehose, but to be inspired is to become creative, innovative and energized we want this philosophy to trickle down to all our stakeholders and highlights that ipo will be a game-changer.",
  "Pull in ten extra bodies to help roll the tortoise move the needle paddle on both sides, and first-order optimal strategies.",
  "First-order optimal strategies timeframe, nor we need to button up our approach yet can we align on lunch orders baseline the procedure and samepage your department.",
  "High performance keywords work flows blue sky thinking.",
  "We need to start advertising on social media.",
  "Face time customer centric, for punter nor bleeding edge, but get all your ducks in a row, so old boys club.",
  "Meeting assassin moving the goalposts marketing computer development html roi feedback team website. Diversify kpis.",
  "Granularity we need to build it so that it scales so in this space.",
  "Quarterly sales are at an all-time low back of the net, but baseline the procedure and samepage your department goalposts prairie dogging, or pig in a python, but touch base.",
  "Level the playing field productize.",
  "Make sure to include in your wheelhouse player-coach put in in a deck for our standup today shotgun approach wheelhouse, and prethink we dont want to boil the ocean.",
  "Great plan! let me diarize this, and we can synchronise ourselves at a later timepoint put your feelers out.",
  "irst-order optimal strategies baseline for future-proof, but take five, punch the tree, and come back in here with a clear head baseline, so customer centric.",
  "High-level fire up your browser, nor i am dead inside anti-pattern.",
  "Push back digitalize yet enough to wash your face, or low-hanging fruit horsehead offer, for Bob called an all-hands this afternoon that ipo will be a game-changer.",
  "Q1 one-sheet, and strategic high-level 30,000 ft view yet drop-dead date, so those options are already baked in with this model table the discussion , but time to open the kimono. Its a simple lift and shift job.",
  "Due diligence high touch client.",
  "Execute blue sky yet we need to harvest synergy effects, but time to open the kimono or dog and pony show, yet we need to button up our approach. Lets unpack that later wiggle room. ",
  "Going forward. You better eat a reality sandwich before you walk back in that boardroom dogpile that but rock Star/Ninja bake it in, so open door policy.",
  "We need to have a Come to Jesus meeting with Phil about his attitude run it up the flagpole, or wheelhouse touch base nor we need to harvest synergy effects. ",
  "Ultimate measure of success where do we stand on the latest client ask. This is a no-brainer i am dead inside high-level nor beef up price point. Goalposts staff engagement market-facing, for turd polishing."
];

// http://agencyipsum.website/
const agency = [
  "Take empathy maps but create synergy. ",
  "Informing core competencies in order to maximise share of voice. Taking cloud computing but maximise share of voice.",
  "Leading brand pillars with the possibility to be on brand. Creating custom solutions so that as an end result, we surprise and delight.",
  "Funnel growth channel",
  "Utilise agile to increase viewability.",
  "Lead social and then go viral",
  "Repurposing above the fold and possibly be transparent. Leading vertical integration to, consequently, improve overall outcomes. Executing transformation mapping yet be CMSable. Inform brand integration with a goal to come up with a bespoke solution. ",
  "Considering above the fold and try to increase viewability. Growing branding with a goal to make the logo bigger. Informing core competencies to create actionable insights.",
  "Demonstrate stakeholder engagement with a goal to maximise share of voice. ",
  "Targeting below the fold so that we improve overall outcomes. Informing big data and then re-target key demographics.",
  "Funnel key demographics to, consequently, be on brand. Funnel branding so that we infiltrate new markets. Repurpose first party data to, consequently, target the low hanging fruit.",
  "Grow social with a goal to make users into advocates. Demonstrating core competencies in order to get buy in. Build brand integration and finally innovate.",
  "Lead sprints so that as an end result, we disrupt the balance.",
  "Engaging growth hacking with the aim to create synergy. Taking user experience with the possibility to increase viewability. Inform custom solutions and above all, maximise share of voice. Repurpose above the fold so that we create synergy.",
  "Demonstrating outside the box thinking with a goal to surprise and delight. Amplifying core competencies with the possibility to increase viewability. ",
  "Engage custom solutions so that as an end result, we further your reach. Demonstrating user experience so that we increase viewability.",
  "Synchronise user engagement and finally use best practice. Demonstrate blue-sky thinking so that as an end result, we innovate.",
  "Target thought leadership with a goal to further your reach. Informing vertical integration and possibly build ROI.",
  "Executing user engagement in order to make users into advocates. Repurpose mobile-first design and try to infiltrate new markets.",
  "Lead key demographics so that we make the logo bigger. Leverage transformation mapping with the possibility to improve overall outcomes. Building above the line with a goal to disrupt the balance.",
  "Synchronise brand integration and then create synergy. Growing thought leadership with a goal to be CMSable.",
  "Growing below the fold to in turn use best practice."
];

// http://www.catipsum.com/
const cats = [
  "Balinese siamese lynx tiger. Mouser egyptian mau. Savannah panther. Ocicat havana brown, for ocicat birman egyptian mau cougar, american shorthair. ",
  "Malkin sphynx. Cheetah malkin tom, abyssinian bombay cougar, leopard. Birman devonshire rex. ",
  "Scottish fold persian birman british shorthair.",
  "Mouser",
  "Lion bombay lion malkin yet devonshire rex bombay but siamese. American bobtail ocelot but persian yet ocicat munchkin turkish angora bobcat. Siamese sphynx and thai panther, bengal but tom. ",
  "Cheetah siberian cornish rex siberian and bombay. Munchkin bombay for ocelot. Donskoy kitten. Cornish rex kitty.",
  "Tom malkin british shorthair but ocicat.",
  "British shorthair siberian malkin but tabby, and thai scottish fold puma. Donskoy birman",
  "Tabby lion persian bobcat. Devonshire rex leopard, for american bobtail. ",
  "Birman manx or scottish fold. Tabby lion yet tiger and persian. ",
  "Norwegian forest kitty or ocicat devonshire rex.",
  " American shorthair leopard birman. Lynx. Kitten. Thai manx sphynx so egyptian mau. Ocicat havana brown and havana brown so kitty, so leopard yet balinese .",
  "Panther leopard but siamese maine coon thai. British shorthair ragdoll or devonshire rex. Maine coon devonshire rex.",
  "Siamese munchkin scottish fold malkin ocicat cheetah. Ocicat abyssinian so russian blue leopard. ",
  "Tabby tiger so siberian persian himalayan. ",
  "Turkish angora puma yet norwegian forest or malkin. Ocelot kitty for himalayan kitten. ",
  "Singapura bengal lynx. ",
  "Siberian siberian tabby norwegian forest but persian, or lion. Lion.",
  "Ocicat balinese siberian so abyssinian tomcat egyptian mau, burmese. Jaguar.",
  "Havana brown tiger or turkish angora so balinese . Savannah cougar siberian but cornish rex or tomcat.",
  "Bombay malkin himalayan but donskoy kitty birman"
];

// http://ancientalienipsum.com/
const aliens = [
  "ancient alien annunaki burmuta triangle ufo kachina doll choral castle, pyramids otherworldly visitors nasa sumerian texts machu picchu, vortex puma punku petroglyph space brothers portal",
  "golden disk mainstream archaelogy earth mound crystal skull vymaanika-shaastra otherworldly visitors.",
  "Space brothers nasa kachina doll evidence alien vortex mystery, weightless contend nasa von daniken space travel mahabharata. vimana burmuta triangle helicopter heiroglyph mahabharata",
  "king soloman gods ancient god mayan ancient civilization, ancient civilization extraterrestrial aircraft stonehenge, petroglyph sightings portal . the answer is a resounding yes... ",
  "pre-colonial aerodynamics kachina doll annunaki elongated skull ezekiel , puma punku petroglyph choral castle magnetic current",
  "cover up annunaki ancient religions helicopter heiroglyph mystery , ancient alien theorists extraterrestrial golden disk seti , space travel clearly space time mahabharata mayan.",
  "nazca lines von daniken puma punku mystery grey stonehenge mayan, seti machu picchu kachina doll mayan earth mound, magnetic current sky people the vedas kachina doll. foo fighter technology von daniken"
];

export default {
  bacon,
  coffee,
  nietzsche,
  office,
  agency,
  cats,
  aliens
};
