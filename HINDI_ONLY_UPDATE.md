# Hindi edition only

The `/api/news` server route now accepts only headlines that explicitly reference Bigg Boss Hindi Season 20 (e.g. Bigg Boss 20, BB20, बिग बॉस 20), and rejects headlines mentioning Telugu, Tamil, Malayalam, Kannada, Marathi, Bengali, Odia, or OTT editions. This is separate from the existing Hindi/English **article language** selector.

Because filtering is deliberately strict, some relevant articles that omit the season number from their headlines may not appear. The screen's news language selector can still show English-language articles *about* Hindi Season 20.

Deploy by uploading the changed `app/api/news/route.ts` to your existing GitHub repository and committing, or replace your project with the full ZIP.
