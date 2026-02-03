# holdings-ingester
Ingest holdings data into ClickHouse

## Frontend
Accept CSV upload

## Backend
Convert to CSV to JSON, store ticker-share key value pairs in ClickHouse

Holdings Table (ClickHouse):
| Date        | Ticker      | Shares      |
| ----------- | ----------- | ----------- |
| MM/DD/YYYY  | Ticker_1    | XXX         |
| MM/DD/YYYY  | Ticker_2    | XXX         |