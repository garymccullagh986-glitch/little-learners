// Lesson plan data. Add more weeks by copying a week object and giving it a new id.
// S(subject, title, description, minutes, materials[], note for Colbie)
const S = (sub, title, desc, min, mats = [], colbie = '') => ({ sub, title, desc, min, mats, colbie });

export const WEEKS = [
  /* ───────────── WEEK 1 ───────────── */
  {
    id: 1, emoji: '🌳', title: 'Nature & Seasons', color: '#2DB57A', tint: '#E3F6EC',
    blurb: 'Seeds, leaves, minibeasts and weather. Mostly mucky hands.',
    tip: 'Follow their curiosity. If the bug hotel takes all morning, that is the lesson. Short bursts (10–20 min) with a wiggle break in between work best at this age.',
    materials: [
      ['🪨', 'Pebbles, acorns or conkers'], ['🌿', 'Leaves (collect on a walk)'], ['🌱', 'Cress or sunflower seeds ×2 pots'],
      ['🪴', 'Compost + 2 small pots'], ['🖌️', 'Paint, paper, aprons'], ['📓', 'Two nature journals (or plain notebooks)'],
      ['🔍', 'Magnifying glass'], ['🧲', 'Magnetic letters or letter cards'], ['🥣', 'Egg box or small bowls'],
      ['🪵', 'Cardboard tubes, sticks, moss (bug hotel)'], ['🪣', 'Bowl of water (sink or float)'], ['🥾', 'Wellies + waterproofs']
    ],
    days: [
      { name: 'Monday', focus: 'Seeds and the letter S', sessions: [
        S('Literacy', 'Letter S hunt', 'Draw a big S in a tray of sand or rice. Find things around the house that start with S. Draw three of them.', 15, ['Sand or rice tray', 'Crayons'], 'Finger-trace big S shapes in the tray. Scribbles count!'),
        S('Maths', 'Counting treasures', 'Count pebbles or acorns into egg-box cups, 1 to 10. Say each number out loud as it goes in.', 15, ['Pebbles/acorns', 'Egg box', 'Number cards'], 'Count to 5 and pop one in each cup. Clap each number.'),
        S('Science', 'Plant a seed', 'Plant a seed each. Talk about what seeds need (water, light, soil). Draw what you think it will look like next week.', 20, ['Seeds', 'Pots + compost', 'Journal'], 'Colbie presses the seed in and does the watering.'),
        S('Story', '"The Tiny Seed" by Eric Carle', 'Read together. What happened first, next, last? Which part of the journey was scariest?', 10, [], 'Spot the seed on each page.'),
        S('Move', 'Tree pose and flower stretch', 'Try Cosmic Kids Yoga "Jack and the Beanstalk" on YouTube, or just grow from a tiny seed to a giant tree together.', 10, [], 'Join in however wobbly it is.')
      ]},
      { name: 'Tuesday', focus: 'Leaves, patterns and prints', sessions: [
        S('Maths', 'Leaf sorting and patterns', 'Sort leaves by size, shape or colour. Make a pattern (big, small, big, small) and say it out loud.', 15, ['Leaves'], 'Sort into big and small. Copy a simple leaf–stick–leaf–stick pattern.'),
        S('Literacy', 'Build a word', 'Make simple 3-letter words with magnetic letters: sun, cat, dog. Sound out each letter, then blend them.', 15, ['Magnetic letters'], 'Name the letters she knows and find her own initial.'),
        S('Creative', 'Leaf printing', 'Paint the underside of a leaf and press it onto paper. Make a seasons tree: green, orange, bare.', 25, ['Leaves', 'Paint', 'Paper', 'Aprons'], 'Pure messy joy, works at any age.'),
        S('Story', '"Leaf Man" by Lois Ehlert', 'Read it, then make your own leaf man from today’s leaves.', 10, [], ''),
        S('Outdoor', 'Garden scavenger hunt', 'Find something smooth, rough, alive, brown, tiny. Tick them off a picture checklist.', 15, ['Bag or bucket'], 'Hold the bag and shout “found it!”')
      ]},
      { name: 'Wednesday', focus: 'Looking after nature', sessions: [
        S('Literacy', 'My nature journal', 'Look at the seed pot. Has anything changed? Draw it and write (or tell you) one sentence.', 15, ['Journal', 'Magnifying glass'], 'Draw the pot and “write” in her own squiggles.'),
        S('Maths', 'Measuring with nature', 'How many leaves long is the table? How many pebbles heavy is a pine cone? Guess first, then check.', 15, ['Leaves', 'Pebbles'], 'Line the leaves up and count together.'),
        S('PSHE', 'Build a bug hotel', 'Stuff cardboard tubes and sticks into a box or old plant pot. Find a quiet corner of the garden for it.', 25, ['Cardboard tubes', 'Sticks', 'Moss', 'String'], 'Stuffing the tubes is her job.'),
        S('Story', '"Superworm" by Julia Donaldson', 'Read it and make up worm voices. What other minibeasts might move into your hotel?', 10, [], ''),
        S('Music', 'Weather orchestra', 'Rain = fingertips on the table, wind = whooshing voices, thunder = stamping feet. Make up a weather song.', 10, [], 'Be the thunder!')
      ]},
      { name: 'Thursday', focus: 'Shapes, rhymes and a splash', sessions: [
        S('Maths', 'Shape hunt', 'Find circles, squares and triangles in the garden or house. Count sides and corners.', 15, ['Clipboard', 'Pencil'], 'Point and name the shapes.'),
        S('Literacy', 'Nature rhymes', 'sun/fun, tree/bee, mud/bud. Clap the beats, then make up a silly rhyme.', 15, [], 'Finish the rhyme: “tree and … bee!”'),
        S('Science', 'Sink or float?', 'Collect a leaf, stick, pebble, acorn and feather. Guess, then test each in a bowl of water.', 20, ['Bowl of water', 'Natural objects', 'Towel'], 'Drop things in and shout sink or float.'),
        S('Story', '"The Gruffalo" by Julia Donaldson', 'Retell it with voices. Draw your favourite character.', 10, [], ''),
        S('Move', 'Animal-move obstacle course', 'Hop like a frog, wriggle like a worm, flap like a bird. Build a course from cushions and hoops.', 15, ['Cushions', 'Hoops or rope'], '')
      ]},
      { name: 'Friday', focus: 'Woodland walk', sessions: [
        S('Out', 'Get ready', 'Pack the bag together. Talk about what you might find. Look at the bingo card and guess what you will tick off.', 15, ['Bingo cards', 'Backpack'], 'Choose her own snack for the bag.'),
        S('Out', 'Nature detectives in the woods', 'Complete the bingo, do leaf rubbings, count different trees, look under a log for minibeasts, collect a little treasure bag.', 120, ['Wellies', 'Magnifying glass', 'Bug pot', 'Camera'], 'Carry her own treasure bag.'),
        S('Creative', 'Treasure table', 'Lay out your finds. Draw your favourite and say one sentence about it. Stick things in your journals.', 20, ['Finds', 'Journal', 'Glue'], 'Arrange her treasures however she likes.')
      ], outing: {
        emoji: '🥾', title: 'Woodland walk', where: 'Local woods, nature reserve or country park',
        desc: 'Look, listen, touch, collect. Aim for a slow walk with lots of stopping.',
        bring: ['Wellies + waterproofs', 'Snacks and water', 'Magnifying glass', 'Paper bag each for treasures', 'Bingo cards', 'Spare socks'],
        bingo: [['🍂', 'A leaf'], ['🪵', 'A stick'], ['🐛', 'A minibeast'], ['🌰', 'An acorn or conker'], ['🍄', 'A mushroom'], ['🐦', 'A bird'], ['🪶', 'A feather'], ['🌲', 'A pine cone'], ['💧', 'A puddle']]
      }}
    ]
  },

  /* ───────────── WEEK 2 ───────────── */
  {
    id: 2, emoji: '🐾', title: 'Animals & Habitats', color: '#E8782E', tint: '#FDEBDD',
    blurb: 'Farm, wild and pet animals, what they eat and where they live.',
    tip: 'If a farm is too far, a pet shop, garden centre fish tank, duck pond or even a dog walk in the park works just as well. Real-life looking is the point.',
    materials: [
      ['🐶', 'Toy animals (any!)'], ['🖨️', 'Printed or cut-out animal pictures'], ['✂️', 'Safety scissors + glue'], ['🍽️', 'Paper plates ×4'],
      ['🎨', 'Paint, brushes, googly eyes'], ['📌', 'Split pins (frog wheel)'], ['🥁', 'Pots + wooden spoons'], ['🛏️', 'Beanbags or rolled socks'],
      ['📄', 'Large paper for habitat sorting'], ['📒', 'Folded-paper “noisy animals” books'], ['📝', 'Tally chart (print from the app)'], ['📸', 'Camera or phone for the farm']
    ],
    days: [
      { name: 'Monday', focus: 'Sorting animals', sessions: [
        S('Literacy', 'Letter A and animal sounds', 'Trace A. Match animal pictures to their first sounds. Ant, alligator, antelope!', 15, ['Animal pictures'], 'Say each animal’s noise.'),
        S('Maths', 'How many legs?', 'People have 2, dogs have 4, insects 6, spiders 8. Count out counters to match. Who has more, who has fewer?', 15, ['Counters or buttons', 'Toy animals'], 'Count the legs on a toy animal.'),
        S('Science', 'Where do they live?', 'Sort animal pictures into farm, jungle, sea and garden on a big sheet. Why does each live there?', 20, ['Pictures', 'Large paper', 'Glue'], 'Match the animal to its home.'),
        S('Story', '"Dear Zoo" by Rod Campbell', 'Lift the flaps and name each animal. Which would be the best pet and why?', 10, [], 'Her favourite flap book moment.'),
        S('Move', 'Animal moves', 'Call out an animal and everyone moves like it. Slither, gallop, hop, waddle. Freeze on “stop”.', 10, [], '')
      ]},
      { name: 'Tuesday', focus: 'What animals eat', sessions: [
        S('Science', 'Who eats what?', 'Rabbits eat plants, lions eat meat, bears eat both. Match food pictures to animals.', 15, ['Food + animal pictures'], 'Which animal would like this carrot?'),
        S('Maths', 'Spots and stripes patterns', 'Look at giraffe spots and zebra stripes. Make an ABAB pattern with coloured shapes or sponge stamps.', 15, ['Shapes or sponges', 'Paint', 'Paper'], 'Stamp freely, patterns come later.'),
        S('Creative', 'Paper plate animal', 'Choose an animal and make it from a paper plate, paint, and card ears and tails.', 25, ['Paper plates', 'Paint', 'Card', 'Googly eyes'], 'Pick the colours and stick on the eyes.'),
        S('Story', '"A Squash and a Squeeze" by Julia Donaldson', 'Read it. How many animals are in the house now?', 10, [], ''),
        S('Outdoor', 'Garden wildlife watch', 'Sit still for 5 minutes. Tally every creature you see: birds, bugs, worms.', 15, ['Tally chart', 'Pencil'], 'Be the lookout and point.')
      ]},
      { name: 'Wednesday', focus: 'Noisy animals', sessions: [
        S('Literacy', 'Noisy animals book', 'Fold paper into a little book. Draw an animal and write its noise: moo, woof, hiss, roar.', 20, ['Paper', 'Pencils'], 'Draw it and make the noise.'),
        S('Maths', 'Adding animals', '3 ducks + 2 more ducks = ? Use toy animals, then write 3 + 2 = 5.', 15, ['Toy animals', 'Whiteboard'], 'Count the toys into a pile.'),
        S('Music', 'Old MacDonald band', 'Sing farm songs and add a band: pots, spoons and shakers.', 15, ['Pots', 'Spoons'], 'Loudest drummer wins!'),
        S('Story', '"Zog" by Julia Donaldson', 'Read it. Who helped Zog and why?', 10, [], ''),
        S('Move', 'Zookeeper course', 'Deliver beanbag “food” to each animal den by hopping, crawling and balancing.', 15, ['Beanbags', 'Hoops'], '')
      ]},
      { name: 'Thursday', focus: 'Frogs and caring for animals', sessions: [
        S('Maths', 'Biggest to smallest', 'Order animal pictures from biggest to smallest: whale, elephant, dog, mouse, ant.', 15, ['Animal cards'], 'Which one is the biggest?'),
        S('Literacy', 'My favourite animal', 'Draw it and write a caption. Even “a bg dog” is brilliant phonetic writing!', 15, ['Paper', 'Pencils'], 'Draw it and tell you the caption.'),
        S('PSHE', 'Looking after animals', 'What do pets need? Food, water, a home, exercise and love. Draw what your dream pet needs.', 15, [], ''),
        S('Story', '"Tad" by Benji Davies', 'A frog life-cycle story. Can you remember the stages?', 10, [], ''),
        S('Creative', 'Frog life-cycle wheel', 'Make a spinning wheel: egg, tadpole, froglet, frog. Fix with a split pin.', 25, ['Paper plate', 'Split pin', 'Pens'], 'Colour in the frog.')
      ]},
      { name: 'Friday', focus: 'Farm visit', sessions: [
        S('Out', 'Questions for the farmer', 'Draw or write three questions to ask. What do cows eat? Where do the eggs come from?', 15, ['Paper'], 'Choose one question to ask.'),
        S('Out', 'Farm explorers', 'Meet the animals, tick off the bingo, feed if allowed. Sketch one real animal.', 120, ['Bingo cards', 'Sketchbook', 'Camera'], ''),
        S('Literacy', 'Farm diary', '“Today I saw… My favourite was… because…” Draw it and tell someone at home.', 20, ['Journal'], 'Draw her favourite animal.')
      ], outing: {
        emoji: '🐄', title: 'Farm visit', where: 'Local farm, city farm, petting zoo or farm park',
        desc: 'Ask questions, watch closely, and let them feed animals if you can.',
        bring: ['Wellies', 'Hand wipes (and sanitiser)', 'Snacks + water', 'Bingo cards', 'Notebook and pencil', 'Spare clothes'],
        bingo: [['🐄', 'A cow'], ['🐑', 'A sheep'], ['🐓', 'A chicken'], ['🐖', 'A pig'], ['🐴', 'A horse'], ['🦆', 'A duck'], ['🚜', 'A tractor'], ['🌾', 'Hay or straw'], ['🐐', 'A goat']]
      }}
    ]
  },

  /* ───────────── WEEK 3 ───────────── */
  {
    id: 3, emoji: '🌍', title: 'Our World & People', color: '#2F7DE1', tint: '#E4EFFC',
    blurb: 'Maps, countries, jobs, money, then and now.',
    tip: 'Everything here links to real life: post a real postcard, spend real coins, find where relatives live on a map. A library card for each girl is one of the best free tools you can have.',
    materials: [
      ['🗺️', 'World map or globe'], ['🏷️', 'Small stickers to mark places'], ['🪙', 'Real coins (1p, 2p, 5p, 10p, 50p, £1)'], ['🏪', 'Toy shop items + price tags'],
      ['✉️', 'Postcards or paper + stamps ×2'], ['📷', 'Pictures of old vs new transport'], ['🖍️', 'Large paper + colouring pens'], ['🌡️', 'Toy or real thermometer'],
      ['🥭', 'A tropical fruit (mango, banana…)'], ['🫓', 'World snacks (pitta, rice crackers, oatcakes)'], ['📏', 'Long strip of paper for timelines'], ['💳', 'Library cards (get them on Friday)']
    ],
    days: [
      { name: 'Monday', focus: 'Maps and where we are', sessions: [
        S('Literacy', 'Letter W', 'Trace W. Find the word “world” on a map. Make a W word wall: water, wind, whale, window.', 15, ['Letter cards', 'Map'], 'Wave W shapes in the air.'),
        S('Geography', 'Where in the world?', 'Find the UK on a map. Put a sticker where you live and where family or friends live. Which is furthest away?', 15, ['World map', 'Stickers'], 'Stick the stickers.'),
        S('Geography', 'Map of our home', 'Draw your home from above, as a bird would see it. Add a key for the symbols.', 20, ['Large paper', 'Pencils'], 'Draw her bedroom.'),
        S('Story', '"Handa’s Surprise" by Eileen Browne', 'It is set in Kenya. Find Kenya on the map. How is Handa’s day like yours?', 10, [], ''),
        S('Creative', 'Tropical fruit tasting', 'Try a fruit from the story. Describe it: sweet, sour, juicy, squishy?', 15, ['Fruit', 'Plates'], 'Describe it in her own words.')
      ]},
      { name: 'Tuesday', focus: 'Jobs and money', sessions: [
        S('PSHE', 'Jobs people do', 'Match jobs to tools: baker and rolling pin, doctor and stethoscope. What jobs help our town?', 15, ['Picture cards'], 'What does a vet use?'),
        S('Maths', 'Coin shop', 'Look at real coins. Sort them, then play shop with price tags from 1p to 10p.', 20, ['Coins', 'Toy shop items', 'Price tags'], 'Hand over coins and say thank you.'),
        S('Literacy', 'Write a postcard', 'Write or dictate a message to a grandparent or friend. “Dear… love from…”. Post it for real!', 20, ['Postcards', 'Stamps'], 'Draw the picture side.'),
        S('Story', '"Penguin" by Polly Dunbar', 'Read it. How do you know how Ben is feeling?', 10, [], ''),
        S('Move', 'Role-play town', 'Set up a post office, vet or café at home and take turns being customer and worker.', 20, ['Toys', 'Dressing-up'], '')
      ]},
      { name: 'Wednesday', focus: 'Then and now', sessions: [
        S('History', 'Then and now: transport', 'Compare a horse and cart to a car, a steam train to a modern train. What is the same, what changed?', 15, ['Pictures'], 'Which one would you ride?'),
        S('Maths', 'My timeline', 'Make a strip: born, 1st birthday, 2nd… now, school. Count the years. Talk about before and after.', 15, ['Paper strip', 'Photos (optional)'], 'Put the photos in order.'),
        S('Creative', 'Design a family flag', 'Look at some flags. Design one for your family using colours and symbols that mean something to you.', 25, ['Card', 'Paint or pens'], 'Choose her favourite colour.'),
        S('Story', '"The Snail and the Whale" by Julia Donaldson', 'A journey story. Trace the trip on a map.', 10, [], ''),
        S('Outdoor', 'Street signs walk', 'Walk round the block spotting signs, numbers, street names and logos. Take photos.', 20, ['Camera or phone'], 'Spot the red things.')
      ]},
      { name: 'Thursday', focus: 'Land, sea and sounds', sessions: [
        S('Geography', 'Land, water, sky', 'Colour a blank world map: blue for water, green for land. Is there more land or more water?', 15, ['Blank map', 'Blue + green pencils'], 'Colour the sea.'),
        S('Maths', 'Hot and cold', 'Sort weather pictures from coldest to hottest. Use a thermometer in warm and cool places.', 15, ['Thermometer', 'Weather pictures'], 'Hot or cold?'),
        S('Music', 'Songs from around the world', 'Sing “Frère Jacques” and “Head, Shoulders, Knees and Toes” in Spanish (Cabeza, hombros, rodillas y pies).', 15, [], 'Just do the actions.'),
        S('Story', '"Whatever Next!" by Jill Murphy', 'Baby Bear goes to the moon. Look at a photo of Earth from space.', 10, [], ''),
        S('Cooking', 'World snack tasting', 'Try pitta bread, rice crackers or oatcakes. Where in the world does each come from?', 15, ['Snacks'], '')
      ]},
      { name: 'Friday', focus: 'Library visit', sessions: [
        S('Out', 'Book wish list', 'Draw three things you want to find books about. Space? Unicorns? Diggers?', 10, ['Paper'], 'Draw one thing she would like.'),
        S('Out', 'Library adventure', 'Sign up for library cards, choose 3 books each, join a story session if there is one. Find the bingo things.', 90, ['Bingo cards', 'Bag for books'], 'Choose her own books.'),
        S('Story', 'Start a borrowed book', 'Read one together and fill in a reading log: title, what happened, how many stars.', 20, ['Reading log (print)'], 'Sticker for each book.')
      ], outing: {
        emoji: '📚', title: 'Library visit', where: 'Your local library (or a small museum)',
        desc: 'Public libraries are free. Get a card each, borrow books, and ask the librarian one question.',
        bring: ['Tote bag for books', 'Proof of address if joining', 'Bingo cards', 'Snacks for after'],
        bingo: [['📕', 'A red book'], ['🐾', 'A book about animals'], ['🧚', 'A fairy tale'], ['🔢', 'A counting book'], ['🌍', 'A map or globe'], ['🛋️', 'A cosy reading spot'], ['🤫', 'A “quiet” sign'], ['🧑‍🏫', 'A librarian'], ['🎨', 'A bright cover']]
      }}
    ]
  },

  /* ───────────── WEEK 4 ───────────── */
  {
    id: 4, emoji: '🍎', title: 'Food, Cooking & Me', color: '#E0A100', tint: '#FDF1CF',
    blurb: 'Where food comes from, baking, bodies and a supermarket mission.',
    tip: 'Cooking is the richest session of the month: maths, science, reading and life skills in one. Let them do real jobs, even if it gets messy.',
    materials: [
      ['🍎', 'Mixed fruit and veg to taste and print with'], ['⚖️', 'Kitchen scales + measuring jugs'], ['🧁', 'Baking ingredients (see the recipe you pick)'], ['👩‍🍳', 'Two child-size aprons'],
      ['🖨️', 'Eatwell Guide picture (print or from nhs.uk)'], ['🎨', 'Paint for veg printing'], ['🧾', 'Shopping list paper'], ['📏', 'Tape measure'],
      ['🪙', 'Coins for paying at the shop'], ['🌿', 'Herb seeds (basil or cress) + pot'], ['🧴', 'Roll of paper for body outline'], ['⏱️', 'Timer or phone clock']
    ],
    days: [
      { name: 'Monday', focus: 'Where food comes from', sessions: [
        S('Science', 'The Eatwell Guide', 'Look at the five food groups. Sort pictures of food onto a plate. Which groups do we eat most of?', 20, ['Eatwell picture', 'Food cut-outs', 'Glue'], 'Find the fruit.'),
        S('Literacy', 'Letter F foods', 'Trace F. Make a silly list of foods starting with F: fizzy fish fingers, fantastic figs.', 15, ['Paper', 'Pencils'], 'Say the F sound together.'),
        S('Science', 'Field to plate', 'Bread comes from wheat, then flour, then the baker. Put picture cards of a food’s journey in order.', 15, ['Picture cards'], 'Which comes first?'),
        S('Story', '"The Very Hungry Caterpillar" by Eric Carle', 'Count the food and name the days of the week. What should he have eaten instead of cake?', 10, [], ''),
        S('Creative', 'Fruit and veg printing', 'Cut a pepper, apple or potato and use it as a stamp. Make patterns and pictures.', 20, ['Halved fruit/veg', 'Paint', 'Paper'], 'Stamp stamp stamp!')
      ]},
      { name: 'Tuesday', focus: 'Baking day', sessions: [
        S('Maths', 'Weigh and measure', 'Weigh flour and sugar in grams on the scales. Fill jugs to the line. Which is heavier?', 15, ['Scales', 'Jug', 'Rice or flour'], 'Pour and spot the number.'),
        S('Cooking', 'Bake something simple', 'Biscuits or banana muffins: weigh, mix, spoon, bake. Talk through first, then, next, finally.', 40, ['Ingredients', 'Bowls', 'Aprons'], 'Stir, tip in, decorate.'),
        S('Literacy', 'Draw our recipe', 'Draw each step of what you did and write one word or sentence for each.', 15, ['Paper', 'Pencils'], 'Draw the best step.'),
        S('Story', '"Stone Soup" (traditional tale)', 'What would you put in your own stone soup?', 10, [], ''),
        S('Cooking', 'Taste test', 'Eat what you made. Smell, texture, taste: give it a star rating. Would you change anything?', 15, [], '')
      ]},
      { name: 'Wednesday', focus: 'My amazing body', sessions: [
        S('Science', 'Body outline', 'Draw round a lying-down child on big paper. Label head, knees, toes, elbows, heart.', 20, ['Roll of paper', 'Pens'], 'Lie down to be drawn round!'),
        S('Maths', 'Measuring me', 'Measure height, hand span and foot length. Compare with a grown-up. Whose foot is longest?', 15, ['Tape measure', 'Paper'], 'Stand tall against the wall.'),
        S('Science', 'Heartbeat test', 'Feel your pulse. Do 20 star jumps and feel it again. Why is it faster?', 15, ['Timer'], 'Hands on chest and jump.'),
        S('Story', '"Funnybones" by Janet and Allan Ahlberg', 'Skeletons and silliness. How many bones can you name?', 10, [], ''),
        S('Move', 'Dance, then breathe', 'Dance to a favourite song. Then lie down for five slow breaths and notice five things you can hear.', 15, [], '')
      ]},
      { name: 'Thursday', focus: 'Menus, lists and herbs', sessions: [
        S('Literacy', 'Describe a favourite food', 'Use all five senses: how does it look, smell, feel, taste, and sound when you eat it?', 15, ['The actual food!'], 'Tell you what it tastes like.'),
        S('Maths', 'Shopping list maths', 'Write tomorrow’s shopping list together. Count items. Which is dearer, apples or grapes?', 15, ['Paper', 'Pencil'], 'Choose one item to find.'),
        S('Creative', 'Design a restaurant menu', 'Draw dishes, name them and add pretend prices. Then play restaurants.', 25, ['Folded card', 'Pens'], 'Draw her dream pizza.'),
        S('Story', '"Eat Your Peas" by Kes Gray', 'A funny negotiation. Which vegetable do you like least? Can you try one new one?', 10, [], ''),
        S('Outdoor', 'Plant herbs', 'Sow basil, mint or cress. Talk about how herbs make food taste. Link back to your Week 1 seeds.', 20, ['Herb seeds', 'Pots', 'Watering can'], 'Water the pots.')
      ]},
      { name: 'Friday', focus: 'Supermarket mission', sessions: [
        S('Out', 'Finish the shopping list', 'Write or copy the list. Give each girl three things to find.', 15, ['List', 'Pencil'], 'Her own three items.'),
        S('Out', 'Supermarket mission', 'Find your items, count fruit into bags, read one label, find a fruit from another country, and pay for one thing with coins.', 60, ['List', 'Coins', 'Bingo cards'], 'Put things in the trolley.'),
        S('Cooking', 'Make lunch together', 'Use something from the shop to make lunch: wraps, fruit salad or sandwiches. Celebrate a month of learning.', 30, ['Shopping'], 'Spread, sprinkle, stir.')
      ], outing: {
        emoji: '🛒', title: 'Supermarket mission', where: 'Local supermarket, greengrocer or market',
        desc: 'Turn the weekly shop into a quest. Each girl gets a job and a few items to find.',
        bring: ['Shopping list they wrote', 'Pencils', 'Coins for paying', 'Bingo cards', 'Bags'],
        bingo: [['🍎', 'A red fruit'], ['🥕', 'An orange veg'], ['🥛', 'Milk'], ['🍞', 'Bread'], ['🧀', 'Cheese'], ['🍌', 'Fruit from far away'], ['9️⃣', 'A price with a 9'], ['🛒', 'A trolley'], ['🐟', 'Fish']]
      }}
    ]
  }
];

