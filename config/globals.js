module.exports.globals = {
  version: process.env.npm_package_version,
  slackWebhook: process.env.SLACK_WEBHOOK,
  slackSongAdded: process.env.SLACK_SONG_ADDED !== 'false',
  slackSongPlaying: process.env.SLACK_SONG_PLAYING !== 'false',
  slackSongLinks: process.env.SLACK_SONG_LINKS === 'true',
  googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID
};
