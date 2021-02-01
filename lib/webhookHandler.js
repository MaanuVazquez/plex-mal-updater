"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_myanimelist_1 = require("node-myanimelist");
var string_similarity_1 = require("string-similarity");
var types_1 = require("./types");
function detectAnimeByTitleAndEpisode(title, episodeName) {
    return __awaiter(this, void 0, void 0, function () {
        var animeResult, jikanResult, results, neededAnimes, _i, neededAnimes_1, anime, episodes, episodesTitle, match;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, node_myanimelist_1.Jikan.search().anime({
                        q: title
                    })];
                case 1:
                    jikanResult = _a.sent();
                    results = jikanResult.results;
                    neededAnimes = results.slice(0, 10);
                    console.log(episodeName);
                    _i = 0, neededAnimes_1 = neededAnimes;
                    _a.label = 2;
                case 2:
                    if (!(_i < neededAnimes_1.length)) return [3, 5];
                    anime = neededAnimes_1[_i];
                    return [4, node_myanimelist_1.Jikan.anime(anime.mal_id).episodes()];
                case 3:
                    episodes = (_a.sent()).episodes;
                    episodesTitle = episodes.map(function (episode) { return episode.title.toLowerCase(); });
                    if (episodesTitle.length) {
                        match = string_similarity_1.findBestMatch(episodeName.toLowerCase(), episodesTitle);
                        if (match.bestMatch.rating >= 0.7) {
                            animeResult = {
                                malId: anime.mal_id,
                                episodeNumber: episodes[match.bestMatchIndex].episode_id
                            };
                            return [3, 5];
                        }
                    }
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3, 2];
                case 5: return [2, animeResult];
            }
        });
    });
}
function default_1(_a) {
    var Metadata = _a.Metadata, event = _a.event;
    return __awaiter(this, void 0, void 0, function () {
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (event !== types_1.WebhookEvent.MEDIA_PAUSE)
                        return [2];
                    console.log(Metadata);
                    _c = (_b = console).log;
                    return [4, detectAnimeByTitleAndEpisode(Metadata.grandparentTitle, Metadata.title)];
                case 1:
                    _c.apply(_b, [_d.sent()]);
                    return [2];
            }
        });
    });
}
exports.default = default_1;
