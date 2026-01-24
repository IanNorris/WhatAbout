VAR topic_title = "Demo Story"

Welcome to the What About platform! # diagram: demo_mascot.png

This demo shows how the system works.

Stories are written in Ink, a narrative scripting language that lets you create branching conversations.

* [Tell me about the features]
    Great choice! Let me show you what makes this platform special.
    -> features

* [Show me how choices work]
    Perfect! Choices are the heart of interactive narratives.
    -> choices_explained

=== features ===

The platform has several key features: # diagram: features_diagram.png

**Client-side compilation** means .ink files load and compile in your browser - no build step needed!

**Modular structure** lets you split large stories into smaller files using INCLUDE statements.

**Dead end detection** helps you find missing content with a simple command.

**Image support** allows you to add diagrams and visuals to enhance your narrative.

* [How do I add images?] -> adding_images
* [What about organizing content?] -> organizing_content
* [I'm ready to explore more] -> END

=== choices_explained ===

Choices create branching paths through your story.

Notice how your previous choice appears above this content? That's the choice indicator system!

You can create multiple branches, loops, and complex narratives.

* [That's clever!]
    It helps readers remember the path they took through the story.
    -> more_about_choices

=== more_about_choices ===

The choice system also shows:
- **Selected choices** in blue (the one you picked)
- **Unselected choices** greyed out (paths not taken)
- **Choice history** preserved as you scroll back

This makes it easy to understand the story structure as you explore.

* [Show me the features] -> features
* [I'm done exploring] -> END

=== adding_images ===

Adding images is simple! # diagram: features_diagram.png

Just add a diagram tag to any paragraph in your Ink file.

Images are automatically loaded from the assets folder for your story.

The system prepends your story ID, so you don't need to repeat it!

* [What else can I do?] -> organizing_content
* [I'm done] -> END

=== organizing_content ===

For large stories, you can split content into multiple files.

For example, a main file can include separate sections using the INCLUDE statement.

Each section can be edited independently, making collaboration easier.

The dead end analyzer helps you find missing content with the analyze-ink command.

* [This is powerful!]
    It is! And it's all designed to make creating interactive content as simple as possible.
    -> END

-> END
