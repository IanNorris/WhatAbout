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

On the surface, it seems like a no-brainer.
We want to protect children from harmful content. 
If we require ID or age verification, we can ensure only adults see adult content.

The reasoning sounds solid: bars check IDs at the door, movie theaters enforce ratings, stores verify age for cigarettes and alcohol. Why shouldn't the internet work the same way?

After all, a child stumbling onto explicit content can be traumatizing. Parents worry constantly. And we have the technology to prevent it.

*   [That sounds reasonable.]
    It does. Ideally, it works perfectly.
    But there is a major loophole that undermines the entire system.
    And when you pull on this thread, the whole idea starts to unravel.
    -> The_Loophole

=== The_Loophole ===
People can use VPNs (Virtual Private Networks) to bypass these checks. # diagram: vpn_bypass.png
By routing their traffic through a different country that doesn't have these laws, they can access whatever they want.

Think about it: if the UK requires age verification, but Canada doesn't, all you need is a VPN server in Canada.
Click a button. Your internet connection appears to originate from Toronto instead of London.
Suddenly, those age gates disappear.

This doesn't require technical expertise. VPN apps are downloadable from app stores. Many advertise this exact capability.
And here's the problem: this pushes people—including teenagers—towards free, often unsafe, VPN services just to access the web.

These free VPNs often:
• Log your browsing activity and sell it to advertisers
• Inject ads into the pages you visit
• Contain malware that steals your data
• Route your traffic through compromised servers

So in trying to protect children, we've incentivized them to use software that actively harms their privacy and security.

*   [So we should ban VPNs!]
    That's an important question. Let me walk you through why that doesn't work.
    ~ navigateTo("vpn-bans")
    -> END
*   [We should use AI to verify age.] -> AI_Verification
*   [Can't we just force age verification on the apps?] -> Force_Apps
*   [What about other solutions?]
    Yes. Let me show you what actually works.
    ~ navigateTo("better-parental-controls")
    -> END

