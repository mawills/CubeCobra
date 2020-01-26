/**
 * Structure of a card that is in the cards array property of a cube in the database.
 */
export interface CubeCard {
  tags: string[];
  finish: string;
  colors: string;
  _id: string;
  addedTmsp: Date;
  cardID: string;
  cmc: number;
  status: string;
  type_line: string;
}

// TODO: figure out what this is
interface CubeCategoryPrefix {}

// TODO: figure out what this is
interface CubeDefaultSort {}

// TODO: figure out what this is
interface CubeUserFollowing {}

/**
 * Structure of a cube as it is stored in the database.
 */
export interface Cube {
  _id: string;
  isListed: boolean;
  privatePrices: boolean;
  isFeatured: boolean;
  overrideCategory: boolean;
  categoryOverride: string;
  categoryPrefixes: CubeCategoryPrefix[];
  tags: string[];
  decks: string[];
  default_sorts: CubeDefaultSort[];
  users_following: CubeUserFollowing[];
  card_count: number;
  cards: CubeCard[];
  date_updated: Date;
  description: string;
  descriptionhtml: string;
  image_artist: string;
  image_name: string;
  image_uri: string;
  name: string;
  numDecks: number;
  owner: string;
  owner_name: string;
  shortID: string;
  type: string;
  updated_string: string;
  urlAlias: string;
  maybe: CubeCard[];
  tag_colors: string[];
  draft_formats: CustomFormat[];
  __v: number;
}

export interface CustomFormat {
  id: string;
  title: string;
  multiples: boolean;
  html: string;
  packs: string[][];
}
