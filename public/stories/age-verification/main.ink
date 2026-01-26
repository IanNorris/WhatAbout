EXTERNAL navigateTo(story_id)

VAR topic_title = "Age Verification"

// For cross-story navigation
VAR came_from_age_verification = false
VAR came_from_social_media = false

INCLUDE vpn.ink
INCLUDE ai_privacy.ink
INCLUDE enforcement.ink
INCLUDE alternatives.ink
INCLUDE conclusion.ink

Lets talk about...
I think we should age verify online content. # diagram: happy_Internet.png

We want to protect children from harmful content. With ID or age verification, we ensure only adults see adult content.

Bars check IDs, movie theaters enforce ratings, stores verify age for cigarettes and alcohol. Why shouldn't the internet work the same way?

*   [That sounds reasonable.]
    It does. But there's a major loophole that undermines the entire system.
    -> The_Loophole
*   [What's the loophole?]
    -> The_Loophole

=== The_Loophole ===
People can use VPNs to bypass these checks. # diagram: vpn_bypass.png

UK requires age verification but Canada doesn't? VPN to a Canadian server. Click a button. You appear to be in Toronto instead of London. Age gates disappear.

VPN apps are in app stores. Many advertise this exact capability. This pushes people—including teenagers—towards free, often unsafe, VPN services.

*   [What's wrong with free VPNs?]
    -> Free_VPN_Risks
*   [So we should ban VPNs!]
    -> VPN_Ban_Preview

=== Free_VPN_Risks ===
These free VPNs often:
• Log your browsing activity and sell it to advertisers
• Inject ads into the pages you visit
• Contain malware that steals your data
• Route your traffic through compromised servers

In trying to protect children, we've incentivized them to use software that actively harms their privacy and security.

*   [So we should ban VPNs!]
    -> VPN_Ban_Preview
*   [We should use AI to verify age.]
    -> AI_Verification
*   [Can't we just force age verification on the apps?]
    -> Force_Apps

=== VPN_Ban_Preview ===
That seems like the obvious solution. But it's a separate topic with its own complexities—surveillance concerns, legitimate uses, and technical feasibility.

*   [Take me through why VPN bans don't work.]
    ~ navigateTo("vpn-bans")
    -> END
*   [I'll assume they don't. What about AI verification?]
    -> AI_Verification
*   [What about forcing apps to verify age?]
    -> Force_Apps
