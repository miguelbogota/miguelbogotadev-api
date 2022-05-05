import { aosp } from './aosp';
import { aospDealers } from './aosp-dealers';
import { clothingPark } from './clothing-park';
import { cryptoJune } from './crypto-june';
import { galtex } from './galtex';
import { miguelbogotadevApi } from './miguelbogotadev-api';
import { miguelbogotadevV1 } from './miguelbogotadev-v1';
import { nvcMovies } from './nvc-movies';
import { onWatchUs } from './on-watch-us';
import { reyWriter } from './rey-writer';

/**
 * List with all the work sorted by started date.
 */
const work = [
  aosp,
  aospDealers,
  clothingPark,
  cryptoJune,
  galtex,
  miguelbogotadevApi,
  miguelbogotadevV1,
  nvcMovies,
  onWatchUs,
  reyWriter,
].sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

export default work;
