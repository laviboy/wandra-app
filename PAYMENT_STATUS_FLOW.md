# Payment & Booking Status Flow

## Database Schema Analysis

### Key Fields
- `status` - Overall booking lifecycle status
- `payment_status` - Payment completion stage
- `deposit_paid` - Boolean for first payment (20%)
- `deposit_amount` - Amount for first payment

## Recommended Status Flow

### Booking Status (`status`)
```
pending_payment  → Booking created, awaiting first payment
     ↓
accepted         → Agent accepts booking + deposit paid
     ↓
confirmed        → All payments completed (100%)
     ↓
completed        → Trip finished
```

**Alternative paths:**
- `cancelled` - Can happen at any stage
- `rejected` - Agent rejects the booking request

### Payment Status (`payment_status`)
```
pending       → No payments made (0%)
     ↓
deposit_paid  → First installment paid (20%)
     ↓
partial_paid  → Second installment paid (50% total = 20% + 30%)
     ↓
completed     → All payments done (100% = 20% + 30% + 50%)
```

## Implementation Strategy

### Payment Milestone Tracking

**Option 1: Use payment_status stages (Recommended)**
- Simpler, uses existing schema
- Track progress via `payment_status` enum
- Boolean `deposit_paid` for backward compatibility

**Option 2: Add new fields**
```sql
second_payment_paid BOOLEAN DEFAULT false
final_payment_paid BOOLEAN DEFAULT false
```

**Option 3: Separate payments table** (Most flexible, future-proof)
```sql
CREATE TABLE payment_transactions (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES travel_group_bookings(id),
  payment_type VARCHAR(50), -- 'deposit', 'second', 'final'
  amount NUMERIC(10,2),
  status VARCHAR(50), -- 'pending', 'processing', 'completed', 'failed'
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Recommended: Option 1 Implementation

### Updated Status Transitions

1. **Booking Created**
   - `status` = 'pending_payment'
   - `payment_status` = 'pending'
   - `deposit_paid` = false

2. **First Payment (20%)**
   - `status` = 'accepted'
   - `payment_status` = 'deposit_paid'
   - `deposit_paid` = true
   - `deposit_amount` = calculated amount

3. **Second Payment (30%)**
   - `status` = 'accepted'
   - `payment_status` = 'partial_paid'
   - `deposit_paid` = true

4. **Final Payment (50%)**
   - `status` = 'confirmed'
   - `payment_status` = 'completed'
   - `deposit_paid` = true
   - `confirmed_at` = NOW()

### calculatePaymentMilestones Logic

```typescript
// Milestone 1 (20%)
if (deposit_paid === true || payment_status in ['deposit_paid', 'partial_paid', 'completed']) {
  status = 'paid'
}

// Milestone 2 (30%)
if (payment_status in ['partial_paid', 'completed']) {
  status = 'paid'
} else if (payment_status === 'deposit_paid') {
  status = 'current' or 'overdue' based on dueDate
}

// Milestone 3 (50%)
if (payment_status === 'completed') {
  status = 'paid'
} else if (payment_status === 'partial_paid') {
  status = 'current' or 'overdue' based on dueDate
}
```

## Benefits of This Approach

1. ✅ Uses existing schema (no migration needed)
2. ✅ Clear payment progression
3. ✅ Easy to query and filter bookings by payment stage
4. ✅ Backward compatible with `deposit_paid`
5. ✅ Simple to understand and maintain

## Future Enhancement

If payment logic becomes more complex:
- Create `payment_transactions` table
- Store each payment record separately
- Calculate status from transaction records
- More audit trail and refund support
