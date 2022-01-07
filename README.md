# `discord-pins-to-starboard`

Utility scripts for managing your pins in a Discord channel and migrating them to a starboard system.

## ⚡ Usage

```
https://github.com/zaida04/discord-pins-to-starboard
cd discord-pins-to-starboard
yarn run build
yarn run-script <script-of-chosing>
```

## 📜 Scripts

- [Get Pinned Messages](https://github.com/zaida04/discord-pins-to-starboard/blob/main/scripts/get-pinned-messages.ts)
  - env: `DISCORD_TOKEN`, `GUILD_ID`, `ORIGIN_CHANNEL_ID`
- [Send Pinned Messages](https://github.com/zaida04/discord-pins-to-starboard/blob/main/scripts/send-pinned-messages.ts)
  - env: `DISCORD_TOKEN`, `GUILD_ID`, `ORIGIN_CHANNEL_ID`, `DESTINATION_CHANNEL_ID`, `DESTINATION_GUILD_ID` (optional)
- [Clear Pinned Messages](https://github.com/zaida04/discord-pins-to-starboard/blob/main/scripts/clear-pinned-messages.ts)
  - env: `DISCORD_TOKEN`, `GUILD_ID`, `ORIGIN_CHANNEL_ID`

## ✋ Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

## ⚖️ LICENSE

Entire repo and all scripts/subscripts licensed under the [MIT License](https://github.com/zaida04/discord-pins-to-starboard/blob/main/LICENSE)
