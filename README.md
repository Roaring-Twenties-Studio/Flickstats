<img  alt="flickstats logo" src="https://github.com/Roaring-Twenties-Studio/Flickstats/assets/43271780/180fd28b-1fef-4436-9a45-a229a06c177a">

<hr/>

# WHAT IS IT?

Flickstats is a desktop software for analyzing your screenplays. Get critical data about your story, scenes, and characters. All wrapped up in beautiful visualizations.

![screenshot-real-life_ma1r5g](https://github.com/Roaring-Twenties-Studio/Flickstats/assets/43271780/bf6e998d-9d0d-42d8-82cd-a39284260242)

<hr/>

### VIDEO PREVIEW

> (This will open a new youtube tab)

<div>
  <a href="https://www.youtube.com/watch?v=U5BdVEZxQcs"  target="_blank">
    <img width="500" alt="video-preview" src="https://github.com/Roaring-Twenties-Studio/Flickstats/assets/43271780/36f1fd73-c90e-40ae-8130-c26730bd0439"><img>
  </a>
</div>

<hr/>

# SCREENSHOTS

![screenshot-dialog-over-time_npcp6s](https://github.com/Roaring-Twenties-Studio/Flickstats/assets/43271780/3d01bc19-5f24-4de2-bd40-01eb7ad99c24)
![screenshot-mildred_p58swz](https://github.com/Roaring-Twenties-Studio/Flickstats/assets/43271780/80e4d2a2-cfa8-4315-b9f0-762250c7ce6c)
![screenshot-scenes_fwkpmx](https://github.com/Roaring-Twenties-Studio/Flickstats/assets/43271780/1c4ba19c-1be7-4270-9089-29fc76bb9028)
![screenshot-scenes-sort_vig5xv](https://github.com/Roaring-Twenties-Studio/Flickstats/assets/43271780/5d346106-a29c-4d63-9439-411d5f6dc4e2)
![screenshot-settings-modal_ssidj3](https://github.com/Roaring-Twenties-Studio/Flickstats/assets/43271780/89a912af-87bc-4dc2-bcb9-3b27beba9e67)
![screenshot-wordcloud_a7nekw](https://github.com/Roaring-Twenties-Studio/Flickstats/assets/43271780/a05ea1c4-7569-45ee-ae38-358ecab60b41)

<hr/>

# DOWNLOAD

You can download the latest version <a href="" target="_blank">here</a> or directly from our <a href="https://flickstats.roaring-twenties-studio.com" target="_blank">website</a>

<hr/>

## SYSTEM REQUIREMENTS

MacOS 14.3 (Sonoma) or later. Compatible with ARM chips only (M1, M2, etc.).
A Windows version will be available if there is enough demand for it.

<hr/>

# INSTALLATION

Flickstats is not notarized and signed by Apple. The process costs $99 per year, which is incompatible with free software. If there are enough donations, this issue will be resolved and you will be able to download Flickstats directly from the AppStore.

For now, your system will refuse to install Flickstats when you double-click the `FlickStats.app` file. Here's how to bypass this security measure (don't worry, it's safe, and if you have any doubts, the code is open source):

- Drag and drop `FlickStats.app` into your `Applications` folder.
- Click the magnifying glass in the upper right corner of your Mac and search for "Terminal".
  <img width="637" alt="terminal search" src="https://github.com/Roaring-Twenties-Studio/Flickstats/assets/43271780/eb6ad1f1-5d13-44ac-9b42-33cb9577657b"></img>
- Open the Terminal and type the command `xattr -cr /Applications/Flickstats.app`

  > All applications downloaded from unknown developers are quarantined by default.
  > This command basically tells to your Mac that FlickStats is safe. <a href="" target="_blank">Learn more.</a>

<img width="638" alt="terminal command" src="https://github.com/Roaring-Twenties-Studio/Flickstats/assets/43271780/0d622d10-f02b-4294-ba6b-d2bb8225a10c"></img>

- Press `Enter`
- Close the Terminal.
- Double-click on FlickStats. Enjoy.

## LOCAL BUILD

You can also build the application directly on your computer to bypass the security. Here is how to do it:

- Download this repository
- Install `xcode` (<a href="https://apps.apple.com/us/app/xcode/id497799835?mt=12" target="_blank">xcode website</a>)
- Install `brew` (<a href="https://brew.sh" target="_blank">brew website</a>)
- Install the following native dependencies:
  - `brew install pkg-config cairo pango libpng jpeg giflib librsvg libffi`
- Install the project dependencies: `npm i`
- Run the build command: `npm run package`
- The app file will be available in the `out/FlickStats-darwin-arm64` folder
- Double-click on the `FlickStats.app` file or drag and drop it into your Applications folder.
- You're all set. Enjoy.

<hr/>

# CONTRIBUTE

Pull requests are welcome!

## RUNNING THE APP

Here is how to launch Flickstats in dev mode:

- Download this repository
- Install `xcode` (<a href="https://apps.apple.com/us/app/xcode/id497799835?mt=12" target="_blank">website</a>)
- Install `brew` (<a href="https://brew.sh" target="_blank">website</a>)
- Install the following native dependencies:
  - `brew install pkg-config cairo pango libpng jpeg giflib librsvg libffi`
- Install the project dependencies: `npm i`
- Run the dev command: `npm run start`
- You're all set. Send us your best pull request!

<hr/>

# ROADMAP

Some of these features may be implemented depending on the interest and donations this software generates.

- [ ] PDF export
- [ ] AI chat with the script
- [ ] Summary of the story
- [ ] Image cloud (to illustrate the visual mood of the script)
- [ ] Focus on multiple characters, for comparisons
- [ ] Save reports in `.flickstats` format to share and open at any time
- [ ] Improve performance
- [ ] Windows version
- [ ] Add more tests

<hr/>

# SUPPORT

Flickstats is free and open source software. If you like it, please consider supporting us with a donation. Donors will be listed on this repo and on the website if they wish.

<a href="https://donate.stripe.com/5kA002g3Q32sb8Q288" target="_blank">
<img src="https://github.com/Roaring-Twenties-Studio/Flickstats/assets/43271780/a8d1f26b-2119-4b76-bb30-10ea9497c885" alt="donate" width="460px"/>
</a>

<hr/>

# CONTACT

hello@roaring-twenties-studio.com

You can also open an issue in this repository.
