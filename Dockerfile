FROM cimg/android:2024.07.1-node

# Setup Android environment
ARG ARCH="x86_64" 
ARG TARGET="google_apis_playstore"  
ARG API_LEVEL="34" 
ARG ANDROID_API_LEVEL="android-${API_LEVEL}"
ARG ANDROID_APIS="${TARGET};${ARCH}"
ARG EMULATOR_PACKAGE="system-images;${ANDROID_API_LEVEL};${ANDROID_APIS}"
ARG ANDROID_SDK_PACKAGES="${EMULATOR_PACKAGE}"
# Install system image for emulator.
RUN sdkmanager --verbose ${ANDROID_SDK_PACKAGES}
# Create new virtual device
RUN avdmanager --verbose create avd --name "pixel_7" --device "pixel_7" --package "system-images;android-34;google_apis_playstore;x86_64"

WORKDIR /inrupt-wallet-frontend/

COPY android-config/ ./android-config/
COPY api/ ./api/
COPY app/ ./app/
COPY assets/ ./assets/
COPY components/ ./components/
COPY constants/ ./constants/
COPY e2e/ ./e2e/
COPY hooks/ ./hooks/
COPY plugins/ ./plugins/
COPY types/ ./types/
COPY utils/ ./utils/
COPY .detoxrc.js app.config.ts metro.config.js package.json package-lock.json run-ui-tests.sh tsconfig.json ./
# The APK must be compiled beforehand
# TODO: Add a test checking for its presence
COPY android/app/build/outputs/apk/androidTest/release/app-release-androidTest.apk .

RUN chown circleci .

ENV CI=true
ENV SIGNING_CONFIG_PATH=/inrupt-wallet-frontend/android-config/signing-config.gradle

RUN echo "Installing the dependencies"
RUN npm ci

# The following starts an emulator, it seems successfully
#emulator @pixel -no-snapshot -accel off -no-window -noaudio -no-boot-anim -camera-back none

CMD ["bash", "-c", "npx detox test --configuration android.emu.release"]
