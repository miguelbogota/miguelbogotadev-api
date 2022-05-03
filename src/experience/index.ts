import { aosp } from './aosp';
import { clothingPark } from './clothing-park';
import { cryptoJune } from './crypto-june';
import { galtex } from './galtex';
import { miguelbogotadevV1 } from './miguelbogotadev-v1';
import { nvcMovies } from './nvc-movies';
import { onWatchUs } from './on-watch-us';
import { reyWriter } from './rey-writer';

/**
 * List with all the experiences sorted by started date.
 */
const experience = [
  // Add new experiences at the top.
  aosp,
  clothingPark,
  cryptoJune,
  galtex,
  miguelbogotadevV1,
  nvcMovies,
  onWatchUs,
  reyWriter,
].sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

export default experience;
