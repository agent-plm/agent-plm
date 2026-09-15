#!/usr/bin/env bash
# Assembles markdown pages for the GitHub Wiki from repo sources.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${1:-${ROOT}/wiki-out}"

rm -rf "${OUT}"
mkdir -p "${OUT}"

rewrite_links() {
  sed \
    -e 's|\[PLM_SPEC\.md\](PLM_SPEC\.md)|[[Product-Spec]]|g' \
    -e 's|\](PLM_SPEC\.md)|](Product-Spec)|g' \
    -e 's|\](README\.md)|](Home)|g' \
    -e 's|\](docs/wiki/How-It-Works\.md)|](How-It-Works)|g' \
    -e 's|\](docs/wiki/Entity-Kernel\.md)|](Entity-Kernel)|g' \
    -e 's|\](docs/wiki/Local-Development\.md)|](Local-Development)|g'
}

copy_page() {
  local src="$1"
  local dest="$2"
  rewrite_links < "${src}" > "${OUT}/${dest}"
}

echo "Building wiki pages into ${OUT}"

# Curated wiki-only pages
for page in "${ROOT}/docs/wiki/"*.md; do
  base="$(basename "${page}")"
  copy_page "${page}" "${base}"
done

# Sync key repo docs
copy_page "${ROOT}/README.md" "Home.md"
copy_page "${ROOT}/PLM_SPEC.md" "Product-Spec.md"
copy_page "${ROOT}/infra/README.md" "Infrastructure.md"
copy_page "${ROOT}/modules/README.md" "Domain-Modules.md"
copy_page "${ROOT}/kernel/README.md" "Kernel.md"
copy_page "${ROOT}/migrations/README.md" "Migrations.md"

# Wiki home navigation (prepended to Home.md)
NAV="${OUT}/Home.md"
{
  echo "Welcome to the **Agent PLM** wiki. Pages are synced from the main repository on each publish."
  echo
  echo "## Pages"
  echo
  echo "- [[How-It-Works]] — architecture and request flow"
  echo "- [[Entity-Kernel]] — universal entity model"
  echo "- [[Product-Spec]] — full engineering specification"
  echo "- [[Local-Development]] — run the stack locally"
  echo "- [[Infrastructure]] — Compose services"
  echo "- [[Domain-Modules]] — core PLM modules"
  echo "- [[Kernel]] — kernel JARs overview"
  echo "- [[Migrations]] — Flyway conventions"
  echo
  echo "---"
  echo
  cat "${NAV}"
} > "${OUT}/Home.md.tmp"
mv "${OUT}/Home.md.tmp" "${NAV}"

echo "Wiki build complete ($(find "${OUT}" -name '*.md' | wc -l | tr -d ' ') pages)."
