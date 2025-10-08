App Icon Bundles (iOS + Android)

iOS
- Path: ios/AppIcon.appiconset
- Contents.json included; drag the entire AppIcon.appiconset into Xcode (Assets.xcassets).
- Includes iPhone, iPad, and App Store (1024×1024) icons.

Android
- Path: android/res/mipmap-* (ic_launcher.png, ic_launcher_round.png)
- Copy folders into your Android project’s app/src/main/res/.
- In AndroidManifest.xml, reference:
  <application
      android:icon="@mipmap/ic_launcher"
      android:roundIcon="@mipmap/ic_launcher_round" ...>

Notes
- Generated from the master icon at 01_LOGOS/icon-version.png.
- For adaptive icons (Android 8.0+), consider using Android Studio’s Image Asset tool to create separate foreground/background layers.
- Brand colors: Navy #1B365D, Green #00D4AA.
