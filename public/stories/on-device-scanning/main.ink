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

The UK wants to require smartphones to scan your messages and photos *before* they're encrypted. The goal sounds good: detect child abuse material (CSAM).

But it fundamentally breaks encryption—and creates surveillance infrastructure governments can repurpose.

*   [How does this break encryption?]
    -> E2E_Encryption.Breaking_E2E

*   [What exactly gets scanned?]
    -> Scanning_Mechanism.What_Gets_Scanned

*   [I'm concerned about the nudity filter requirement.]
    -> Nudity_Filter.Age_Verification_Requirement

*   [What can I do about this?]
    -> Conclusion.Take_Action
