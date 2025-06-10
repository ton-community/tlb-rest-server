# TLB Rest Server

**TLB Rest Server** is an HTTP API service for parsing serialized TVM cells using a given TL-B schema.

## API

### POST `/parse`

Parses a base64-encoded cell using the provided TL-B schema.

#### Request Body

| Field  | Type     | Required | Description                 |
|--------|----------|----------|-----------------------------|
| schema | `string` | Yes      | A TL-B serialization schema |
| cell   | `string` | Yes      | A base64-encoded cell       |

##### Example:

```json
{
  "schema": "foo$01 v:uint32 = Foo;bar$10 v:uint128 = Bar;",
  "cell": "te6cckEBAQEABwAACUAAAAqgsDZXlg=="
}
```

#### Responses

* **200 OK** — successful parse:

```json
{
  "success": true,
  "result": {
    "parsedCell": {
      "kind": "Foo_foo",
      "v": 42
    }
  }
}

```

* **400 Bad Request** — parsing failed (e.g., invalid TL-B schema or cell)
* **422 Unprocessable Entity** — request body validation failed
* **500 Internal Server Error** — unexpected internal error

##### Example `curl` request:

```bash
curl -X POST http://localhost:3000/parse \
  -H "Content-Type: application/json" \
  -d '{"cell":"te6cckEBAQEABwAACUAAAAqgsDZXlg=="}'
```

### POST `/try-parse`

Attempts to parse a base64-encoded cell **without requiring a TL-B schema**. This endpoint is useful for parsing unknown cells.

#### Request Body

| Field | Type     | Required | Description           |
|-------|----------|----------|-----------------------|
| cell  | `string` | Yes      | A base64-encoded cell |

##### Example:

```json
{
  "cell": "te6cckEBAgEAywABsA+KfqUADpIH1lB9/kBfXhAIAO87mQKicbKgHIk4pSPP4k5xhHqutqYgAB7USnesDnCdABSzBN6cnxDwDjn/IQXqgU8OJXUMcol9pxyL+yLkpKzYiA7msoEBANslk4VhgAIqFqMWTE1aoxM/MRD/EEluAMqKyKvv/FAn4CTTNIDD6gjOY1bdABSzBN6cnxDwDjn/IQXqgU8OJXUMcol9pxyL+yLkpKzYsAJXpnI3GpDhSbfSWGTb/USCfMHoow3xseDEM4UCreKtluqcoI0="
}
```

#### Responses

* **200 OK** — successful parse:

```json
{
  "success": true,
  "result": {
    "parsedCell": {
      "opCode": 260734629,
      "schema": "jettons",
      "internal": "jetton_transfer",
      "data": {
        "kind": "JettonTransfer",
        "query_id": "4101212031974910",
        "amount": "100000000",
        "destination": "EQB3ncyBUTjZUA5EnFKR5_EnOMI9V1tTEAAPaiU71gc4TiUt",
        "response_destination": "EQBSzBN6cnxDwDjn_IQXqgU8OJXUMcol9pxyL-yLkpKzYs9U",
        "custom_payload": { "kind": "Maybe_nothing" },
        "forward_ton_amount": "125000000",
        "forward_payload": {
          "kind": "Either_right",
          "value": { "parsed": {...} }
        }
      }
    }
  }
}
```

* **400 Bad Request** — parsing failed (e.g., invalid TL-B schema or cell)
* **422 Unprocessable Entity** — request body validation failed
* **500 Internal Server Error** — unexpected internal error

##### Example `curl` request:

```bash
curl -X POST http://localhost:3000/try-parse \
  -H "Content-Type: application/json" \
  -d '{"cell":"te6cckEBAgEAywABsA+KfqUADpIH1lB9/kBfXhAIAO87mQKicbKgHIk4pSPP4k5xhHqutqYgAB7USnesDnCdABSzBN6cnxDwDjn/IQXqgU8OJXUMcol9pxyL+yLkpKzYiA7msoEBANslk4VhgAIqFqMWTE1aoxM/MRD/EEluAMqKyKvv/FAn4CTTNIDD6gjOY1bdABSzBN6cnxDwDjn/IQXqgU8OJXUMcol9pxyL+yLkpKzYsAJXpnI3GpDhSbfSWGTb/USCfMHoow3xseDEM4UCreKtluqcoI0="}'
```

## Prometheus Metrics

The service exposes metrics compatible with Prometheus.

### GET `/metrics`

* Exposes uptime, HTTP method/path/status metrics, and default process metrics.

## Healthcheck

The service exposes healthcheck endpoint.

### GET `/health`

* Exposes uptime and current timestamp.

##### Example:

```bash
curl http://localhost:3000/metrics
```

## Running the Service

### Run with Docker

To build the Docker image:

```bash
docker build -t app .
```

To run the container:

```bash
docker run -e PORT=3000 -p 3000:3000 app:latest
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Run with Docker Compose

For local development:

```bash
docker-compose -f docker-compose.develop.yml up
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description                       | Default |
| -------- | --------------------------------- | ------- |
| `PORT`   | Port on which the app will listen | `3000`  |

## Testing

### Run Tests

```bash
yarn test
```
