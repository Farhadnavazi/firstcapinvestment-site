# FCIR Asset Library

Private file host for First Capital Investment Realty. Files committed to `asset-library/uploads/` are publicly accessible by direct URL but are NOT linked from the live site and are blocked from search engines via `/robots.txt`.

## How to add a new asset

1. Drop the file into `/asset-library/uploads/`. Use lowercase, hyphenated filenames (e.g. `q2-2026-blog-banner.jpg`).
2. From the repo root, run `python3 asset-library/update-manifest.py` to refresh `manifest.json`.
3. Commit and push:
   ```
   git add asset-library
   git commit -m "Add asset: filename"
   git push origin main
   ```

After the GitHub Pages build completes (~30-60 seconds), the file is live at:

- **Live URL:**  `https://firstcapinvestment.com/asset-library/uploads/<filename>`
- **Raw GitHub:** `https://raw.githubusercontent.com/Farhadnavazi/firstcapinvestment-site/main/asset-library/uploads/<filename>`

Visit `https://firstcapinvestment.com/asset-library/` (bookmark this -- it is not linked from anywhere) to browse the gallery, preview files, and copy URLs with one click.

## Notes

- The directory is blocked in `/robots.txt`, so search engines should not crawl it.
- Anyone with the URL can still view a file -- do NOT upload anything confidential here.
- For very large files (>50MB) GitHub may reject the push; use Git LFS or external storage instead.
