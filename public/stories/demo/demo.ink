VAR topic_title = "Demo Story"

EXTERNAL exit()

INCLUDE more.ink

Welcome to the What About platform! # diagram: demo_mascot.jpg

This demo shows how the system works.

Stories are written in Ink, a narrative scripting language that lets you create branching conversations.

* [Tell me about the features]
    Great choice! Let me show you what makes this platform special.
    -> features

* [Show me how choices work]
    Perfect! Choices are the heart of interactive narratives.
    -> choices_explained

=== features ===

The platform has several key features: # diagram: features_diagram.jpg

__Client-side compilation__ means .ink files load and compile in your browser - no build step needed!

__Modular structure__ lets you split large stories into smaller files using INCLUDE statements.

__Dead end detection__ helps you find missing content with a simple command.

__Image support__ allows you to add diagrams and visuals to enhance your narrative.

* [How do I add images?] -> adding_images
* [What about organizing content?] -> organizing_content
* [I'm ready to explore more]
    Thanks for checking out the features! You can always come back to explore more.
    ~ exit()
    -> END

=== choices_explained ===

Choices create branching paths through your story.

Notice how your previous choice appears above this content? That's the choice indicator system!

You can create multiple branches, loops, and complex narratives.

* [That's clever!]
    It helps readers remember the path they took through the story.
    -> more_about_choices

=== more_about_choices ===

The choice system also shows:
• __Selected choices__ in blue (the one you picked)
• __Unselected choices__ greyed out (paths not taken)
• __Choice history__ preserved as you scroll back

This makes it easy to understand the story structure as you explore.

* [Show me the features] -> features
* [I'm done exploring]
    Hope this helped! See you back at the hub.
    ~ exit()
    -> END

