#!/usr/bin/env sh
set -eu

BASEDIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
WRAPPER_DIR="$BASEDIR/.mvn/wrapper"
MAVEN_VERSION="3.9.9"
DIST_NAME="apache-maven-$MAVEN_VERSION"
DIST_DIR="$WRAPPER_DIR/dists/$DIST_NAME"
DIST_HOME="$DIST_DIR/$DIST_NAME"
ZIP_PATH="$DIST_DIR/$DIST_NAME-bin.zip"
DIST_URL="https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/$MAVEN_VERSION/$DIST_NAME-bin.zip"

if [ ! -x "$DIST_HOME/bin/mvn" ]; then
  mkdir -p "$DIST_DIR"
  if [ ! -f "$ZIP_PATH" ]; then
    if command -v curl >/dev/null 2>&1; then
      curl -fsSL "$DIST_URL" -o "$ZIP_PATH"
    elif command -v wget >/dev/null 2>&1; then
      wget -qO "$ZIP_PATH" "$DIST_URL"
    else
      echo "curl or wget is required to download Maven" >&2
      exit 1
    fi
  fi
  if command -v unzip >/dev/null 2>&1; then
    unzip -q -o "$ZIP_PATH" -d "$DIST_DIR"
  else
    echo "unzip is required to extract Maven" >&2
    exit 1
  fi
fi

unset JAVA_HOME || true
exec "$DIST_HOME/bin/mvn" "$@"
