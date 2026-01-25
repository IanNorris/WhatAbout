EXTERNAL navigateTo(story_id)
EXTERNAL exit()

VAR topic_title = "On-Device Scanning"

INCLUDE e2e_encryption.ink
INCLUDE scanning_mechanism.ink
INCLUDE false_positives.ink
INCLUDE nudity_filter.ink
INCLUDE scope_creep.ink
INCLUDE conclusion.ink

Let's talk about...
On-device scanning for your messages. # diagram: phone_scanning.png

You might have heard this called "client-side scanning" or "content moderation at the source."

The UK government has proposed requiring smartphones to automatically scan your messages and photos *before* they're encrypted and sent. The goal? To detect illegal content like child sexual abuse material (CSAM) and potentially other harmful content.

It sounds like a reasonable safety measure. After all, we want to protect children.

But here's the thing: this fundamentally breaks how encrypted messaging works. And it creates surveillance infrastructure that can be repurposed in ways you might not expect.

*   [How does this break encryption?]
    -> E2E_Encryption.Breaking_E2E

*   [What exactly gets scanned?]
    -> Scanning_Mechanism.What_Gets_Scanned

*   [Tell me about the nudity filter requirement.]
    -> Nudity_Filter.Age_Verification_Requirement

*   [I've heard enough. What can I do?]
    -> Conclusion.Take_Action
