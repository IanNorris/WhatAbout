=== AI_Verification ===
"AI can estimate age from your face!" # diagram: face_scanning.jpg

Some systems claim 95% accuracy. But let's think about that 5% error rate with real numbers.

*   [What's wrong with 95% accuracy?]
    -> Error_Rate_Reality
*   [What about the privacy concerns?]
    -> Privacy_Concerns

=== Error_Rate_Reality ===
If 100 million people use a site, 5 million get wrongly categorized. # diagram: ai_error_scale.jpg

That's millions of adults locked out, or millions of kids getting through. And that's the *claimed* accuracy under ideal conditions—good lighting, clear photos, facing the camera.

In reality, with varying lighting, camera angles, makeup, filters, and diverse facial features, the error rate could be much higher.

*   [We can review the mistakes manually.]
    -> Manual_Review_Problem
*   [What about privacy then?]
    -> Privacy_Concerns

=== Manual_Review_Problem ===
That's millions of appeals per site, per day.

Who reviews them? How long does it take? What happens while you're waiting? And appeals require... providing more ID to prove your age.

Which brings us to the real concern.

*   [The privacy concern?]
    -> Privacy_Concerns
*   [This doesn't sound workable.]
    -> The_Real_Problem

=== Privacy_Concerns ===
To verify your age with AI, you need to: # diagram: data_collection.jpg
1. Upload a photo of your face
2. Provide it to every website you visit
3. Trust each website to store it securely
4. Hope none of them get hacked

*   [Can't we use a trusted third party?]
    -> Third_Party_Verification
*   [What's the risk of a hack?]
    -> Scale_Of_Problem

=== Scale_Of_Problem ===
Visit 50 different websites requiring age verification: # diagram: fifty_copies.jpg
• 50 companies now have your facial biometric data
• 50 different security systems that need to protect it
• 50 different legal jurisdictions with varying privacy laws
• 50 potential breach points for hackers

*   [Can't one company verify everyone?]
    -> Third_Party_Verification
*   [What about scanning on the device itself?]
    -> On_Device_Scanning_Crosslink

= On_Device_Scanning_Crosslink
Some propose a different approach: scan content on your phone before it's sent.

Detect "harmful content" before it reaches children—filtering or blurring automatically. But this has even deeper privacy and security concerns.

*   [Tell me about on-device scanning.]
    ~ navigateTo("on-device-scanning")
    -> END
*   [Continue with age verification.]
    -> Third_Party_Verification

=== Third_Party_Verification ===
"One company verifies everyone, then issues tokens!" # diagram: honeypot_database.jpg

Now you've created the world's most valuable database:
• Real names and faces
• Complete list of adult websites each person visits
• Timestamps and IP addresses
• Device fingerprints

This is called a "honeypot"—a single target so valuable that every hacker on earth will attack it.

*   [What's the blackmail potential?]
    -> Blackmail_Scenarios
*   [But surely it can be secured?]
    -> Security_Reality

=== Blackmail_Scenarios ===
This data could be misused for: # diagram: blackmail_power.jpg

Targeting public figures or employees. Screening job candidates. Insurance or credit decisions based on browsing patterns.

*   [Can't it be secured though?]
    -> Security_Reality
*   [What if the government runs it?]
    -> Government_ID_Preview

=== Security_Reality ===
Every major company has been hacked. Equifax. Target. Yahoo. Facebook. LinkedIn. Adobe.

Companies with billions in revenue and dedicated security teams. When—not if—this database leaks, millions of people's faces and browsing habits become public.

Perfect for blackmail, identity theft, stalking, harassment, and political persecution.

*   [Has this happened before?]
    -> Data_Breach_Risk
*   [What if the government runs it?]
    -> Government_ID_Preview

=== Government_ID_Preview ===
That's an important question—can we trust the government with this data?

Government-run ID systems have their own serious concerns about surveillance and control.

*   [Tell me about government digital ID.]
    ~ navigateTo("digital-id")
    -> END
*   [Let me hear about the breach risks first.]
    -> Data_Breach_Risk

=== Data_Breach_Risk ===
Recent breaches: # diagram: breach_timeline.jpg
• 2017: Equifax leaked 147 million Social Security numbers
• 2013: Yahoo leaked 3 billion accounts
• 2021: Facebook leaked 533 million phone numbers
• 2024: 2.1 million identity photos stolen from Discord

Age-verification companies are already being compromised. Britons have had their identity documents and face scans stolen.

*   [What would a leak include?]
    -> Leak_Contents
*   [This is getting worse, not better.]
    -> The_Real_Problem

=== Leak_Contents ===
A leak would include:
• Your face and real name
• Every adult website you visited
• When you visited them
• What you searched for

This data is permanent. Once leaked, it's out there forever. Facial recognition means anyone can identify you. Your browsing history can be used to manipulate, embarrass, or control you.

*   [That would be catastrophic.]
    -> Catastrophic_Impact
*   [What's the solution then?]
    -> The_Real_Problem

=== Catastrophic_Impact ===
Leaked data creates lasting consequences:

Browsing history used in legal proceedings. Employment or admission decisions based on online activity. Permanent records that cannot be undone.

This infrastructure, however well-intentioned, creates data too valuable and too dangerous to exist securely.

*   [What's the alternative?]
    -> The_Real_Problem
