# Mobile Application

## Quick Start

Run following commands from `mobile_app` folder
```bash
# first time
npm install

# run expo on android phone
npx expo run:android

# run once if any modules change
npx expo prebuild
```
`Node version 21.7.2`

### Gradle build error fix

Error only for Windows
```
C/C++: ninja: error: manifest 'build.ninja' still dirty after 100 tries

with

Deprecated Gradle features were used in this build, making it incompatible with Gradle 9.0
```

**FIX :** move project folder (repo) to a shorter path location like `C:/` or `D:/`

*This happen because project build folder path is longer than 160 chars (Windows limitation)*



