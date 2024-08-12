#! /bin/bash

# Enable QEmu hardware acceleration.
sudo chown circleci -R /dev/kvm
echo "kvm:x:200:circleci" | sudo tee -a /etc/group

# Run the tests
npx detox test --configuration android.emu.release --loglevel verbose