// Gentle ideas for days when the plan isn't working
export const RAINY_DAY = [
  ['🏕️', 'Build a den and read inside it'], ['🧁', 'Bake something, any recipe counts'], ['🧩', 'Puzzles or board games'],
  ['🎨', 'Big paper, big paint, no rules'], ['💃', 'Dance party then quiet breathing'], ['🛁', 'Water play in the bath or sink'],
  ['📚', 'Library books on the sofa with blankets'], ['🎭', 'Dressing up and make-believe shops']
];

// Which activities are "core" each day (about 30-50 minutes). The rest are shown as "if you fancy it".
// Order matches the days: Monday to Friday, listing session positions.
const CORE = {
  1: [[1, 2, 3], [1, 2, 3], [0, 2, 3], [0, 2, 3], [1]],
  2: [[1, 2, 3], [0, 2, 3], [0, 2, 3], [1, 3, 4], [1]],
  3: [[1, 3, 4], [1, 2, 3], [0, 2, 3], [1, 2, 3], [1]],
  4: [[0, 3, 4], [1, 3], [0, 2, 3], [1, 3, 4], [1]]
};
WEEKS.forEach(w => w.days.forEach((d, di) => d.sessions.forEach((s, si) => { s.core = CORE[w.id][di].includes(si); })));
