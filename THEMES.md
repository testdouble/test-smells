If you're exploring this repository without having sniffed a specific smell,
feel free to explore the examples by themes.

## Subjects lack focus and intention in their responsibility
Work through the following examples, giving careful thought to the concepts of
Single Responsibility Principle. Subjects should have one purpose, whether it's
calculation or collaboration. When those two are mixed, tests become hard to
write and understand.

- *[Missing Assertions](./smells/insufficient/missing-assertions)*: Subject does too much, making edges hard to test.
- *[Bury the Lede](./smells/unclear/bury-the-lede)*: Setup too complex.
- *[Chafing](./smells/unclear/chafing)*: Test pain -> Test design instead of code design.
- *[Tangential](./smells/unclear/tangential)*: Mixing levels of abstractions / types of responsibilities.
- *[7 Layer Testing](./smells/unnecessary/7-layer-testing)*: Test can't escape interaction with God object.
- *[Contaminated Test Subject](./smells/unrealistic/contaminated-test-subject)*: Very large or stateful subject.
- *[Invasion of Privacy](./smells/unrealistic/invasion-of-privacy)*: Testing code that should be its own unit.
- *[X-Ray Specs](./smells/unrealistic/x-ray-specs)*: Tests secretly edit private state. Subject has too many responsibilities.

## Tests aren't isolated and are testing more than just a single unit
Work through the following examples, giving careful thought to role of the test
within the test suite, being sure to consider what experiment the test is conducting.

- *[Tangential](./smells/unclear/tangential)*: Test subject depends on unrelated things.
- *[7 Layer Testing](./smells/unnecessary/7-layer-testing)*: Test subject depends on "reusable blocks" below subject.
- *[Complex Assertions](./smells/unclear/complex-assertions)*: Test relies on side effects.
- *[Indecisive](./smells/unclear/indecisive)*: Inconsistent setup causes tests to check data's state.
- *[Premature Assertions](./smells/unnecessary/premature-assertions)*: Lack of confidence in subject's dependencies
- *[Mockers without Borders](./smells/unrealistic/mockers-without-borders)*: Some dependencies are polluting the test, some are mocked.

## Testing too much
Work through the following examples, analyzing the costs and benefits of each test.

- *[Invisible Assertions](./smells/insufficient/invisible-assertions)*: Sky might fall / Doesn't blow up.
- *[Quixotic](./smells/insufficient/quixotic)*: Overly integrated journey.
- *[Long](./smells/unclear/long)*: Failing to slice numerous concerns into individual, focused test cases.
- *[Generative](./smells/unclear/generative)*: Testing numerous redundant examples, watering down the degree to which the test expresses your intention.
- *[Paranoid](./smells/unnecessary/paranoid)*: Test covers edge cases that aren't actually possible.
- *[Premature Assertions](./smells/unnecessary/premature-assertions)*: Believing more assertions are always better.
- *[Test by Number](./smells/unnecessary/test-by-number)*: Wrote test + checked box.

## Test's value is unclear
Work through the following examples, keeping in mind that a test is a means of
communication. A test and the code that it is testing should be as self
documenting as possible because a test is read far more times than it is written.

- *[Quixotic](./smells/insufficient/quixotic)*: Test doesn't clearly document a single unit.
- *[Missing Assertions](./smells/insufficient/missing-assertions)*: Some code paths aren't tested. Corners of code are neglected.
- *[Indecisive](./smells/unclear/indecisive)*: Environment specific tests - what does a failure mean?
- *[Long](./smells/unclear/long)*: when this test fails, what's actually broken?
- *[Paranoid](./smells/unnecessary/paranoid)*: What input actually triggers logical branching in code?
- *[Self Important Test Data](./smells/unnecessary/self-important-test-data)*: If the test data had fewer properties, could the subject code still be verified?
- *[Fantasy](./smells/unrealistic/fantasy)*: Test dependencies aren't realistic.
- *[Surreal](./smells/unrealistic/surreal)*: Taking Contaminated Test Subject and Mockers without Borders to the extreme.

## Test erodes confidence
Work through the following examples, considering that the purpose of a test is
to provide confidence that code works.

- *[Fire and Forget](./smells/unreliable/fire-and-forget)*: Performing assertions before setup or actions have completed.
- *[Plate Spinning](./smells/unreliable/plate-spinning)*: Test depends on multiple things happening successfully before assertions pass.
- *[Litter Bugs](./smells/unreliable/litter-bugs)*: Tests don't cleanup, possibly order dependent.
- *[Time Boms](./smells/unreliable/time-bombs)*: Tests that fail based on time.

