# HTML records

A JavaScript collector for one HTML source. The listing page yields the record links. Each linked page is parsed with Cheerio into a JSON record: id, title, published date, and summary.

The default run uses the HTML fixtures in this repository. Nothing is fetched over the network. Pass `--url` only for a page you are allowed to read, and only when that page uses the same markup: `a.record` on the listing, and `article > h1`, `time[datetime]`, and `p.summary` on each record.

This is the public sample of the snippet shape from my vLex work: fetch, discover links, parse HTML. The client sources stay in the client repository.

## Run

```bash
npm install
npm test
npm start
```

`npm start` writes `output/records.json`.
