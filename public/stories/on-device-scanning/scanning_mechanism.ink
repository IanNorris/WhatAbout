=== Scanning_Mechanism ===

= What_Gets_Scanned
The proposals include scanning both images and text messages. # diagram: scanning_layers.png

<>**Image scanning** uses machine learning models to analyze photos before they're sent. The system looks for matches against databases of known illegal content, or uses AI to detect "suspicious" images.

<>**Message screening** analyzes the text of your messages, looking for patterns or keywords that might indicate illegal activity or "harmful content."

Both happen automatically, on your device, without your explicit consent for each message.

-> Who_Controls_It

= Who_Controls_It
Here's where it gets complicated. # diagram: control_chain.png

The scanning software runs on your phone's operating system - iOS or Android. So Apple and Google are the ones implementing it.

But they're doing it because of government requirements. The UK government mandates the scanning, but doesn't directly operate it.

This creates a strange situation where:
• The government decides *what* must be scanned
• Tech companies build the *tools* to do the scanning  
• Your phone automatically scans *everything* you send

And here's the critical question: who sees the results?

-> Reporting_Mechanism

= Reporting_Mechanism
When the scanning system detects something, it has to report it. # diagram: reporting_flow.png

The details vary by proposal, but generally:
1. Your phone scans your content
2. If flagged as "suspicious," a report is generated
3. The report goes to the platform (Apple/Google)
4. The platform may forward it to law enforcement
5. You may not even know you've been flagged

This happens automatically. There's no warrant. No judicial oversight for the initial scan. Just an algorithm making decisions about whether your private messages look "suspicious."

*   [What could go wrong with this?]
    -> False_Positives.Innocent_Content

*   [But this is just for serious crimes, right?]
    -> Scope_Creep.Starts_With_CSAM

*   [What's this about a nudity filter?]
    -> Nudity_Filter.Age_Verification_Requirement

*   [How is this different from parental controls?]
    -> Voluntary_vs_Mandatory
    
= Voluntary_vs_Mandatory
There's a crucial difference between *voluntary* parental controls and *mandatory* scanning. # diagram: voluntary_vs_mandatory.png

<>**Voluntary parental controls** (the good kind):
• Parents choose to enable them
• Parents configure what's filtered
• Parents see the reports (not the government)
• Children know they're being monitored
• Can be disabled when the child is an adult

<>**Mandatory scanning** (the concerning kind):
• Enabled for everyone by default
• Government decides what's flagged
• Reports may go to law enforcement
• Happens without your knowledge
• Cannot be fully disabled

The UK proposals include *both* - but here's the problem: they also require age verification to disable certain features like the nudity filter.

So even if you're an adult who wants privacy, you have to prove your age to a third party to get it.

*   [Tell me more about that age verification requirement.]
    -> Nudity_Filter.Age_Verification_Requirement

*   [What about false positives?]
    -> False_Positives.Innocent_Content

*   [This seems like it could expand beyond CSAM...]
    -> Scope_Creep.Starts_With_CSAM
