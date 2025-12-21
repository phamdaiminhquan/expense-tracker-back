# Backend API Updates - Messages với Relations

## Yêu cầu cập nhật

Backend cần cập nhật các endpoints để trả về đầy đủ relations: `fund`, `transaction`, `transaction.category`, `transaction.category.parent`.

## 1. Cập nhật `listByFund()`

**Endpoint**: `GET /funds/{fundId}/messages`

**Yêu cầu**:
- Load relations: `fund`, `transaction`, `transaction.category`, `transaction.category.parent`
- Trả về danh sách messages kèm thông tin fund và transaction đầy đủ

**Example Query (NestJS/TypeORM)**:
```typescript
async listByFund(fundId: string): Promise<MessageDto[]> {
  return await this.messageRepository.find({
    where: { fundId },
    relations: [
      'fund',
      'transaction',
      'transaction.category',
      'transaction.category.parent'
    ],
    order: { createdAt: 'DESC' }
  })
}
```

## 2. Cập nhật `findByIdForUser()`

**Endpoint**: `GET /messages/{transactionId}`

**Yêu cầu**:
- Load cùng các relations như trên
- Đảm bảo message detail có đầy đủ thông tin

**Example Query**:
```typescript
async findByIdForUser(id: string, userId: string): Promise<MessageDto> {
  return await this.messageRepository.findOne({
    where: { id },
    relations: [
      'fund',
      'transaction',
      'transaction.category',
      'transaction.category.parent'
    ]
  })
}
```

## 3. Cập nhật `create()`

**Endpoint**: `POST /funds/{fundId}/messages`

**Yêu cầu**:
- Sau khi tạo transaction, reload message với relations
- Trả về message có đầy đủ transaction và fund

**Example**:
```typescript
async create(fundId: string, payload: CreateMessagePayload): Promise<MessageDto> {
  // Create message and transaction
  const message = await this.messageRepository.save({
    fundId,
    message: payload.message,
    // ... other fields
  })
  
  // Create transaction if needed
  if (payload.spendValue || payload.earnValue) {
    await this.transactionRepository.save({
      messageId: message.id,
      spendValue: payload.spendValue,
      earnValue: payload.earnValue,
      categoryId: payload.categoryId,
      // ... other fields
    })
  }
  
  // Reload with relations
  return await this.messageRepository.findOne({
    where: { id: message.id },
    relations: [
      'fund',
      'transaction',
      'transaction.category',
      'transaction.category.parent'
    ]
  })
}
```

## 4. Cập nhật `update()`

**Endpoint**: `PATCH /messages/{transactionId}`

**Yêu cầu**:
- Sau khi update, reload message với relations
- Đảm bảo response có đầy đủ thông tin

**Example**:
```typescript
async update(id: string, payload: UpdateMessagePayload): Promise<MessageDto> {
  // Update message
  await this.messageRepository.update(id, {
    message: payload.message,
    // ... other fields
  })
  
  // Update transaction if exists
  const transaction = await this.transactionRepository.findOne({
    where: { messageId: id }
  })
  
  if (transaction) {
    await this.transactionRepository.update(transaction.id, {
      spendValue: payload.spendValue,
      earnValue: payload.earnValue,
      categoryId: payload.categoryId,
      // ... other fields
    })
  }
  
  // Reload with relations
  return await this.messageRepository.findOne({
    where: { id },
    relations: [
      'fund',
      'transaction',
      'transaction.category',
      'transaction.category.parent'
    ]
  })
}
```

## Response Format

Khi gọi API messages, response sẽ có format:

```json
{
  "id": "uuid",
  "message": "Bánh tằm bì 25k",
  "status": "processed",
  "fundId": "uuid",
  "createdById": "uuid",
  "createdByName": "User Name",
  "createdAt": "2024-01-01T00:00:00Z",
  "fund": {
    "id": "uuid",
    "name": "Fund name",
    "type": "personal",
    "ownerId": "uuid",
    "memberIds": ["uuid1", "uuid2"],
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "transaction": {
    "id": "uuid",
    "spendValue": 25,
    "earnValue": null,
    "content": "Bánh tằm bì",
    "categoryId": "uuid",
    "createdAt": "2024-01-01T00:00:00Z",
    "category": {
      "id": "uuid",
      "name": "Ăn vặt",
      "description": "...",
      "fundId": "uuid",
      "createdAt": "2024-01-01T00:00:00Z",
      "parent": {
        "id": "uuid",
        "name": "Custom parent",
        "description": "...",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    }
  }
}
```

## Lưu ý

1. **Backward Compatibility**: Frontend đã được cập nhật để xử lý cả response cũ (không có relations) và response mới (có relations)
2. **Priority**: Nếu có `transaction`, frontend sẽ ưu tiên dùng data từ transaction (spendValue, earnValue, content, category)
3. **Fallback**: Nếu không có relations, frontend sẽ fallback về message-level data như trước

## Testing

Sau khi cập nhật backend, test các scenarios:
- ✅ List messages trả về đầy đủ relations
- ✅ Get message detail trả về đầy đủ relations
- ✅ Create message trả về message với relations
- ✅ Update message trả về message với relations đã cập nhật
- ✅ Response có thể có hoặc không có relations (backward compatible)

