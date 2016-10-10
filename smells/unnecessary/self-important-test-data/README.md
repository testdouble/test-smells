# Test Smell: Self Important Test Data

## Odor Emitted

Test data is more complex than is needed to exercise some behavior in a test.

## Known Causes

### 1. The test wouldn't otherwise feel realistic enough

It's important that every test of a unit of code be realistic and robust, but
sometimes that impulse to chase realism can lead developers down strange and
unproductive paths.

Often the line between a test that is realistic and one that merely _looks_
realistic can be blurred, but the original test author is typically the
best-situated to make that determination. Nevertheless, developers often feel
the urge to puff out their chests by making their work appear more self-serious
than it really needs to be, and self-important test data is a clear symptom of
that motivation.

#### Deodorizer

We encourage developers to use the heuristic of [Meaningless Test
Data](https://github.com/testdouble/contributing-tests/wiki/meaningless-test-data)
where possible to create test data that is both minimal and _minimally
meangingful_ to eliminate that ambiguity for future readers. In practice, that
means eliminating everything from one's test data that isn't absolutely
necessary to exercise the behavior under test.

## About this Example

### Description

This example is rather intimidating! …until you realize that most of the lines
of code in the test are there for no reason other than to look like realistic
GPS coordinates. They serve no purpose other than to look "real", which has the
negative consequence of throwing the reader off the trail of the real purpose of
the subject under test, which is to determine whether a given coordinate is
within a particular bounding box.

### Challenge

Do your best to minimize the test data used by the test. Once you're finished,
re-read the test with fresh eyes and see whether or not the increased focus in
the test data does a better job of telling the story of what the subject code
actually does.

## Language-specific Notes

### Ruby

### JavaScript

## Additional Resources

/* Smell: Self-important Test Data
 *
 * The fact the algorithm is wrong is probably lost on us, becuase creating and
 * reading the test data (whether literally in the test or in messages produced
 * by it) drains enough cognition that we might run out of energy to focus on
 * the proper math.
 */

