// Facial Recognition Story
// Covers police and retail use, racial bias, and connection to age verification

EXTERNAL navigateTo(storyId)
EXTERNAL exit()

-> Start

=== Start ===

# diagram: facial_recognition.jpg

Facial recognition is spreading across the UK—in police vans, shopping centres, and even corner shops.

The technology scans your face and creates a unique "faceprint" to identify you, much like a fingerprint.

+ [How widespread is it?]
    -> How_Widespread

+ [What's the problem?]
    -> The_Problem

+ [I've heard it's biased?]
    -> Racial_Bias

=== How_Widespread ===

# diagram: lfr_deployment.jpg

Ten police forces in England and Wales now have their own live facial recognition systems. [1]

Retailers are adopting it rapidly too. Facewatch, a private company, sent over 516,000 alerts to UK shops in 2025—double the previous year. [2]

Shops using facial recognition include Sainsbury's, Sports Direct, B&M, and Home Bargains.

You've likely been scanned without knowing it.

+ [What about police databases?]
    -> Police_Database

+ [Tell me about retail systems]
    -> Retail_Systems

+ [Back to start]
    -> Start

=== Police_Database ===

# diagram: database.jpg

Police facial recognition systems check your face against watchlists built from various sources.

These include the police custody image database—which holds 19 million photos, including "vast numbers of photos of innocent people." [1]

Watchlists have also included people with suspected mental health problems and political campaigners—not just criminals.

+ [Has anyone been wrongly identified?]
    -> Misidentification_Cases

+ [What about racial bias?]
    -> Racial_Bias

+ [Back to start]
    -> Start

=== Retail_Systems ===

# diagram: retail_cameras.jpg

Private facial recognition in shops works differently from police systems.

Companies like Facewatch maintain shared databases. If one shop flags you as a suspected shoplifter, you can be banned from every shop using the system—across entire regions.

There's no court case, no conviction required. Just an allegation.

+ [Has this gone wrong?]
    -> Wrongful_Bans

+ [Is this even legal?]
    -> Legal_Status

+ [Back to start]
    -> Start

=== Wrongful_Bans ===

# diagram: wrongful_ban.jpg

Yes. Multiple times.

A 64-year-old woman was banned from shops in her area after being wrongly flagged for allegedly stealing paracetamol worth less than £1. Her daughter said she's now "scared to go shopping alone." [3]

In Manchester, Danielle Horan was harassed and publicly humiliated in two separate stores. Facewatch later admitted she had paid for her items. [4]

Byron Long in Cardiff was falsely accused of theft at B&M due to a system error. [5]

+ [How accurate are these systems?]
    -> Accuracy

+ [What about racial bias?]
    -> Racial_Bias

+ [What can I do about this?]
    -> Take_Action

=== Misidentification_Cases ===

# diagram: misidentification.jpg

In February 2024, Shaun Thompson—a Black anti-knife crime community volunteer—was misidentified by Met Police facial recognition at London Bridge.

He's now bringing a legal challenge against the Metropolitan Police. [1]

In 2019, a man in London was fined £90 simply for covering his face to avoid being scanned. [1]

80% of people misidentified by facial recognition in London in 2025 were Black. [1]

+ [Why is there racial bias?]
    -> Racial_Bias

+ [What about shops?]
    -> Wrongful_Bans

+ [What can I do?]
    -> Take_Action

=== The_Problem ===

# diagram: the_problem.jpg

There are three main concerns:

• It's intrusive—tens of millions have been scanned without consent

• It's discriminatory—the technology performs worse on women and people of colour

• It's undemocratic—police have used it for a decade without Parliament passing specific laws [1]

The UK's human rights regulator believes the Met Police's use of live facial recognition is unlawful. [1]

+ [Tell me about the discrimination]
    -> Racial_Bias

+ [How widespread is this?]
    -> How_Widespread

+ [What can I do?]
    -> Take_Action

=== Racial_Bias ===

# diagram: racial_bias.jpg

Facial recognition systems consistently perform worse on darker skin tones.

A UK National Physical Laboratory study found the false positive rate for Black women was 9.9%—compared to just 0.04% for white subjects under similar conditions. [6]

That's not a small difference. It's a 247x higher error rate.

80% of people misidentified by police facial recognition in London in 2025 were Black. [1]

+ [Why does this happen?]
    -> Why_Bias

+ [Does this affect age verification too?]
    -> Age_Verification_Bias

+ [What's being done about it?]
    -> Regulatory_Response

=== Why_Bias ===

# diagram: training_data.jpg

The core problem is training data.

Facial recognition algorithms learn from datasets of faces. If those datasets underrepresent people with darker skin—which they typically do—the system learns to recognise lighter faces better.

It's not intentional racism. But the effect is the same: people of colour are more likely to be wrongly accused, stopped, or banned.

+ [Does this affect age verification?]
    -> Age_Verification_Bias

+ [What about the Roblox situation?]
    -> Roblox_Example

+ [What can be done?]
    -> Take_Action

=== Age_Verification_Bias ===

# diagram: age_verification.jpg

Yes. Age estimation uses the same underlying facial analysis technology.

NIST's 2024 evaluation confirmed that age estimation accuracy is lower for people with darker skin tones. [7]

This creates two problems:

• False rejections—adults wrongly blocked from services

• False approvals—minors incorrectly verified as older

When the Online Safety Act requires age verification, these biases will affect who can access services.

+ [Tell me about the Roblox example]
    -> Roblox_Example

+ [Back to racial bias]
    -> Racial_Bias

+ [What can I do?]
    -> Take_Action

=== Roblox_Example ===

# diagram: roblox.jpg

Roblox launched AI-powered age verification in early 2026. Within days, it was chaos.

Parents reported their 10-year-olds being classified as over 18. Adults with beards were marked as 13-15. [8]

Age-verified accounts for children as young as 9 appeared on eBay for $4. A child who drew wrinkles on his face with marker was verified as 21+. [8]

Chat activity on games dropped from 85% to 36% after the update. Developers called it "lifeless" and "a total ghost town." [8]

+ [What about racial bias in this?]
    -> Age_Verification_Bias

+ [Back to the main issues]
    -> The_Problem

+ [What can I do?]
    -> Take_Action

=== Regulatory_Response ===

# diagram: ico.jpg

The ICO (data regulator) demanded "urgent clarity" from the Home Office after learning about racial bias in police systems—from news reports, not the government. [6]

In 2023, the ICO found Facewatch had breached data regulations. [4]

The UK's Equality and Human Rights Commission believes the Met's use of facial recognition is unlawful. [1]

Despite this, the technology continues to expand.

+ [What can I do?]
    -> Take_Action

+ [Back to start]
    -> Start

=== Legal_Status ===

# diagram: legal.jpg

Police have used live facial recognition for a decade without Parliament passing specific laws authorising it. [1]

For private use, the ICO found Facewatch breached data regulations in 2023—but the company still operates.

A Home Office consultation on facial recognition law is open until February 2026. [1]

The technology exists in a legal grey zone, expanding faster than regulation can keep up.

+ [What can I do?]
    -> Take_Action

+ [Back to start]
    -> Start

=== Accuracy ===

# diagram: accuracy.jpg

Companies claim high accuracy rates in controlled conditions.

But real-world deployments tell a different story. Lighting, angles, image quality, and demographics all affect performance.

The wrongful bans and misidentifications aren't rare edge cases—they're predictable outcomes when imperfect technology is deployed at scale.

When you scan millions of people, even a 1% error rate means tens of thousands of mistakes.

+ [What about racial bias?]
    -> Racial_Bias

+ [What can I do?]
    -> Take_Action

=== Take_Action ===

# diagram: take_action.jpg

You have options:

• **Subject Access Request**: Ask any company using facial recognition what data they hold on you

• **Respond to consultations**: The Home Office consultation on facial recognition law closes February 2026 [1]

• **Support legal challenges**: Big Brother Watch is backing court cases against police and retail facial recognition [1]

• **Contact your MP**: Ask what safeguards they support

+ [Tell me more about age verification concerns]
    ~ navigateTo("age-verification")
    -> DONE

+ [What about the Children's Wellbeing Bill?]
    ~ navigateTo("childrens-wellbeing-bill")
    -> DONE

+ [Back to start]
    -> Start

+ [Exit]
    ~ exit()
    -> DONE
