# Story Authoring Guide - Avoiding Common Pitfalls

## Critical Issues Found During Testing

### 1. Markdown Bold Syntax at Line Start (`**text:**`)

**Problem**: Ink interprets `**text:**` at the start of a line as a bullet/choice, NOT as markdown.

**Example of Bug**:
```ink
=== My_Section ===
Some intro text.

**Images:** Description of images here.
**Text:** Description of text here.

* [Actual choice 1]
* [Actual choice 2]
```

**Result**: Ink creates FIVE choices:
1. "Images:** Description..."
2. "Text:** Description..."  
3. "Actual choice 1"
4. "Actual choice 2"

When user selects choices 1 or 2, the text displays but story ends → runtime error!

**Solution 1 - Use Bullet Points**:
```ink
=== My_Section ===
Some intro text.

• Images: Description of images here.
• Text: Description of text here.

* [Actual choice 1]
* [Actual choice 2]
```

**Solution 2 - Indent or Add Space**:
```ink
=== My_Section ===
Some intro text.

  **Images:** Description of images here.
  **Text:** Description of text here.

* [Actual choice 1]
* [Actual choice 2]
```

**Why This Happens**: In Ink syntax, `*` or `**` at the start of a line can denote choices/bullets. The parser treats `**text:**` as a special bullet format.

### 2. Non-Sticky Choices Creating Dead-Ends

**Problem**: Using all non-sticky choices (`*`) in exploration sections can create dead-ends when users exhaust all options.

**Example of Bug**:
```ink
=== Exploration_Section ===
Let me explain three concepts.

* [Tell me about concept A]
    -> Concept_A
* [Tell me about concept B]  
    -> Concept_B
* [Tell me about concept C]
    -> Concept_C

=== Concept_A ===
Explanation of A.
-> Exploration_Section  // Returns to main section

=== Concept_B ===
Explanation of B.
-> Exploration_Section  // Returns to main section

=== Concept_C ===
Explanation of C.
-> Exploration_Section  // Returns to main section
```

**Result**: User explores all three concepts → returns to Exploration_Section → all choices consumed → no choices available → runtime error: "ran out of content"

**Solution 1 - Add Sticky Exit Choice** (Recommended):
```ink
=== Exploration_Section ===
Let me explain three concepts.

* [Tell me about concept A]
    -> Concept_A
* [Tell me about concept B]
    -> Concept_B
* [Tell me about concept C]
    -> Concept_C
+ [I understand. Let's continue.] 
    -> Next_Section
```

The `+` makes this choice "sticky" - always available even after other choices are taken.

**Solution 2 - Make All Choices Sticky**:
```ink
=== Exploration_Section ===
Let me explain three concepts.

+ [Tell me about concept A]
    -> Concept_A
+ [Tell me about concept B]
    -> Concept_B
+ [Tell me about concept C]
    -> Concept_C
+ [I've explored enough.]
    -> Next_Section
```

**Trade-off**: Users can select same choice multiple times (seeing same content).

**Solution 3 - Add Auto-Continue**:
```ink
=== Exploration_Section ===
Let me explain three concepts.

* [Tell me about concept A]
    -> Concept_A
* [Tell me about concept B]
    -> Concept_B
* [Tell me about concept C]
    -> Concept_C

// After all choices exhausted:
{not Concept_A: -> DONE}  // If haven't visited A yet, end
You've explored everything!
-> Next_Section
```

## Best Practices

### For Exploration/Educational Sections

**Pattern**: Main section with multiple topics to explore

**Recommended Structure**:
```ink
=== Main_Topic ===
Introduction to the topic.

* [Explore aspect A] -> Detail_A
* [Explore aspect B] -> Detail_B  
* [Explore aspect C] -> Detail_C
+ [I understand enough. What can I do?] -> Conclusion

=== Detail_A ===
Deep dive into A.
-> Main_Topic

=== Detail_B ===
Deep dive into B.
-> Main_Topic

=== Detail_C ===
Deep dive into C.
-> Main_Topic
```

**Key**: Always provide a sticky exit path (`+` choice) so users can leave after exploring some or all options.

### For Linear Sections

**Pattern**: Section that continues automatically after content

**Recommended Structure**:
```ink
=== Linear_Section ===
Content here.

More content.

* [Continue] -> Next_Section
* [Tell me more] -> Additional_Detail

=== Additional_Detail ===
Extra information.
-> Linear_Section  // Returns to give Continue option
```

### For Choice-Based Branches

**Pattern**: User makes a decision that affects story direction

**Recommended Structure**:
```ink
=== Decision_Point ===
You need to choose.

* [Option A] -> Path_A
* [Option B] -> Path_B
// No need for sticky choice here - one-time decision
```

## Testing Your Stories

Use the path discovery test to validate:

```bash
npm run test:run -- src/__tests__/real-stories.test.js
```

The test will find:
- Dead-end paths (no choices available)
- Runtime errors ("ran out of content")
- Unreachable knots

**Interpret Results**:
- ✅ "Loops detected" = OK (users exploring)
- ❌ "Runtime errors" = Bug (fix required)
- ❌ "Dead ends" = Bug (fix required)

## Quick Checklist

Before committing a new story:

- [ ] No `**text:**` at start of lines (use `•` or `__text__` instead)
- [ ] Exploration sections have sticky exit choice (`+`)
- [ ] All sections either:
  - Have at least one sticky choice, OR
  - End with explicit `-> DONE` or `-> END`, OR
  - Auto-continue to another section
- [ ] All referenced images exist in `public/assets/your-story/`
- [ ] Run syntax validation: `npm run test:run -- src/__tests__/story-syntax.test.js`
- [ ] Run image validation: `npm run test:run -- src/__tests__/story-images.test.js`
- [ ] Run path discovery test
- [ ] Check test output for runtime errors

## Common Ink Syntax Reminders

- `*` = Non-sticky choice (disappears after selection)
- `+` = Sticky choice (remains available)
- `-> knot` = Navigate to knot
- `-> END` = End story
- `-> DONE` = End current flow
- `#` = Tag/comment (not shown to user)

## Getting Help

If you encounter story structure issues:
1. Run the path discovery test
2. Check the error path (sequence of choices that failed)
3. Look for exhausted choice sections
4. Add sticky fallback choice to those sections

See `TESTING.md` for more details on running tests.
