# App Icon Bundles (iOS + Android)

Complete set of app icon assets for LAN Onasis, optimized for iOS and Android platforms.
**Version: 1.0.1**

## What's Included
- **iOS**: ios/AppIcon.appiconset (with Contents.json)
- **Android**: android/res/mipmap-* (ic_launcher.png, ic_launcher_round.png)
- **Documentation**: README.md, MOBILE_APP_GUIDELINES.md

## How to Use
### iOS
```text
- Path: ios/AppIcon.appiconset
- Contents.json included; drag the entire AppIcon.appiconset into Xcode (Assets.xcassets).
- Includes iPhone, iPad, and App Store (1024×1024) icons.
```

### Android
```text
- Path: android/res/mipmap-* (ic_launcher.png, ic_launcher_round.png)
- Copy folders into your Android project’s app/src/main/res/.
- In AndroidManifest.xml, reference:
  <application
      android:icon="@mipmap/ic_launcher"
      android:roundIcon="@mipmap/ic_launcher_round" ...>
```

## Accessibility Guidelines
- Ensure sufficient contrast between icon elements and background
- Test icon visibility in different device themes (light/dark mode)
- Consider providing alternative icons for users with visual impairments
- For adaptive icons (Android 8.0+), ensure foreground and background layers provide sufficient contrast
- Test icon visibility on different screen sizes and resolutions
- Provide descriptive text for icons when used in UI elements
- Consider providing high-contrast versions for users with visual impairments

## Notes
- Generated from the master icon at 01_LOGOS/icon-version.png.
- For adaptive icons (Android 8.0+), consider using Android Studio’s Image Asset tool to create separate foreground/background layers.
- Use brand colors: Navy #1B365D, Green #00D4AA.
- Maintain consistent branding across both iOS and Android platforms.
