# Delivery Cost Refactoring Summary

## Overview
Refactored the delivery cost feature to implement dynamic pricing based on order subtotal and delivery type. The total price in the order summary now updates automatically when users change delivery options.

## Changes Made

### 1. Created `src/utils/deliveryCost.js`
New utility module with two functions:

- **`calculateDeliveryCost(delivery, subtotal)`**
  - Home Delivery (Standard): £3.50 if subtotal < £45, FREE if ≥ £45
  - Home Delivery (Next Day): Always £5.95
  - Store (Click & Collect): £2.50 if subtotal < £20, FREE if ≥ £20

- **`getDeliveryPriceLabel(type, deliveryOpt, subtotal)`** 
  - Returns formatted price label for display in Delivery component

### 2. Updated `src/components/OrderSummary.jsx`
- **Import**: Added `calculateDeliveryCost` function
- **Delivery Cost Calculation**: Changed from hardcoded logic to use `calculateDeliveryCost(delivery, subtotal)`
- **Dynamic Updates**: Component now recalculates when delivery prop changes
- **Total Recalculation**: Total price updates automatically based on new delivery cost

### 3. Fixed `src/components/Delivery.jsx`
**Critical Bug Fix**: Radio button onChange handlers now call `onSelect()` to notify parent
- Previously: Only updated local state, parent never knew about delivery option changes
- Now: Immediately calls `onSelect()` to notify App component, triggering OrderSummary recalculation

**Additional Improvements**:
- Created `handleDeliveryOptChange()` function to handle delivery option changes
- Updated radio button labels to show pricing rules:
  - Standard: "£3.50 (free on orders over £45)"
  - Next Day: "£5.95"
- Fixed pickup date selection to also call `onSelect()`
- Added Click & Collect pricing info: "£2.50 (free on orders over £20)"

### 4. Updated Test Infrastructure

**`src/setupTests.js`**:
- Added global fetch mock for API calls
- Default mock returns sample product with £10 total

**`src/components/OrderSummary.test.jsx`**:
- Updated test expectations to match new dynamic pricing
- Fixed "shows paid delivery when standard delivery selected" - now expects £3.50 instead of Free
- Enhanced "shows next day delivery cost" test with better element targeting

**`src/utils/deliveryCost.test.js`** (NEW):
- 11 comprehensive tests covering all pricing scenarios
- Tests for edge cases and invalid inputs
- All tests passing ✓

## User Experience Impact

### Before Refactoring
❌ Standard delivery always showed "Free"  
❌ Next day delivery selection didn't update order total  
❌ Click & Collect pricing not implemented  
❌ Order summary didn't react to delivery changes  

### After Refactoring
✅ Delivery prices show correct rules to users  
✅ Order total updates immediately when delivery option changes  
✅ All three delivery methods (Standard, Next Day, Click & Collect) work correctly  
✅ Prices calculated dynamically based on subtotal  

## Data Flow

```
User selects delivery option in Delivery component
    ↓
Delivery calls onSelect() with new deliveryOpt
    ↓
App.handleSelectDelivery() updates delivery state
    ↓
OrderSummary receives updated delivery prop
    ↓
OrderSummary recalculates:
  - Subtotal (from products)
  - deliveryCost (using calculateDeliveryCost)
  - total (subtotal + delivery - discounts)
    ↓
Order summary displays updated prices
```

## Testing Results
- ✅ deliveryCost utility: 11/11 tests passing
- ✅ Delivery component: Core tests passing
- ✅ OrderSummary: Updated tests passing with new pricing logic

## Pricing Rules Reference

| Delivery Type | Condition | Cost |
|---|---|---|
| Standard | < £45 | £3.50 |
| Standard | ≥ £45 | FREE |
| Next Day | Any amount | £5.95 |
| Click & Collect | < £20 | £2.50 |
| Click & Collect | ≥ £20 | FREE |
