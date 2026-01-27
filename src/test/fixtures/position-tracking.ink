// Test story for verifying currentPathString tracking
// Simple story with clear knots and stitches

-> Start

=== Start ===
You're at the start.

+ [Go to Section A] -> SectionA
+ [Go to Section B] -> SectionB

=== SectionA ===
You're in Section A.

+ [Go deeper into A] -> SectionA.DeepA
+ [Return to start] -> Start
+ [Go to Section B] -> SectionB

= DeepA
You're deep in Section A.

+ [Go back to Section A] -> SectionA
+ [Go to Section B] -> SectionB
+ [End here] -> END

=== SectionB ===
You're in Section B.

+ [Go to Section B.1] -> SectionB.Part1
+ [Go to Section B.2] -> SectionB.Part2
+ [Return to start] -> Start

= Part1
You're in Section B, Part 1.

+ [Continue] -> SectionB.Part2
+ [Back to Section B] -> SectionB

= Part2
You're in Section B, Part 2.

+ [Finish] -> END
+ [Start over] -> Start
