=== Nudity_Filter ===

= Age_Verification_Requirement
Here's where it gets even more concerning. # diagram: nudity_filter_av.png

The UK proposals include a "nudity filter" that automatically blurs images containing nudity before displaying them in messages.

Sounds optional, right? You're an adult, you can just turn it off.

Not so fast. To disable the nudity filter, you need to **prove your age** through age verification.

-> The_Privacy_Trap

= The_Privacy_Trap
This creates a catch-22 for privacy. # diagram: privacy_trap.png

Option 1: **Keep the filter enabled**
• Your phone blurs perfectly legal content between consenting adults
• You have to manually unblur every flagged image
• The system still scans everything (it has to, to know what to blur)

Option 2: **Disable the filter with age verification**
• Upload your ID or face scan to a third party
• Create a permanent record of your identity tied to your messaging
• Hope that database doesn't get breached (spoiler: they always do)

Either way, your privacy is compromised.

-> Why_This_Matters

= Why_This_Matters
This isn't about pornography. # diagram: nudity_broad_definition.png

AI "nudity detection" is notoriously broad and inaccurate. It flags:
• Classical art (Venus de Milo, Sistine Chapel)
• Medical images and diagrams
• Breastfeeding photos  
• Beach or swimming photos
• Artistic photography
• Educational anatomy content

And remember: to unblur these innocent images, you need to age verify.

-> The_Surveillance_Connection

= The_Surveillance_Connection
Now connect the dots: # diagram: scanning_plus_av.png

1. Your phone scans all your messages (on-device scanning)
2. Images with nudity are flagged and blurred (nudity filter)
3. To unblur them, you must age verify (prove your identity)
4. Now your real identity is linked to your messaging account
5. Any flags or reports can be tied directly to you

This isn't just about protecting children. It's about creating a system where:
• Everyone is scanned
• Everyone is identified  
• Everything is potentially reportable

-> Cannot_Age_Verify

= Cannot_Age_Verify
And here's a personal concern from the user who built this app: # diagram: locked_out.png

Some people **cannot** age verify, even if they wanted to:

• No government-issued photo ID (not everyone has a passport or driver's license)
• Privacy-conscious individuals who refuse to participate in biometric scanning
• People whose documents don't match their appearance (trans individuals, for example)
• Those living off-grid or without traditional identification

What happens to them? Are they just... locked out of modern communication?

Forced to have all nudity blurred, even legal content between consenting adults, because they won't hand over their biometric data?

*   [Tell me about the age verification concerns.]
    -> Age_Verification_Crosslink

*   [And what about digital ID?]
    -> Digital_ID_Crosslink

*   [How does this connect to parental controls?]
    -> Parental_Controls_Crosslink

*   [I've heard enough. What can I do?]
    -> Conclusion.Take_Action

= Age_Verification_Crosslink
The age verification system required to disable the nudity filter has serious problems of its own.

These systems require uploading identity documents or face scans to third-party companies. Those databases are being breached - 2.1 million ID verification photos were stolen from Discord users in recent attacks.

Would you like to explore the broader age verification concerns?

*   [Yes, tell me about age verification issues.] 
    ~ navigateTo("age-verification")
    -> END

*   [No, continue with on-device scanning.]
    -> Age_Verification_Requirement

= Digital_ID_Crosslink  
There's another concerning connection here.

The government is also pushing smartphone-based digital ID systems. Once your age verification is tied to a digital ID stored on your phone, you've created a direct link between:
• Your verified identity
• Your messaging activity
• Your flagged content

This surveillance infrastructure can be repurposed in ways we haven't fully considered yet.

Would you like to explore the digital ID concerns?

*   [Yes, tell me about digital ID.]
    ~ navigateTo("digital-id")
    -> END

*   [No, continue with on-device scanning.]
    -> Age_Verification_Requirement

= Parental_Controls_Crosslink
There's a better way to protect children that doesn't involve scanning everyone's messages. # diagram: better_way.png

<>**Voluntary, parent-controlled** filtering:
• Parents choose to enable it for their children
• Parents configure what's appropriate
• Parents receive reports (not the government)
• Disabled automatically when the child becomes an adult
• No age verification required for adults to opt out

This gives parents the tools they need without building mass surveillance infrastructure.

Would you like to see what good parental controls look like?

*   [Yes, show me better parental controls.]
    ~ navigateTo("better-parental-controls")
    -> END

*   [No, continue with on-device scanning.]
    -> Age_Verification_Requirement
