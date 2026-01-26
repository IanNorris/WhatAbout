=== Can_We_Detect ===
Here's the technical core of the problem. # diagram: pipes_metaphor.png

Normal traffic = transparent. Encrypted traffic (HTTPS) = opaque but visible. VPN = encrypted tunnel hiding everything inside.

ISPs see you connecting to a VPN server but can't see what's inside.

Here's why you can't block VPNs:
• VPN encryption is identical to banking, medical, and government encryption
• Breaking VPN encryption breaks online security for everyone
• Sophisticated VPNs mimic normal HTTPS traffic perfectly
• Anyone can set up a personal VPN on a $5/month cloud server
• Self-hosted VPNs look indistinguishable from any secure web service

Even pattern detection fails. VPN servers have steady traffic—but so do legitimate services. You'd block banking sites to stop VPNs.

And anyone determined to bypass restrictions can set up their own VPN, undetectable from normal web traffic.

*   [What about China? They block VPNs.]
    They claim to. But it's more complicated.
    -> China_Example
*   [What if we allow only approved VPNs?]
    -> Approved_VPNs
