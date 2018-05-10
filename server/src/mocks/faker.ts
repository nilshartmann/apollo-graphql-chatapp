import lorems from "./lorems";
import users from "./users";
const CHANNELS = [
  {
    title: "Bacon",
    lorems: lorems.bacon
  },
  {
    title: "Coffee tipps",
    lorems: lorems.coffee
  },
  {
    title: "Philosophy",
    lorems: lorems.nietzsche
  },
  {
    title: "Office Talks",
    lorems: lorems.office
  },
  {
    title: "News from the Agency",
    lorems: lorems.agency
  },
  {
    title: "CAAATS! 😻😻",
    lorems: lorems.cats
  },
  {
    title: "Mystery & Aliens",
    lorems: lorems.aliens
  }
];

import faker from "faker";

faker.seed(666);

const arrayElements = function<T>(array: T[], count?: number) {
  array = array || ["a", "b", "c"];

  if (typeof count !== "number") {
    count = faker.random.number({ min: 1, max: array.length });
  } else if (count > array.length) {
    count = array.length;
  } else if (count < 0) {
    count = 0;
  }

  var arrayCopy = array.slice();
  var countToRemove = arrayCopy.length - count;
  for (var i = 0; i < countToRemove; i++) {
    var indexToRemove = faker.random.number({ max: arrayCopy.length - 1 });
    arrayCopy.splice(indexToRemove, 1);
  }

  return arrayCopy;
};

const fakeChannels = CHANNELS.map((c, ix) => {
  const owner = faker.random.arrayElement(users);
  // make sure owner is contained in list and is first one in list
  const members = [owner, ...arrayElements(users).filter(u => u.id !== owner.id)];
  return {
    id: `c${ix + 1}`,
    title: c.title,
    owner,
    members,
    messages: faker.helpers
      .shuffle(c.lorems)
      .map((lorem, mix) => ({
        id: `m${ix + 1}${mix + 1}`,
        author: faker.random.arrayElement(members),
        date: faker.date.past(0.2, "2018-04-29T08:59:42+01:00").toISOString(),
        text: lorem
      }))
      .sort((m1, m2) => {
        const r = new Date(m1.date).getTime() - new Date(m2.date).getTime();
        if (r === 0) {
          return m1.id.localeCompare(m2.id);
        }
        return r;
      })
  };
});

// console.log(JSON.stringify(fakeChannels, null, 2));

export default fakeChannels;
