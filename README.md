[![Badge Commits]][Commit Rate]
[![Badge Mozilla]][Mozilla]

***

<h1 align="center">
<sub>
<img src="https://raw.githubusercontent.com/longnghia/read-later/main/public/icon-128.png" height="38" width="38">
</sub>
Read Later
</h1>

Read Later helps you to easily manage multiple tabs.
Save tabs by shortcut and revisit them at your convenience, making it simple to stay organized and never lose track of important pages.

***

<p align="center">
<a href="https://addons.mozilla.org/en-US/firefox/addon/read-it-later/"><img src="https://github.com/user-attachments/assets/a89c4124-119a-4147-822d-23ac1e831d18" alt="Get Read Later for Firefox"></a>
</p>

***

## Features

[demo.webm](https://github.com/user-attachments/assets/577d4ba1-2979-4b23-9cc9-8e0e521612ba)

- Save tabs
  - Save current tab by shortcut `ctrl + b`
  - Click an item to open it in new tab
  - Click plus `cmd/ctrl` will also remove it from read-later

- Save groups
  - Manage groups of related tabs

## Development

- Install dependencies: `pnpm i`
- Development Build: `pnpm run start firefox`
- Production Build: `pnpm run build firefox`

  Production Build is located in `dist/v2`

### TODO

- [ ] Save hightlighted tabs
- [ ] Export JSON data

## Credits

- <https://github.com/debdut/browser-extension.git>
- <https://www.svgbackgrounds.com/elements/animated-svg-preloaders/>
- <https://www.flaticon.com>

## License`

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

<!---------------------------------[ Internal ]-------------------------------->

[Commit Rate]: https://github.com/longnghia/read-later/commits/main
[Mozilla]: https://addons.mozilla.org/addon/read-it-later/

<!----------------------------------[ Badges ]--------------------------------->

[Badge Commits]: https://img.shields.io/github/commit-activity/m/longnghia/read-later?label=Commits
[Badge Mozilla]: https://img.shields.io/amo/rating/read-it-later?label=Firefox
