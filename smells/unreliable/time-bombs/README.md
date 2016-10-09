# Test Smell: Time Bombs

## Odor Emitted

## Known Causes

## About this Example

### Description

### Challenge

## Language-specific Notes

### Ruby

### JavaScript

## Additional Resources

/* Smell: Time bombs
 *
 * Because of poor date management, the example below will fail erratically in
 * two ways:
 *   * the first test will fail when the system time increments the millisecond
 *   between the `beforeEach` and the end of the first test (which may be between
 *   1% and 20% of the time in my experience)
 *   * the second test will fail on Fridays, Saturdays, and Sundays, as those
 *   will include a weekend day for which the wages earn time-and-a-half. Take it
 *   easy and just run your build on Monday through Thursday!
 */

