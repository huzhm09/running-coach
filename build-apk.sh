#!/bin/bash
# 跑步教练 APK 一键构建脚本
# 前提：已安装 JDK 17+ 和 Android Studio
# 首次运行会自动下载 Android SDK 依赖

set -e

echo "========================================"
echo "  跑步教练 APK 构建"
echo "========================================"

cd "$(dirname "$0")"

# 1. 检查 Java
if ! command -v java &>/dev/null; then
  echo "❌ 需要 JDK 17+，请先安装 Java"
  echo "   Ubuntu: sudo apt install openjdk-17-jdk"
  echo "   Mac: brew install openjdk@17"
  exit 1
fi
echo "✅ Java: $(java -version 2>&1 | head -1)"

# 2. 检查 Android SDK
if [ -z "$ANDROID_HOME" ]; then
  # 尝试常见路径
  for p in ~/Android/Sdk ~/android-sdk /usr/local/android-sdk; do
    if [ -d "$p" ]; then
      export ANDROID_HOME="$p"
      break
    fi
  done
fi

if [ -z "$ANDROID_HOME" ]; then
  echo "⚠️  未设置 ANDROID_HOME，尝试自动安装 Android SDK..."

  # 下载 command-line tools
  SDK_DIR=~/android-sdk
  mkdir -p $SDK_DIR/cmdline-tools

  # Remove stale/corrupted download
  rm -f /tmp/android-sdk.zip

  echo "下载 Android SDK command-line tools (约150MB)..."
  curl -# -L -o /tmp/android-sdk.zip \
    "https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip"

  # Verify it's a real zip
  if ! unzip -tq /tmp/android-sdk.zip 2>/dev/null; then
    echo "❌ SDK 下载失败，请手动安装 Android Studio"
    echo "   https://developer.android.com/studio"
    exit 1
  fi

  unzip -qo /tmp/android-sdk.zip -d $SDK_DIR/cmdline-tools
  mv $SDK_DIR/cmdline-tools/cmdline-tools $SDK_DIR/cmdline-tools/latest 2>/dev/null || true

  export ANDROID_HOME=$SDK_DIR

  # 安装必要的 SDK 包
  echo "安装 Android SDK 组件..."
  yes | $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager \
    "platform-tools" \
    "build-tools;34.0.0" \
    "platforms;android-34" 2>/dev/null

  echo "✅ Android SDK 安装完成: $ANDROID_HOME"
fi

echo "✅ ANDROID_HOME: $ANDROID_HOME"

# 3. 设置 local.properties
echo "sdk.dir=$ANDROID_HOME" > android/local.properties

# 4. 构建 Web
echo ""
echo "📦 构建 Web 资源..."
npm run build

# 5. 同步到 Android
echo ""
echo "🔄 同步到 Android 工程..."
npx cap sync

# 6. 构建 APK
echo ""
echo "🔨 构建 APK..."
cd android
./gradlew assembleDebug 2>&1 | tail -20

APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$APK_PATH" ]; then
  cp "$APK_PATH" ../running-coach.apk
  echo ""
  echo "========================================"
  echo "  ✅ APK 构建成功！"
  echo "  📱 文件: $(realpath ../running-coach.apk)"
  echo "  📦 大小: $(ls -lh ../running-coach.apk | awk '{print $5}')"
  echo "========================================"
  echo ""
  echo "安装方式："
  echo "  1. 传到手机上"
  echo "  2. 设置 → 安全 → 允许未知来源"
  echo "  3. 点击 APK 安装"
else
  echo ""
  echo "❌ APK 构建失败，检查上面的错误信息"
  exit 1
fi
