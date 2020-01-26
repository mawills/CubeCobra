import { CubeCard } from '../types';
const shuffleSeed: any = require('shuffle-seed');

const adminname = 'Dekkaru';

// TODO: search for references to these functions and make sure renamed

/**
 * Determine if a string contains profanity and returns true/false.
 *
 * @param {string} text
 * @returns {boolean}
 */
function hasProfanity(text: string): boolean {
  if (!text) return false;

  const Filter = require('bad-words');
  let filter = new Filter();
  const removeWords: string[] = ['hell', 'sadist', 'God'];
  filter.removeWords(...removeWords);

  return filter.isProfane(text.toLowerCase());
}

/**
 * Creates and returns a randomized string to use as an edit token.
 *
 * @return {string}
 */
function generateEditToken(): string {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
}

/**
 * Converts a base to number to a base 36 number string.
 *
 * @param {number} num
 * @returns {string}
 */
function toBase36(num: number): string {
  return num.toString(36);
}

/**
 * Converts a base 36 number string into a base 10 number.
 *
 * @param {string} str
 * @returns {number}
 */
function fromBase36(str: string): number {
  if (!str) return 0;
  return parseInt(str, 36);
}

/**
 *
 * @param obj
 * @param {string} word
 * @returns {void}
 */
function addWordToTree(obj, word: string) {
  if (word.length <= 0) {
    return;
  } else if (word.length == 1) {
    if (!obj[word.charAt(0)]) {
      obj[word.charAt(0)] = {
        $: {},
      };
    } else {
      obj[word.charAt(0)]['$'] = {};
    }
  } else {
    let character = word.charAt(0);
    word = word.substr(1, word.length);
    if (!obj[character]) {
      obj[character] = {};
    }
    addWordToTree(obj[character], word);
  }
}

/**
 * Inserts a provided string into its place in a sorted (increasing) array.
 * TODO: update test to use strings
 *
 * @param {string} value
 * @param {string[]} array
 * @param {string} startIndex
 * @param {string} endIndex
 * @returns {void}
 */
function binaryInsert(value: string, array: string[], startIndex?: number, endIndex?: number): void {
  const length = array.length;
  const start = typeof startIndex != 'undefined' ? startIndex : 0;
  const end = typeof endIndex != 'undefined' ? endIndex : length - 1;
  const middle = start + Math.floor((end - start) / 2);

  if (length == 0) {
    array.push(value);
    return;
  }

  if (value > array[end]) {
    array.splice(end + 1, 0, value);
    return;
  }

  if (value < array[start]) {
    array.splice(start, 0, value);
    return;
  }

  if (start >= end) {
    return;
  }

  if (value < array[middle]) {
    binaryInsert(value, array, start, middle - 1);
    return;
  }

  if (value > array[middle]) {
    binaryInsert(value, array, middle + 1, end);
    return;
  }
}

/**
 *
 * @param card_details
 * @param tags
 */
function newCard(card_details, tags): CubeCard {
  return {
    tags: Array.isArray(tags) ? tags : [],
    status: 'Owned',
    colors: card_details.color_identity,
    cmc: card_details.cmc,
    cardID: card_details._id,
    type_line: card_details.type,
    addedTmsp: new Date(),
    finish: 'Non-foil',
  };
}

function addCardToCube(cube, card_details, tags) {
  cube.cards.push(newCard(card_details, tags));
}

function getCardImageURL(card) {
  return card.imgUrl || card.details.image_normal;
}

function fromEntries(entries) {
  const obj = {};
  for (const [k, v] of entries) {
    obj[k] = v;
  }
  return obj;
}

async function addNotification(user, from, url, text) {
  if (user.username == from.username) {
    return; //we don't need to give notifications to ourselves
  }

  user.notifications.push({
    user_from: from._id,
    user_from_name: from.username,
    url: url,
    date: new Date(),
    text: text,
  });
  user.old_notifications.push({
    user_from: from._id,
    user_from_name: from.username,
    url: url,
    date: new Date(),
    text: text,
  });
  while (user.old_notifications.length > 200) {
    user.old_notifications = user.old_notifications.slice(1);
  }
  await user.save();
}

function wrapAsyncApi(route) {
  return (...args) => {
    try {
      return route(...args);
    } catch (err) {
      console.error(err);
      var res: any;
      res.status(500).send({
        success: 'false',
        message: 'Internal server error',
      });
    }
  };
}

function handleRouteError(res, req, err, reroute) {
  console.error(err);
  req.flash('danger', err.message);
  res.redirect(reroute);
}

var exports = {
  shuffle: function(array, seed) {
    if (!seed) {
      seed = Date.now();
    }
    return shuffleSeed.shuffle(array, seed);
  },
  turnToTree: function(arr) {
    var res = {};
    arr.forEach(function(item, index) {
      addWordToTree(res, item);
    });
    return res;
  },
  binaryInsert,
  newCard,
  addCardToCube,
  getCardImageURL,
  arraysEqual: function(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  },
  CSVtoArray: function(text) {
    let ret = [''],
      i = 0,
      p = '',
      s = true;
    for (let l in text) {
      l = text[l];
      if ('"' === l) {
        s = !s;
        if ('"' === p) {
          ret[i] += '"';
          l = '-';
        } else if ('' === p) {
          l = '-';
        }
      } else if (s && ',' === l) {
        l = ret[++i] = '';
      } else {
        ret[i] += l;
      }
      p = l;
    }
    return ret;
  },
  generate_edit_token: generateEditToken,
  toBase36,
  from_base_36: fromBase36,
  has_profanity: hasProfanity,
  fromEntries,
  isAdmin: function(user) {
    return user && user.username == adminname;
  },
  addNotification,
  wrapAsyncApi,
  handleRouteError,
};

module.exports = exports;
