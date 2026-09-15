# Publishing to GitHub Wiki

The wiki at https://github.com/agent-plm/agent-plm/wiki is synced from this repository by the **Publish Wiki** workflow.

## One-time setup

1. **Enable Wiki** — Settings → Features → Wikis (already done if the Wiki tab is visible).

2. **Add `WIKI_PAT` secret** (recommended, required for CI-triggered publishes):
   - Create a [classic personal access token](https://github.com/settings/tokens) with **`repo`** scope.
   - In the repository: Settings → Secrets and variables → Actions → **New repository secret**
   - Name: `WIKI_PAT`, value: your PAT.

   Why: Runs triggered by **`workflow_run`** (after CI on `main`) do not get a writable `GITHUB_TOKEN`. GitHub also returns **“Repository not found”** when the token cannot access the wiki git repo, even when Wiki is enabled.

3. **Organization settings** (if applicable): Settings → Actions → General → Workflow permissions → **Read and write permissions**.

## Optional manual bootstrap

If CI has not run yet, open the **Wiki** tab once and create any page (e.g. “Home”). That provisions `agent-plm.wiki.git` for git-based sync.

## Local preview

```bash
bash scripts/build-wiki.sh wiki-out
ls wiki-out
```

## When the workflow runs

| Trigger | Notes |
| --- | --- |
| `workflow_run` after CI on `main` | Requires `WIKI_PAT` |
| Push to `main` (doc paths) | Works with `WIKI_PAT` or writable `GITHUB_TOKEN` |
| `workflow_dispatch` | Manual run from Actions tab |
