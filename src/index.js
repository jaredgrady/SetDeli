'use strict';
/**
 * Start the web server and listen for requests
 *
 * @license MIT license
 */

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const axios = require('axios');
const cheerio = require('cheerio');
const smogon = "https://www.smogon.com/dex/";
const fs = require('fs');

let cache = {};

/**
 * Lowercases string inputs and removes non-string or number characters
 * @param {string} text The string to be cleaned
 * @return {string} The cleaned string
 */
function toId(text) {
	if (text && text.id) {
		text = text.id;
    } else if (text && text.userid) {
		text = text.userid;
	}
	if (typeof text !== 'string' && typeof text !== 'number') return '';
	return ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '');
}

/**
 * Checks if the mon cache contains a mon and updates it if it does
 * @param {string} key Canonical representation of a request
 * @return {Obbject} The sets for the requested mon and meta or null
 */
function checkCache(key) {
	if (!(key in cache)) {
		return null;
	}

	if ((Date.now() - cache[key].updated) >= 172800000) {
		return null;
	}
	return cache[key].sets;
}

/**
 * Updates a pokemon in the cache after its requested
 * @param {string} key Canonical representation of a request
 * @param {Object} sets The sets to be stored in the cache
 */
function updateCacheEntry(key, sets) {
	cache[key] = {'sets': sets, 'updated': Date.now()};
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/**
 * Index route for the API. Shows liveness.
 * @return {string} Response text
 */
app.get('/', (req, res) => {
	res.send("You have reached the Smogon Set Api");
});

/**
 * API route for requesting sets
 * @return {JSON}
 */
app.get('/sets/*/*/*', (req, res) => {
	let cleanUrl = req.url;
	if (cleanUrl.charAt(cleanUrl.length - 1) === '/') {
		cleanUrl = cleanUrl.substring(0, cleanUrl.length - 1);
	}

	// Extract the generation, pokemon name, and metagame from the query
	let parts = cleanUrl.split('/');
	let gen = toId(parts[parts.length - 3]);
	let mon = toId(parts[parts.length - 2]);
	let meta = toId(parts[parts.length - 1]);

	let cacheResult = checkCache(gen + mon + meta);

	if (!cacheResult) {
		// Asynchronously scrap the Dex for all relevant sets and pack them
		(async (gen, mon, meta) => {
			try {
				const result = await axios.get(`${smogon}${gen}/pokemon/${mon}/${meta}`);
				const $ = cheerio.load(result.data);

				let sets = JSON.parse(
					$('script').first().html().replace('dexSettings = ', ""))
						['injectRpcs'][2][1]['strategies'][0]['movesets'];

				updateCacheEntry(gen + mon + meta, sets);
				console.log(sets);
				res.status(201).json({'success': 201, 'data': sets});
			} catch (error) {
				res.status(404).json({'error': 404, 'data':null, 'message':`Unable to find ${gen} ${meta} sets for ${mon}`});
				return;
			}
		})(gen, mon, meta);
	} else {
		console.log(cacheResult);
		res.status(201).json({'success': 201, 'data': cacheResult});
	}
});

app.listen(port, () => console.log(`SmogDex API listening on port ${port}!`));