#!/usr/bin/env bash
# Installs LLVM 21 (clang, libc++), OpenMP and MPI from apt.llvm.org on the Ubuntu runner.
# The C++23 reference code is written against clang 21 + libc++ (Apple clang 21 on macOS);
# Ubuntu's clang 18 and libstdc++ lack parts of it. The signing key is checked against its
# known fingerprints before apt trusts it.
set -euo pipefail
want="56E1477F57BAB5ECF37818045B3D8846AF9463CE
6084F3CF814B57C1CF12EFD515CF4D18AF4F7421"
curl -fsSL https://apt.llvm.org/llvm-snapshot.gpg.key -o llvm.key
[ "$(gpg --show-keys --with-colons llvm.key | awk -F: '/^fpr/{print $10}' | sort)" = "$want" ]
sudo install -d /etc/apt/keyrings
sudo gpg --dearmor -o /etc/apt/keyrings/llvm.gpg llvm.key
codename=$(lsb_release -cs)
echo "deb [signed-by=/etc/apt/keyrings/llvm.gpg] https://apt.llvm.org/$codename/ llvm-toolchain-$codename-21 main" |
  sudo tee /etc/apt/sources.list.d/llvm.list
sudo apt-get update -qq
sudo apt-get install -y -qq clang-21 libc++-21-dev libc++abi-21-dev libomp-21-dev openmpi-bin libopenmpi-dev
mkdir -p "$HOME/bin"
ln -s /usr/bin/clang++-21 "$HOME/bin/clang++"
ln -s /usr/bin/clang-21 "$HOME/bin/clang"
echo "$HOME/bin" >>"$GITHUB_PATH"
