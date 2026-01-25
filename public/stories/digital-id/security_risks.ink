=== Security_Risks ===
By its very nature, a digital ID system requires persistent access to sensitive data about the entire population. # diagram: persistent_access.png

Even with best-in-class design—whether using a central database or a federated model—compromise of digital ID systems can ripple through all connected services.

Sophisticated attackers don't smash-and-grab.
They silently siphon data and monitor victims over months or years.

This is called an Advanced Persistent Threat (APT). # diagram: apt_infiltration.png
They get in quietly.
They stay undetected.
They watch everything.
They wait for the most valuable moment to strike.

For a data source as valuable as a national identity system, undetected access becomes highly attractive.

*   [But surely our systems are secure?]
    Let me show you the evidence.
    -> One_Login_Breach

=== One_Login_Breach ===
GOV.UK One Login was breached by a red-team—without being detected. # diagram: one_login_breach.png

A red-team is a group of security professionals hired to test defenses by attempting real attacks.
They got in.
The system didn't notice.

This was the system designed to be the gateway to all UK government services.
If a friendly red-team can breach it undetected, what can hostile nation-states do?

And this isn't isolated: # diagram: uk_threat_landscape.png
• The National Cyber Security Centre reports four nationally significant cyber attacks every week
• Over half of UK businesses reported cyber-attacks in the 12 months to 2024
• The JLR attack is still ongoing

*   [That's concerning, but those are other systems.]
    The problem goes deeper than individual systems.
    The entire technology ecosystem is fragile.
    -> Fragile_Ecosystem

=== Fragile_Ecosystem ===
Modern technology is built on layers of complexity. # diagram: tech_stack.png
Each layer introduces new vulnerabilities.

Recent examples:
• A zero-click flaw in Android allowed hackers to remotely control devices
• Around 40% of Android devices no longer receive security updates
• Modern software development relies on complex supply chains
• AI-generated code is already producing wildly insecure software

And age-verification systems created for Online Safety Act compliance are already being compromised. # diagram: av_breaches.png
Britons are having their identity documents stolen.
A cybercrime group stole 2.1 million photos from Discord users—many of them children.

This is happening right now, with systems far simpler than a national digital ID.

*   [Can't we just build it more securely?]
    Every major company has been breached.
    Equifax. Target. Yahoo. Facebook. LinkedIn. Adobe.
    Companies with billions in revenue and dedicated security teams.
    
    The question isn't if digital ID systems will be breached.
    The question is when—and who gets the data.
    -> Surveillance_Concerns
*   [So it's just about security?]
    No. Security is just the first problem.
    The second problem is what these systems enable, even if they work as designed.
    -> Surveillance_Concerns

