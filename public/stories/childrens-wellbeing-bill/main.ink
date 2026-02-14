// Children's Wellbeing and Schools Bill - Overview
// A hub page linking to related story deep-dives

EXTERNAL navigateTo(story_id)
EXTERNAL exit()

VAR topic_title = "Children's Wellbeing Bill"

-> Start

=== Start ===


# diagram: bill_overview.jpg

The Childrens Wellbeing and Schools Bill is a major piece of UK legislation affecting how children interact with digital services.

It contains—or has had amendments proposed for—several significant provisions:

• A unique identifier for every child, shared across government agencies
• Social media restrictions for under-16s
• Age verification requirements
• VPN bans to enforce restrictions
• On-device content scanning

Each provision has trade-offs worth understanding.

*   [Tell me about the unique identifier.]
    -> Unique_Identifier_Intro
*   [What about social media bans?]
    -> Social_Media_Intro
*   [Tell me about age verification.]
    -> Age_Verification_Intro
*   [What's this about VPN bans?]
    -> VPN_Intro
*   [On-device scanning?]
    -> Scanning_Intro

=== Unique_Identifier_Intro ===
# diagram: unique_identifier.jpg
Clause 4 introduces a "consistent identifier" for every child—likely the NHS number—to be shared across health, education, and social care.[1]

The intent: prevent children falling through the gaps between agencies.

The concern: this creates a standardized way to link all records about a child. If breached, everything is exposed at once.[2]

*   [Deep dive: Digital ID and the unique identifier]
    ~ navigateTo("digital-id")
    -> END
*   [Back to overview]
    -> Start

=== Social_Media_Intro ===
# diagram: social_media.jpg
The bill includes provisions for restricting social media access for under-16s.

Supporters say it protects children from harmful content and addictive algorithms.

Critics note that bans push children to less regulated spaces, and require invasive age verification to enforce.

*   [Deep dive: Social Media Bans]
    ~ navigateTo("social-media-bans")
    -> END
*   [Back to overview]
    -> Start

=== Age_Verification_Intro ===
# diagram: age_verification.jpg
To enforce age restrictions, the bill requires platforms to verify users' ages.

This typically means uploading ID documents or face scans—creating databases that are attractive targets for hackers.[2]

*   [Deep dive: Age Verification]
    ~ navigateTo("age-verification")
    -> END
*   [Back to overview]
    -> Start

=== VPN_Intro ===
# diagram: vpn.jpg
Amendments have been proposed to ban or restrict VPNs to prevent children bypassing age verification.

The technical reality: VPNs use the same encryption as banking and government services. You can't block one without breaking the other.

*   [Deep dive: VPN Bans]
    ~ navigateTo("vpn-bans")
    -> END
*   [Back to overview]
    -> Start

=== Scanning_Intro ===
# diagram: scanning.jpg
The Online Safety Act (which the bill amends) requires platforms to detect harmful content—potentially through on-device scanning of messages before encryption.

This would scan everyone's private messages, not just those of suspected criminals.

*   [Deep dive: On-Device Scanning]
    ~ navigateTo("on-device-scanning")
    -> END
*   [Back to overview]
    -> Start
