// Activity library. Each theme has 12 activities in a fixed order, used to build a themed week:
//   0-3  = Literacy / Maths (two of each, alternating)
//   4-7  = hands-on (science, creative, move)
//   8-11 = story time
// A themed week gives each day: one from 0-3, one from 4-7, one from 8-11 (all "core").
// To add a theme, copy one below and keep the same 12-activity order.
const A = (sub, title, desc, min, mats = [], colbie = '') => ({ sub, title, desc, min, mats, colbie });

export const THEMES = [
  /* ───────── SPACE ───────── */
  {
    id: 'space', emoji: '🚀', title: 'Space', color: '#5B5BD6', tint: '#E8E8FB',
    blurb: 'Rockets, planets, the moon and the night sky.',
    tip: 'Dark winter evenings are perfect for the stargazing outing. A few minutes in coats with a torch is plenty.',
    materials: [['🪐', 'Paper and paints for planets'], ['🥄', 'Foil and cardboard tubes (rockets)'], ['🔦', 'Torch'], ['⭐', 'Star stickers or foil stars'], ['📦', 'Big cardboard box (rocket)'], ['🍬', 'Buttons or counters'], ['🖍️', 'Black paper + white crayons or chalk'], ['⚽', 'A ball for “Earth”']],
    outing: {
      emoji: '🔭', title: 'Stargazing evening', where: 'Back garden or a dark local park (or a planetarium or science centre)',
      desc: 'Wrap up warm, bring a torch and hot chocolate, and look for the moon, stars and planes.',
      bring: ['Warm coats and hats', 'Torch', 'Hot chocolate', 'Blanket', 'Bingo cards'],
      bingo: [['🌙', 'The moon'], ['⭐', 'A star'], ['✈️', 'A plane'], ['🛰️', 'A moving light'], ['☁️', 'A cloud'], ['🦉', 'A night sound'], ['🌳', 'A tree silhouette'], ['💡', 'A street light'], ['🔦', 'Your torch beam']]
    },
    activities: [
      A('Literacy', 'Letter R for rocket', 'Trace R, then draw a rocket and label it. Say the R sound as you blast off.', 15, ['Paper', 'Pens'], 'Draw a rocket and point to the R.'),
      A('Maths', 'Countdown to blast-off', 'Count backwards from 10 to 0 and jump at blast-off. Hide number cards under cups and reveal them in order.', 15, ['Number cards', 'Cups'], 'Count down from 5 and jump.'),
      A('Literacy', 'Star words', 'Say space words (moon, star, sun, rocket) and clap the beats. Write one on a paper star.', 15, ['Paper stars', 'Pens'], 'Say the words and clap along.'),
      A('Maths', 'Planets in order', 'Cut paper circles in different sizes and line them up from smallest to biggest. Which is nearest the sun?', 20, ['Paper', 'Safety scissors'], 'Sort the circles into big and small.'),
      A('Science', 'Day and night', 'In a dark room shine a torch on a ball and spin it slowly. Where is it day? Where is it night?', 15, ['Torch', 'Ball'], 'Hold the torch.'),
      A('Creative', 'Cardboard box rocket', 'Turn a big box into a rocket with foil, tubes and a paper control panel. Then take off!', 30, ['Big box', 'Foil', 'Tubes', 'Pens'], 'Press all the buttons.'),
      A('Science', 'Moon craters', 'Fill a tray with flour, drop pebbles from different heights and look at the craters you make.', 20, ['Tray', 'Flour', 'Pebbles'], 'Drop the pebbles.'),
      A('Move', 'Astronaut training', 'Moon-walk slowly, balance on a “space beam”, roll like a planet and freeze like a star.', 15, [], 'Copy the moves.'),
      A('Story', '"How to Catch a Star" by Oliver Jeffers', 'If you could catch a star, where would you keep it?', 10),
      A('Story', '"Aliens Love Underpants" by Claire Freedman', 'Silly rhymes. Draw your own alien afterwards.', 10),
      A('Story', '"Look Up!" by Nathan Bryon', 'A girl who loves the night sky. Plan your own stargazing night.', 10),
      A('Story', '"Zoom, Rocket, Zoom!" by Margaret Mayo', 'Make the rocket noises and count down together.', 10)
    ]
  },

  /* ───────── DINOSAURS ───────── */
  {
    id: 'dinos', emoji: '🦖', title: 'Dinosaurs', color: '#7A9A2E', tint: '#EEF4D9',
    blurb: 'Roars, fossils and giant footprints.',
    tip: 'Let them be the expert. “Tell me about this one” is a lovely question, and big dinosaur words are great for early reading.',
    materials: [['🦕', 'Toy dinosaurs (any)'], ['🧂', 'Salt dough: flour and salt'], ['🥚', 'Plastic eggs or balloons'], ['🧊', 'Tub for freezing a toy dinosaur'], ['🖌️', 'Paint, brushes and paper'], ['🪨', 'Tray of sand or soil'], ['🧶', 'String and tape measure'], ['🪥', 'Old toothbrush (fossil dig)']],
    outing: {
      emoji: '🦴', title: 'Museum or dinosaur hunt', where: 'Natural history or local museum, a park with sculptures, or a woodland “dino footprint” hunt',
      desc: 'Look for the biggest thing, the sharpest teeth and the smallest bone.',
      bring: ['Notebook', 'Camera', 'Snacks', 'Bingo cards'],
      bingo: [['🦖', 'A big skeleton'], ['🦷', 'Sharp teeth'], ['🥚', 'An egg'], ['🦴', 'A bone'], ['🐾', 'A footprint'], ['🪨', 'A fossil or rock'], ['🌿', 'A plant-eater'], ['📏', 'Something taller than you'], ['🎟️', 'A museum sign']]
    },
    activities: [
      A('Literacy', 'Letter D for dinosaur', 'Trace D in sand. Find D things: dinosaur, dig, duck, door. Draw a dino and label it.', 15, ['Sand tray', 'Paper'], 'Finger-trace D shapes.'),
      A('Maths', 'How long was it?', 'Cut string for a T. rex (about 12 metres), a stegosaurus and a tiny dino. Lay them out and walk along each one.', 20, ['String', 'Scissors', 'Tape measure'], 'Walk beside the string and count steps.'),
      A('Literacy', 'Big dinosaur names', 'Say long names in beats: tri-cer-a-tops. Clap each one. Which has the most claps?', 15, [], 'Clap and stomp the beats.'),
      A('Maths', 'Egg hunt counting', 'Hide numbered eggs. Find them, put them in order 1 to 10, then count the eggs in the nest.', 15, ['Plastic eggs', 'Number labels'], 'Find and count three eggs.'),
      A('Science', 'Fossil prints', 'Mix 200 g plain flour, 100 g salt and about 100 ml water into dough. Press toy dinosaurs or shells into it and let it dry.', 30, ['Flour', 'Salt', 'Toy dinosaurs'], 'Press and squish.'),
      A('Science', 'Dinosaur dig', 'Bury toy dinosaurs in sand or soil. Dig them out with spoons and an old toothbrush like a palaeontologist.', 20, ['Tray of sand or soil', 'Spoons', 'Old toothbrush'], 'Dig with a spoon.'),
      A('Science', 'Rescue the ice egg', 'Freeze a toy dino in a tub of water overnight. Free it with warm water, salt and spoons. Prep the night before.', 20, ['Frozen tub', 'Warm water', 'Salt'], 'Pour the warm water.'),
      A('Move', 'Stomp, roar, freeze', 'Stomp like a T. rex, tiptoe like a raptor, swish like a diplodocus. Freeze when the music stops.', 10, [], ''),
      A('Story', '"Dinosaur Roar!" by Paul and Henrietta Stickland', 'Opposites: tiny and huge, fast and slow.', 10),
      A('Story', '"Harry and the Bucketful of Dinosaurs" by Ian Whybrow', 'What would you do if your dinosaurs came to life?', 10),
      A('Story', '"Tyrannosaurus Drip" by Julia Donaldson', 'A mix-up in the nest. Join in with the rhymes.', 10),
      A('Story', '"How Do Dinosaurs Say Goodnight?" by Jane Yolen', 'A calm one for the end of the day.', 10)
    ]
  },

  /* ───────── OCEAN ───────── */
  {
    id: 'ocean', emoji: '🌊', title: 'Under the Sea', color: '#1E88B5', tint: '#DDF1FA',
    blurb: 'Whales, fish, shells and rock pools.',
    tip: 'Real water is the best prop. Trays, tubs and the bath all count. If a beach is far, a local aquarium or garden-centre fish tank works well.',
    materials: [['🐚', 'Shells or smooth pebbles'], ['🥣', 'Large tub of water and cups'], ['🧂', 'Salt'], ['🎨', 'Blue and green paint, sponges'], ['🐠', 'Toy sea creatures'], ['🥘', 'Foil and paper plates'], ['🥚', 'A hard-boiled egg'], ['🪣', 'Sand tray or bucket']],
    outing: {
      emoji: '🐚', title: 'Beach, rock pool or aquarium', where: 'Beach, rock pools, or a local aquarium',
      desc: 'Collect shells, look into the water, and notice waves and tides. Stay safe near water.',
      bring: ['Wellies', 'Bucket', 'Snacks and water', 'Towel', 'Spare clothes', 'Bingo cards'],
      bingo: [['🐚', 'A shell'], ['🌊', 'A wave'], ['🦀', 'A crab or sea creature'], ['🐟', 'A fish'], ['🪨', 'A smooth pebble'], ['🪸', 'Seaweed'], ['🐦', 'A seagull'], ['🏖️', 'Sand'], ['⛵', 'A boat']]
    },
    activities: [
      A('Literacy', 'Letter F for fish', 'Trace F in a tray. Find F words: fish, fin, flipper, float. Draw a fish and label it.', 15, ['Tray', 'Paper'], 'Draw a fish with wiggly lines.'),
      A('Maths', 'Fish in the net', 'Cut out paper fish and count 1 to 10 into a bowl. Which colour has more?', 15, ['Paper fish', 'Bowl'], 'Count three fish into the net.'),
      A('Literacy', 'Ocean animal sounds', 'Whale starts with w, dolphin with d, shark with sh. Sort toy sea animals by their first sound.', 15, ['Toy sea animals'], 'Name the animals.'),
      A('Maths', 'Big, bigger, biggest', 'Order a shrimp, fish, shark and whale. The blue whale is the biggest animal ever!', 15, ['Pictures or toys'], 'Point to the biggest.'),
      A('Science', 'The salty egg', 'Does a hard-boiled egg float in plain water? Stir about 100 g salt into a jug of water and try again. Why?', 20, ['Jug', 'Salt', 'Hard-boiled egg'], 'Stir the salt.'),
      A('Creative', 'Foil fish', 'Make shiny scaly fish from foil and paper plates. Hang them up as a shoal.', 25, ['Foil', 'Paper plates', 'Pens'], 'Scrunch the foil.'),
      A('Creative', 'Rock pool in a tray', 'Arrange sand, shells, pebbles, water and toy creatures. Tell a story about who lives there.', 25, ['Tray', 'Sand', 'Shells', 'Toy creatures'], 'Place the creatures.'),
      A('Move', 'Swim, wave and wiggle', 'Swim like a fish, wave like the sea, float like a jellyfish, snap like a crab.', 10, [], ''),
      A('Story', '"The Rainbow Fish" by Marcus Pfister', 'Why did the little fish share? How did it feel?', 10),
      A('Story', '"Commotion in the Ocean" by Giles Andreae', 'Rhymes about sea creatures. Spot the new word each page.', 10),
      A('Story', '"Tiddler" by Julia Donaldson', 'A small fish with big stories. Retell it in your own words.', 10),
      A('Story', '"Mister Seahorse" by Eric Carle', 'Lift the flaps to find the hidden fish.', 10)
    ]
  },

  /* ───────── MINIBEASTS ───────── */
  {
    id: 'bugs', emoji: '🐞', title: 'Minibeasts', color: '#D14B3A', tint: '#FBE5E1',
    blurb: 'Spiders, ladybirds, worms and snails.',
    tip: 'In winter, bugs hide. Look under logs and stones, and use books, toys and pictures on cold days. Always put living things back where you found them.',
    materials: [['🔍', 'Magnifying glass'], ['🫙', 'Clear pot (let bugs go afterwards)'], ['🧶', 'Wool or string (spider webs)'], ['🪵', 'Logs, stones, leaf litter'], ['🎨', 'Paint and paper plates'], ['🧴', 'Pipe cleaners, googly eyes'], ['📄', 'Red paper and black dot stickers'], ['🪱', 'Damp tray (worm watching)']],
    outing: {
      emoji: '🐛', title: 'Bug safari', where: 'Local park, garden centre or woods',
      desc: 'Search slowly: under logs, in leaf piles, on walls. In winter, look for frosty webs and sleepy snails.',
      bring: ['Magnifying glass', 'Pot for looking', 'Wellies', 'Hand wipes', 'Bingo cards'],
      bingo: [['🐛', 'A caterpillar or grub'], ['🐌', 'A snail or slug'], ['🕷️', 'A spider or web'], ['🐜', 'An ant'], ['🐞', 'A ladybird'], ['🪱', 'A worm'], ['🍂', 'A leaf with a hole'], ['🪵', 'A log to look under'], ['🐝', 'A bee or fly']]
    },
    activities: [
      A('Literacy', 'Letter B for bug', 'Trace B. Find B words: bug, bee, butterfly, beetle. Draw a bug and label it.', 15, ['Paper', 'Pens'], 'Draw a bug with lots of legs.'),
      A('Maths', 'Ladybird spots', 'Make paper ladybirds with spot stickers. Count the spots, match spots to numbers, add two ladybirds together.', 15, ['Red paper', 'Dot stickers'], 'Stick on and count to five.'),
      A('Literacy', 'Bug rhymes', 'Sing “Incy Wincy Spider” and “Little Miss Muffet” with actions. Make up a rhyme about a snail.', 15, [], 'Do the actions.'),
      A('Maths', 'Count the legs', 'Insects have 6, spiders 8, snails none. Draw bugs with the right legs. Who has the most?', 15, ['Paper', 'Pens'], 'Count the legs on a toy bug.'),
      A('Science', 'Bug hunt', 'Look under logs, stones and leaves with a magnifier. Tally what you find, then put everything back gently.', 25, ['Magnifying glass', 'Tally chart'], 'Spot and point.'),
      A('Science', 'Worm watch', 'Watch a worm wriggle on a damp tray. How does it move? Does it like light or dark? Return it to the soil after.', 15, ['Damp tray', 'Torch'], 'Watch quietly.'),
      A('Creative', 'Spider web painting', 'Dip wool in paint and drag it across paper, or glue wool into a web shape.', 25, ['Wool', 'Paint', 'Paper'], 'Drag the wool.'),
      A('Move', 'Be a minibeast', 'Wriggle like a worm, scuttle like a spider, flutter like a butterfly. Crawl through a “grass” obstacle course.', 10, [], ''),
      A('Story', '"The Very Busy Spider" by Eric Carle', 'Feel the raised web on each page.', 10),
      A('Story', '"The Bad-Tempered Ladybird" by Eric Carle', 'Watch the clock times change as the day goes on.', 10),
      A('Story', '"Aaaarrgghh, Spider!" by Lydia Monks', 'A spider who wants to be a pet. Is he scary or sweet?', 10),
      A('Story', '"The Very Quiet Cricket" by Eric Carle', 'There is a surprise at the end.', 10)
    ]
  },

  /* ───────── VEHICLES ───────── */
  {
    id: 'vehicles', emoji: '🚜', title: 'Things That Go', color: '#17A2A2', tint: '#DDF3F3',
    blurb: 'Trains, diggers, buses and bikes.',
    tip: 'Real vehicles on a walk beat any worksheet. Count buses at the window, spot diggers on the roadside, and let them press the bell on the bus.',
    materials: [['🚗', 'Toy cars, trains and diggers'], ['🛣️', 'Masking tape for floor roads'], ['📦', 'Cardboard boxes'], ['🎨', 'Paint (to print with wheels)'], ['📏', 'Ramp: board or tray plus books'], ['🪙', 'Coins for bus fares'], ['📰', 'Paper and pens for tickets'], ['🧱', 'Building blocks']],
    outing: {
      emoji: '🚂', title: 'Bus, tram or train ride', where: 'A short local bus, tram or train journey',
      desc: 'Let the girls help: find the stop, hold the tickets, count the stops, ring the bell.',
      bring: ['Tickets or fare money', 'Snacks', 'Notebook', 'Bingo cards'],
      bingo: [['🚌', 'A bus'], ['🚂', 'A train or tram'], ['🚜', 'A tractor or digger'], ['🚲', 'A bike'], ['🚑', 'An emergency vehicle'], ['🚦', 'Traffic lights'], ['🛑', 'A stop sign'], ['🚛', 'A lorry'], ['✈️', 'A plane in the sky']]
    },
    activities: [
      A('Literacy', 'Letter T for train', 'Trace T. Find T words: train, truck, tractor, tyre. Draw a train and label it.', 15, ['Paper', 'Pens'], 'Draw a train with wheels.'),
      A('Maths', 'Car park counting', 'Draw numbered parking spaces 1 to 10. Park toy cars in the right spaces. Which row has more?', 15, ['Paper', 'Toy cars'], 'Park three cars.'),
      A('Literacy', 'Vehicle sounds', 'Beep, toot, vroom, chug. Match the sound to the vehicle and write it down.', 15, ['Pictures', 'Pens'], 'Make the noises.'),
      A('Maths', 'Which goes furthest?', 'Roll different cars down a ramp. Measure how far each goes with steps or blocks.', 20, ['Ramp', 'Cars', 'Blocks'], 'Release the cars.'),
      A('Science', 'Why wheels?', 'Push a heavy box on the floor, then put cardboard tubes underneath. Why does it move more easily?', 20, ['Box', 'Cardboard tubes'], 'Push the box.'),
      A('Creative', 'Wheel print tracks', 'Roll toy wheels through paint and make roads and tracks on paper.', 20, ['Paint', 'Paper', 'Toy cars'], 'Drive through the paint.'),
      A('Creative', 'Tape road town', 'Stick masking-tape roads on the floor. Add signs and a garage, then drive through.', 25, ['Masking tape', 'Paper signs', 'Cars'], 'Add cars to the roads.'),
      A('Move', 'Traffic lights', 'Green go, amber slow, red stop. Move like different vehicles to the lights.', 10, [], ''),
      A('Story', '"Naughty Bus" by Jan and Jerry Oke', 'What mischief did the bus get up to?', 10),
      A('Story', '"Mr Gumpy’s Motor Car" by John Burningham', 'Who gets a ride? What happens when it rains?', 10),
      A('Story', '"Dig, Dig, Digging" by Margaret Mayo', 'Spot every kind of digger and lorry.', 10),
      A('Story', '"Cars, Trucks and Things That Go" by Richard Scarry', 'Find the golden bug on every page.', 10)
    ]
  },

  /* ───────── FAIRY TALES ───────── */
  {
    id: 'tales', emoji: '🏰', title: 'Fairy Tales & Castles', color: '#8E5BD3', tint: '#EEE6FA',
    blurb: 'Pigs, bears, beanstalks and castles.',
    tip: 'Retelling is the magic. Let them tell the story back to you with voices, and swap the ending.',
    materials: [['👑', 'Dressing-up crowns and capes'], ['🧱', 'Bricks, lolly sticks and straw'], ['🥣', 'Porridge oats'], ['🍪', 'Gingerbread ingredients'], ['🌱', 'Beans to plant (Jack)'], ['📦', 'Boxes and tubes (castle)'], ['🎭', 'Spoons or card for puppets'], ['🧸', 'Three teddies']],
    outing: {
      emoji: '🏰', title: 'Castle or fort day', where: 'A local castle or historic building, or a park with a fort and climbing frame',
      desc: 'Be knights and princesses, hunt for towers and doors, and tell the story of who lived there.',
      bring: ['Dressing-up capes', 'Snacks', 'Camera', 'Bingo cards'],
      bingo: [['🏰', 'A tower'], ['🚪', 'A big door'], ['🧱', 'Old stones'], ['🪟', 'A tiny window'], ['🚩', 'A flag'], ['🌉', 'A bridge'], ['🌳', 'A very big tree'], ['👑', 'Someone in a crown (you!)'], ['🐉', 'A dragon-shaped cloud']]
    },
    activities: [
      A('Literacy', 'First, next, last', 'Draw four pictures from a tale and put them in order: first, next, then, last. Retell it.', 15, ['Paper', 'Pens'], 'Pick her favourite picture.'),
      A('Maths', 'Three bears, three bowls', 'Sort teddies and bowls into small, medium and big. Count three of everything.', 15, ['Teddies', 'Bowls'], 'Match small to small.'),
      A('Literacy', 'Tales and rhymes', 'Say “Jack and Jill” and “Humpty Dumpty”. Which words rhyme? Make up a silly new line.', 15, [], 'Say the last word of each line.'),
      A('Maths', 'Build three houses', 'Make houses from paper strips (straw), lolly sticks (sticks) and blocks (bricks). Count the pieces in each.', 20, ['Paper strips', 'Lolly sticks', 'Blocks'], 'Stack the blocks.'),
      A('Science', 'Huff and puff', 'Blow on straw, sticks and bricks (use paper, lolly sticks and blocks). Which is hardest to move, and why?', 15, ['Paper', 'Lolly sticks', 'Blocks'], 'Take a big breath and blow.'),
      A('Creative', 'Castle from boxes', 'Build a castle from boxes and tubes with a drawbridge and flags.', 30, ['Boxes', 'Tubes', 'Tape', 'Paper'], 'Colour the flags.'),
      A('Cooking', 'Gingerbread people', 'Follow a simple gingerbread recipe. Weigh the dry ingredients in grams, roll, cut and decorate.', 40, ['Recipe ingredients', 'Cutters', 'Scales'], 'Stir and decorate.'),
      A('Move', 'Act out the tale', 'Dress up and act: huff and puff like the wolf, stomp like the giant, tiptoe like Goldilocks.', 20, ['Dressing-up'], 'Be the wolf’s huff.'),
      A('Story', '"The Three Little Pigs" (traditional tale)', 'Tell or read it. Join in with “Not by the hair on my chinny chin chin”.', 10),
      A('Story', '"Goldilocks and the Three Bears" (traditional tale)', 'Which was too hot, too cold and just right?', 10),
      A('Story', '"The Gingerbread Man" (traditional tale)', 'Run, run, as fast as you can. Who chased him?', 10),
      A('Story', '"Jack and the Beanstalk" (traditional tale)', 'What would you find at the top of the beanstalk?', 10)
    ]
  },

  /* ───────── WINTER & CHRISTMAS ───────── */
  {
    id: 'winter', emoji: '❄️', title: 'Winter & Christmas', color: '#2B6CB0', tint: '#E1ECF8',
    blurb: 'Frost, snow, lights and getting ready for Christmas.',
    tip: 'Keep December cosy and low-pressure. A few of these woven in alongside everything else is plenty.',
    materials: [['❄️', 'Paper and safety scissors (snowflakes)'], ['🧊', 'Ice cube tray and small toys'], ['🎨', 'White and blue paint, cotton wool'], ['🎄', 'Card and glitter glue (cards)'], ['✉️', 'Envelopes and stamps'], ['🧂', 'Salt and warm water'], ['🍪', 'Biscuit ingredients'], ['🧣', 'Old hat and scarf (snowman)']],
    outing: {
      emoji: '✨', title: 'Lights or frosty walk', where: 'Local lights switch-on, Christmas market, or a frosty park walk',
      desc: 'Wrap up warm, look for lights and decorations, and notice what winter looks like.',
      bring: ['Hats, scarves and gloves', 'Flask of hot chocolate', 'Camera', 'Bingo cards'],
      bingo: [['⭐', 'A star'], ['🎄', 'A Christmas tree'], ['💡', 'Coloured lights'], ['🧣', 'Someone in a scarf'], ['🧊', 'Ice or frost'], ['🍂', 'A bare tree'], ['🎁', 'A present'], ['🔔', 'A bell'], ['🌬️', 'Your breath cloud']]
    },
    activities: [
      A('Literacy', 'Write a Christmas card', 'Write or tell a message to someone special: “Dear… love from…”. Post it for real.', 20, ['Card', 'Pens', 'Stamp'], 'Draw the picture on the front.'),
      A('Maths', 'Snowman buttons', 'Draw a snowman and count 1 to 10 buttons onto him. Add two more. How many now?', 15, ['Paper', 'Buttons'], 'Count five buttons.'),
      A('Literacy', 'Winter words', 'Say winter words (frost, snow, scarf, icicle). Sort by first sound and write one on a snowflake.', 15, ['Paper', 'Pens'], 'Say the sounds.'),
      A('Maths', 'Present patterns', 'Sort boxes by size, count ribbons, make a pattern: bow, tag, bow, tag.', 15, ['Boxes', 'Ribbon'], 'Sort big and small.'),
      A('Science', 'Melting ice', 'Freeze small toys in ice cubes. How can you free them? Try warm water, salt, hands. Predict first.', 20, ['Ice cubes', 'Salt', 'Warm water'], 'Choose the method.'),
      A('Science', 'Frost hunt', 'On a cold morning, look for frost and ice outside. Touch it, draw the patterns, and see what melts in your hands.', 15, ['Coats', 'Paper', 'Pencils'], 'Spot the frosty bits.'),
      A('Creative', 'Paper snowflakes', 'Fold paper and snip shapes (grown-up helps). Open it up. Is any one the same?', 20, ['Paper', 'Safety scissors'], 'Unfold and be amazed.'),
      A('Creative', 'Snowy scene', 'Paint a snowy scene with white paint and cotton wool on dark paper.', 20, ['Dark paper', 'White paint', 'Cotton wool'], 'Dab the cotton wool.'),
      A('Story', '"The Snowman" by Raymond Briggs', 'No words! Tell the story from the pictures.', 10),
      A('Story', '"Stick Man" by Julia Donaldson', 'Stick Man is on his way home for Christmas.', 10),
      A('Story', '"The Jolly Christmas Postman" by Janet and Allan Ahlberg', 'Open the little letters and cards in each page.', 10),
      A('Story', '"Kipper’s Snowy Day" by Mick Inkpen', 'A snowy adventure with a dog. What would you do in the snow?', 10)
    ]
  }
];
