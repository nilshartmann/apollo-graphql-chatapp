import lorems from "./lorems";
import users from "./users";

const channels = [
  {
    id: "c1",
    title: "Bacon",
    members: [users[0], users[1], users[2]],
    messages: [
      { id: "m1", author: users[0], date: "2018-01-03T09:12:31+01:00", text: lorems.bacon[0] },
      { id: "m2", author: users[5], date: "2018-01-04T09:12:31+01:00", text: lorems.bacon[1] },
      { id: "m3", author: users[1], date: "2018-01-05T09:17:31+01:00", text: lorems.bacon[2] },
      { id: "m4", author: users[3], date: "2018-01-05T10:13:31+01:00", text: lorems.bacon[3] },
      { id: "m5", author: users[2], date: "2018-01-06T11:15:31+01:00", text: lorems.bacon[4] }
    ]
  },
  {
    id: "c2",
    title: "Coffee",
    members: [users[1], users[3], users[4], users[5]],
    messages: [
      { id: "m21", author: users[3], date: "2018-02-03T09:12:31+01:00", text: lorems.coffee[0] },
      { id: "m22", author: users[4], date: "2018-02-04T09:12:31+01:00", text: lorems.coffee[1] },
      { id: "m23", author: users[4], date: "2018-02-05T09:17:31+01:00", text: lorems.coffee[2] },
      { id: "m24", author: users[2], date: "2018-02-05T10:13:31+01:00", text: lorems.coffee[3] },
      { id: "m25", author: users[1], date: "2018-02-06T11:15:31+01:00", text: lorems.coffee[4] },
      { id: "m26", author: users[2], date: "2018-02-06T11:16:24+01:00", text: lorems.coffee[5] },
      { id: "m27", author: users[3], date: "2018-02-06T11:21:27+01:00", text: lorems.coffee[6] }
    ]
  },
  {
    id: "c3",
    title: "Philosophy",
    members: [users[2], users[4], users[6], users[7], users[1]],
    messages: [
      { id: "m31", author: users[1], date: "2018-03-03T09:12:32+01:00", text: lorems.coffee[0] },
      { id: "m32", author: users[2], date: "2018-02-01T09:12:41+01:00", text: lorems.coffee[1] },
      { id: "m33", author: users[7], date: "2018-02-03T09:19:52+01:00", text: lorems.coffee[2] },
      { id: "m34", author: users[4], date: "2018-02-03T10:13:37+01:00", text: lorems.coffee[3] },
      { id: "m35", author: users[7], date: "2018-02-04T11:15:19+01:00", text: lorems.coffee[4] },
      { id: "m36", author: users[7], date: "2018-02-06T11:16:08+01:00", text: lorems.coffee[5] }
    ]
  }
];

export default channels;
