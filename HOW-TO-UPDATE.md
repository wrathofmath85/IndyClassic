# Indy Classic site — how to update

## Uploading
Drop every file from this zip into your GitHub Pages repo (same folder as before).
Your images (profile.jpg.png, Welcome.jpg, banquet.png, hotel.jpg, shirt1-3.jpg,
tierXsponsorYY.jpg) stay exactly as they are; the file names didn't change.
MatchDisplay6.html is untouched and still linked from everywhere.

## Your one file: config.js
Almost everything lives in config.js: dates, times, venues, register/payment links,
hotel, welcome party, banquet (cocktails + raffle), shirts, committee, FAQ, sponsors.
Search for "TODO 2027" to find the open items.

- **Make a page live:** delete its line from `comingSoon` (those pages currently link to holdhorse.html).
- **Payment button:** paste the Zeffy URL into `links.payment`. It shows "opens soon" until you do.
- **Sponsors:** keep naming files tier2sponsor01.jpg etc. Missing files hide themselves.
  To make a logo clickable, add it to `sponsors.links`.
- **Preview tournament weekend:** add `?now=2027-06-04T12:30` to any URL.
  Add `?now=off` to go back.

## Changing the look
site.css holds every color. Change `--ball` (the tennis-ball yellow) at the top to re-theme the site.

## Cache tip
After you edit site.css, site.js or config.js, phones can hold on to the old copy for a bit.
To force a refresh, change `?v=2027a` to `?v=2027b` in the HTML `<head>` lines (find and replace across files).
