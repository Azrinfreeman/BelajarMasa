# Genius Time Master

An interactive clock learning game built with HTML, CSS, and JavaScript, with an Android WebView wrapper. The repository is named **BelajarMasa**, while the browser title and Android application label use **Genius Time Master**.

The project explores how draggable analog clocks, guided lessons, answer feedback, adaptive practice, and local two-player competition can support time-reading practice. It includes English and Bahasa Melayu interfaces and stores learning statistics on the current browser/device.

## Modes in the source

| Mode | Purpose |
| --- | --- |
| Explore | Drag clock hands, adjust hours/minutes, and compare analog and digital time. |
| Learn | Follow a six-step clock-learning sequence. |
| Quiz | Attempt clock-setting and time-reading questions across four difficulty levels. |
| Practice | Use shorter sessions, hints, and skill records to support adaptive practice. |
| PvP Battle | Two players share one device and compete using separate clock controls. |

The four quiz levels cover whole hours, quarter/half hours, five-minute intervals, and precise minutes. The source defines 10-question quiz sessions and five-question practice sessions. PvP uses a first-to-five score condition; it is a same-device game, with no network matchmaking implementation identified.

**Known issue:** the current quiz/practice “Next” handler references an undefined `question` variable. An isolated function check reproduced a `ReferenceError`. This can prevent progression and needs a separate code fix before a reliable demonstration. The documentation change preserves the existing behavior.

## Other features

- Dark/light themes, language switching, and mute controls.
- Synthesized sound feedback, badges, streaks, high scores, and celebrations.
- Local mastery records and saved lesson progress through `localStorage`.
- Responsive layout states for orientation, usable viewport size, and TV-like displays.
- Landscape Android WebView presentation with immersive system UI.

Progress is local to the browser origin or WebView storage. Clearing that storage removes saved progress; there is no verified cloud account or cross-device synchronization.

## Run the browser source

There is no npm project or frontend compilation step. Serve the repository root using a local static server, for example with Python 3:

```sh
git clone https://github.com/Azrinfreeman/BelajarMasa.git
cd BelajarMasa
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000` in a modern browser with JavaScript, local storage, SVG, and Web Audio support. Use mouse/touch controls, and test the available keyboard controls on the intended device. Browser audio may require a user gesture.

The browser HTML requests Google Fonts. The Android manifest currently declares no Internet permission, so remote fonts should not be assumed to load in the wrapper. Test fallback rendering rather than claiming identical browser and packaged appearance.

## Android wrapper

[MainActivity.java](android-webview/app/src/main/java/com/azrin/belajarmasa/MainActivity.java) opens bundled web assets at `file:///android_asset/www/index.html`, enables JavaScript/DOM storage, and handles fullscreen presentation and pause/resume. The [manifest](android-webview/app/src/main/AndroidManifest.xml) requests landscape orientation and does not require touchscreen hardware; this alone does not establish Android TV or remote-control compatibility.

The project uses Windows PowerShell packaging scripts, rather than a tracked Gradle wrapper:

- [build-apk.ps1](scripts/build-apk.ps1): debug packaging.
- [build-release-apk.ps1](scripts/build-release-apk.ps1): release packaging and signing.

Inspect the scripts and signing configuration before running them. They reference JDK/Android SDK tooling such as `javac`, `aapt2`, `d8`, `zipalign`, and `apksigner`; an appropriately configured Windows build environment is required. Builds and signing were not performed for this review.

The four source assets currently match their copies under `android-webview/app/src/main/assets/www`. Two APK files are tracked at the root, but their contents, signatures, installability, and correspondence to the latest source were not verified. The existing tablet display record says APK generation was deferred, so the APK filenames are not evidence of a current verified release.

## Source guide

| Area | Starting point |
| --- | --- |
| Screens, clock markup, and mode controls | [index.html](index.html) |
| Clock interactions, translations, learning modes, storage, and PvP | [app.js](app.js) |
| Themes and responsive mode layouts | [style.css](style.css) |
| Application icon | [favicon.svg](favicon.svg) |
| Android source | [android-webview/app/src/main](android-webview/app/src/main) |
| Educational planning PDFs | [docs](docs) |
| Browser layout status and deferred APK work | [Tablet display implementation record](TABLET_MODE_DISPLAY_FIX_IMPLEMENTATION.md) |

The educational PDFs and roadmap files are planning materials; their presence is not proof that every proposal is implemented or that the game has official curriculum approval. Some layout records remain proposals, while the tablet display record describes changes applied to the browser source.

## Validation status

JavaScript syntax, source/wrapper asset equality, documentation links, and the existing Next-handler failure were checked for this review. No interactive browser session, viewport visual review, full learning session, APK build/install, signature check, or physical-device test was performed. See [validation notes](docs/VALIDATION.md) for the scope and follow-up work.

Before any public release, review the tracked signing keystores and build configuration separately. This documentation work leaves the repository private and does not alter signing material, packages, app logic, or stored user data.

## Licensing

No repository-wide license was added. Confirm permissions for educational materials, fonts, icons, and other included content before redistribution.
