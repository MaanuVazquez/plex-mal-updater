"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookEvent = void 0;
var WebhookEvent;
(function (WebhookEvent) {
    WebhookEvent["LIBRARY_ON_DECK"] = "library.on.deck";
    WebhookEvent["LIBRARY_NEW"] = "library.new";
    WebhookEvent["MEDIA_PAUSE"] = "media.pause";
    WebhookEvent["MEDIA_PLAY"] = "media.play";
    WebhookEvent["MEDIA_RATE"] = "media.rate";
    WebhookEvent["MEDIA_RESUME"] = "media.resume";
    WebhookEvent["MEDIA_SCROBBLE"] = "media.scrobble";
    WebhookEvent["MEDIA_STOP"] = "media.stop";
    WebhookEvent["ADMIN_DATABASE_BACKUP"] = "admin.database.backup";
    WebhookEvent["ADMIN_DATABASE_CORRUPTED"] = "admin.database.corrupted";
    WebhookEvent["DEVICE_NEW"] = "device.new";
    WebhookEvent["PLAYBACK_STARTED"] = "playback.started";
})(WebhookEvent = exports.WebhookEvent || (exports.WebhookEvent = {}));
