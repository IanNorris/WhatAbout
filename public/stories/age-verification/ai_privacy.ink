=== AI_Verification ===
"AI can estimate age from your face!" # diagram: face_scanning.png
The technology exists. Some systems claim 95% accuracy.

But let's think about that 5% error rate with real numbers:

If 100 million people use a site, 5 million get wrongly categorized.
That's millions of adults locked out, or millions of kids getting through.

And that's the *claimed* accuracy under ideal conditions—good lighting, clear photos, facing the camera directly.
In reality, with varying lighting, camera angles, makeup, filters, and diverse facial features across different ethnicities, the error rate could be much higher.

Some people look older than they are. Some look younger.
A 16-year-old who looks 20 gets through.
A 25-year-old who looks young gets blocked. # diagram: ai_error_scale.png

*   [We can review the mistakes manually.]
    Can you? That's millions of appeals per site, per day.
    Who reviews them? How long does it take? What happens while you're waiting?
    And appeals require... providing more ID to prove your age. Which brings us to the real concern.
    -> Privacy_Concerns

=== Privacy_Concerns ===
To verify your age with AI, you need to: # diagram: data_collection.png
1. Upload a photo of your face.
2. Provide it to every website you visit.
3. Trust each website to store it securely.
4. Hope none of them get hacked.

Think of it like this: instead of showing your ID at the door of one bar, you have to give a photocopy of your ID to every bar in the city.

Each copy is stored in a filing cabinet that might get stolen.
And unlike a physical filing cabinet in one bar's office, these digital copies can be stolen from anywhere in the world.
They can be sold on dark web marketplaces.
They can be used to train facial recognition systems without your consent.
They can be cross-referenced with other databases to track everywhere you go online.

Consider what happens when you visit 50 different websites requiring age verification: # diagram: fifty_copies.png
• 50 different companies now have your facial biometric data
• 50 different security systems that need to protect it
• 50 different legal jurisdictions with varying privacy laws
• 50 potential breach points for hackers

*   [Can't we use a trusted third party?] -> Third_Party_Verification
*   [What about biometric data being leaked?] -> Data_Breach_Risk
*   [What about scanning messages on the phone itself?] -> On_Device_Scanning_Crosslink

= On_Device_Scanning_Crosslink
Some have proposed a different approach: instead of verifying age at websites, scan content on your phone before it's sent.

The idea is to detect "harmful content" before it reaches children - filtering or blurring it automatically.

But this approach has even deeper privacy and security concerns.

Would you like to explore on-device scanning?

*   [Yes, tell me about on-device scanning.]
    ~ navigateTo("on-device-scanning")
    -> END

*   [No, continue with age verification.]
    -> Privacy_Concerns

=== Third_Party_Verification ===
"One company verifies everyone, then issues tokens!" # diagram: honeypot_database.png

Now you have created the world's most valuable database:
• Real names
• Real faces  
• Complete list of adult websites each person visits
• Timestamps of when they visited
• IP addresses showing where they were
• Device fingerprints revealing what devices they use

This is called a "honeypot" in security—a single target so valuable that every hacker on earth will attack it.

Imagine the blackmail potential: # diagram: blackmail_power.png
Public figures, politicians, religious leaders—all their private browsing exposed.
Job candidates having their internet history reviewed by employers.
Insurance companies denying coverage based on inferred health concerns from browsing patterns.
Authoritarian regimes identifying dissidents by what they read.

*   [But surely it can be secured?]
    Every major company has been hacked. Equifax. Target. Yahoo. Facebook. LinkedIn. Adobe.
    Companies with billions in revenue and dedicated security teams.
    When—not if—this database leaks, millions of people's faces and browsing habits become public.
    Perfect for blackmail, identity theft, stalking, harassment, and political persecution.
    You've built the surveillance infrastructure of an authoritarian's dreams.
    -> The_Real_Problem
*   [What if the government runs it instead?]
    That's an important question. Can we trust the government with this data?
    ~ navigateTo("digital-id")
    -> END

=== Data_Breach_Risk ===
In 2017, Equifax leaked 147 million people's Social Security numbers, birth dates, and addresses. # diagram: breach_timeline.png
In 2013, Yahoo leaked 3 billion accounts.
In 2018, Marriott leaked 500 million passport numbers.
In 2021, Facebook leaked 533 million users' phone numbers and personal data.
In 2022, Twitter exposed 5.4 million accounts.
In 2024, a cybercrime group stole 2.1 million identity photos from Discord users—many of them children being age-verified.

These weren't small companies. These were industry giants with massive security budgets.
And age-verification companies are already being compromised, with Britons having their identity documents and face scans stolen.

Now imagine a leak that includes:
• Your face
• Your real name
• Every adult website you visited
• When you visited them
• How long you stayed on each page
• What you searched for

This data is permanent. Once leaked, it's out there forever.
Facial recognition means anyone can identify you from photos.
Your browsing history can be used to manipulate, embarrass, or control you.

Think about the implications:
Divorce proceedings using browsing history as evidence.
College admissions rejections based on leaked teenage searches.
Jobs lost because of legal but embarrassing website visits.
Political campaigns destroyed by opposition research.

*   [That would be catastrophic.]
    Yes. And it's not a matter of *if*, but *when*.
    You've created a surveillance system that starts with good intentions...
    ...but becomes a tool for control and blackmail.
    The data is simply too valuable and too dangerous to exist.
    -> The_Real_Problem
