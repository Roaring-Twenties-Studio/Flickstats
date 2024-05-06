<img  alt="flickstats logo" src="https://github.com/Roaring-Twenties-Studio/Flickstats/assets/43271780/180fd28b-1fef-4436-9a45-a229a06c177a">

<hr/>

# WHAT IS IT?

Flickstats is a desktop software for analyzing your screenplays. Get critical data about your story, scenes, and characters. All wrapped up in beautiful visualizations.

![screenshot-real-life_ma1r5g](https://github.com/Roaring-Twenties-Studio/Flickstats/assets/43271780/bf6e998d-9d0d-42d8-82cd-a39284260242)

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

MacOS, 13.4 (Ventura) and above. A Windows version will be available if there is enough demand for it.

<hr/>

# INSTALLATION

Flickstats is not notarized and signed by Apple. The process costs $99 per year, which is incompatible with free software. If there are enough donations, this issue will be resolved and you will be able to download Flickstats directly from the AppStore.

For now, your system will refuse to install Flickstats when you double-click the DMG file (the one you downloaded). Here's how to get around this security measure (don't worry, it's safe, and if you have any doubts, the code is open source):

- Right-click the DMG file.
- Click `Open`.
- A warning window will ask if you are sure you want to do this.
- Click `Yes`.
- The normal installer window will appear. Drag and drop the Flickstats application into your Applications folder.
- You're all set. Enjoy.

See also <a href="https://support.apple.com/guide/mac-help/open-a-mac-app-from-an-unidentified-developer-mh40616/mac" target="_blank">Apple's official procedure for opening applications from unknown developers.</a>

## LOCAL BUILD

You can also build the application directly on your computer to bypass the security. Here is how to do it (this requires using the computer terminal):

- Download this repository
- Install `xcode` (<a href="https://apps.apple.com/us/app/xcode/id497799835?mt=12" target="_blank">xcode website</a>)
- Install `brew` (<a href="https://brew.sh" target="_blank">brew website</a>)
- Install the following native dependencies:
  - `brew install pkg-config cairo pango libpng jpeg giflib librsvg libffi`
- Install the project dependencies: `npm i`
- Run the build command: `npm run build`
- The DMG file will be available in the `out` folder
- Double-click on the DMG
- The installation window appears. Drag and drop the Flickstats application into your Applications folder.
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
