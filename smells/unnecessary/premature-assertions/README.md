# Test Smell: Premature Assertions

## Odor Emitted

Intermingled with a test's set-up of the data and objects it depends on are
assertions which attempt to ensure that set-up was successful. The net effect of
this often resembles a "Arrange-Assert-Act-Assert" pattern.

## Known Causes

### 1. Lack of confidence in depended-on code

It may be the case that the original author isn't _quite_ sure that the code the
subject depends on actually works. If that's the case, maybe it's not itself
well-tested, or is perhaps highly-variable depending on broader environmental
issues.

#### Deodorizer

In either case, the best course of action would be to directly increase one's
confidence in those depended-on units, rather than adding prophylactic
assertions to an unrelated test. Either add the tests needed to increase one's
confidence in said units' behavior, or improve their implementations to act more
consistently in the face of changing environmental conditions.

### 2. Believing that more assertions are always better

It's easy to fall into a trap that says all assertions are inherently
good—what's the harm, after all, in making sure that a bit of code works? Well,
as seen in [7-Layer-Testing](../7-layer-testing), unnecessary assertions can
result in significantly reduced productivity for teams when the code being
asserted is changed.

#### Deodorizer

Acknowledging the cost of an assertion as being more than its runtime penalty
(which is often imperceptibly small), but instead a factor of its coupling to
the behavior being asserted, suggests that assertions of a test's arrangements
are typically not appropriate and can be safely deleted. If the arrangement
fails, one should be able to safely presume (if that upstream behavior were
actually necessary) that the ultimate behavior under test would fail as well.

## About this Example

### Description

This test features several rounds of premature assertions making sure that the
subject's dependencies are configured appropriately before continuing.

### Challenge

Consider the design of the subject & its dependencies. Is there a good reason why
the original author might have added the premature assertions? If so, what else
could be done to mitigate that concerns?

Regardless, those premature assertions should ultimately be eliminated. Is there
any other change that should be made to the design to discourage the impulse
that added them in the first place?

## Language-specific Notes

### Ruby

### JavaScript

## Additional Resources

