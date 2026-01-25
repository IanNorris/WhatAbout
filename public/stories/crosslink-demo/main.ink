EXTERNAL exit()
EXTERNAL navigateTo(story_id)

VAR topic_title = "Cross-Link Demo"

This is a test story to demonstrate cross-linking between stories.

You can navigate to the Age Verification story from here!

* [Go to Age Verification]
    Let's check that out...
    ~ navigateTo("age-verification")
    -> END

* [Stay here]
    Okay, staying put.
    -> more_content

=== more_content ===
This is more content in the demo story.

* [Actually, take me to Age Verification]
    Alright, let's go!
    ~ navigateTo("age-verification")
    -> END
    
* [I'm done]
    Thanks for testing cross-linking!
    ~ exit()
    -> END
