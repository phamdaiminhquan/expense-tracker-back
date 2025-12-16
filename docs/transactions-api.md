# Messages module API

Protected with Bearer access token.

## List messages by fund
GET `/funds/{fundId}/messages`
Response: array of messages for the fund.

## Create message
POST `/funds/{fundId}/messages`
```json
{
  "message": "Mua cafe 30k",
  "spendValue": 30,          // optional
  "earnValue": null,         // optional
  "content": "Cafe với team", // optional
  "categoryId": "uuid"      // optional
}
```
Response: created message. If no spend/earn, status is `pending` and will be parsed by worker.

## Message detail
GET `/messages/{transactionId}`

## Update message
PATCH `/messages/{transactionId}`
```json
{ "spendValue": 40, "content": "Cafe và bánh" }
```

## Delete message
DELETE `/messages/{transactionId}`
Response: `{ "success": true }`

Notes:
- Status values: `pending`, `processed`, `failed`.
- Parsed results saved into spend/earn/content/categoryId; `metadata` may contain extra info.
