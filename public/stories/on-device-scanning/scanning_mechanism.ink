=== Scanning_Mechanism ===

= What_Gets_Scanned
The proposal scans both images and text messages before encryption. # diagram: scanning_layers.png

**Images:** AI analyzes photos for matches against known illegal content databases or flags "suspicious" images.

**Text:** The system searches for patterns or keywords indicating illegal activity.

Both happen automatically, on your device, without your consent for each message.

*   [Who's actually implementing this?]
    -> Who_Controls_It

*   [What happens when something's flagged?]
    -> Reporting_Mechanism

= Who_Controls_It
The scanning software runs on iOS or Android, so Apple and Google implement it. # diagram: control_chain.png

But they're doing it because the UK government mandates it.

The government decides *what* to scan. Tech companies build the *tools*. Your phone scans *everything*.

Critical question: who sees the results?

*   [What happens when something's flagged?]
    -> Reporting_Mechanism

*   [Can't we just trust Apple/Google?]
    -> Reporting_Mechanism

= Reporting_Mechanism
When the system flags something, it reports automatically. # diagram: reporting_flow.png

The flagged content goes to the platform (Apple/Google), which may forward it to law enforcement.

You likely won't know you've been flagged. No warrant. No judicial oversight. Just an algorithm deciding what looks "suspicious."

*   [What could go wrong with this?]
    -> False_Positives.Innocent_Content

*   [Surely it only targets serious crimes?]
    -> Scope_Creep.Starts_With_CSAM

*   [How is this different from parental controls?]
    -> Voluntary_vs_Mandatory

*   [Tell me about the nudity filter.]
    -> Nudity_Filter.Age_Verification_Requirement
    
= Voluntary_vs_Mandatory
There's a big difference between optional parental controls and mandatory scanning. # diagram: voluntary_vs_mandatory.png

**Voluntary controls:**
• Parents choose to enable them
• Parents configure what's filtered
• Only parents see reports
• Children know they're monitored

**Mandatory scanning:**
• Everyone scanned automatically
• Government decides what's flagged
• Reports go to law enforcement
• Happens without your knowledge

The problem? The UK wants *both*—and requires age verification to disable the nudity filter.

Even adults need to prove their age to opt out.

*   [Tell me more about age verification.]
    -> Nudity_Filter.Age_Verification_Requirement

*   [What about false positives?]
    -> False_Positives.Innocent_Content

*   [This could expand beyond CSAM?]
    -> Scope_Creep.Starts_With_CSAM
