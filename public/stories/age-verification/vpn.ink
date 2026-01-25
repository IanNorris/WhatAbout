=== Ban_VPNs ===
I get it. If VPNs are the problem, why not get rid of them?
But let's look at the legitimate uses of VPNs first. # diagram: vpn_uses_v2.png

Security for remote workers accessing company systems.
Protecting privacy on public Wi-Fi at cafes and airports.
Helping people in restrictive regimes access information.
Journalists protecting their sources and communications.
Activists avoiding government surveillance in authoritarian countries.
Businesses conducting sensitive communications and financial transactions.

And arguably more importantly... can we actually detect a VPN?

*   [Surely technology can tell?]
    
    Think of the internet like a series of pipes. # diagram: pipes_metaphor_v2.png
    Normal traffic is like a clear glass pipe. You can see the water (data) and where it's going.
    Encrypted traffic (like HTTPS, which is most of the web now) is like an opaque pipe. You know where the pipe goes, but you can't see the water.
    
    A VPN is like putting a pipe *inside* another pipe.
    The ISP (Internet Service Provider) only sees the outside pipe—they see you connecting to a VPN server.
    They have no idea what connections are inside or where they lead.
    
    Here's the technical reality:
    VPN traffic is just encrypted data packets flowing to a server.
    The same encryption protocols used by VPNs are also used by banks, hospitals, and government agencies.
    If you could break VPN encryption, you'd also break online banking, medical records, and national security communications.
    
    The patterns *might* look slightly different—VPNs tend to have persistent connections with steady traffic.
    But sophisticated VPN protocols can mimic normal HTTPS traffic perfectly.
    And self-hosted VPNs (which anyone can set up on a cloud server for $5/month) are indistinguishable from any other secure web service.
    
    If you ban the outer pipes, you break the secure tunnels used by banks, governments, and businesses.
    If you try to ban specific VPN companies, they just move or change their IP addresses.

-
*   [What about China? They block VPNs.] -> China_Example
*   [Can't we just allow "approved" VPNs?] -> Approved_VPNs
*   [This seems impossible.] -> The_Real_Problem

=== China_Example ===
China's Great Firewall is often cited as proof that VPN blocking works. # diagram: great_firewall_v2.png
But here's what actually happens:

The government plays Whac-A-Mole with VPN servers. They block known VPN IP addresses.
VPN companies create new servers with new IPs.
The cycle repeats endlessly.

China employs thousands of engineers and censors working full-time on this problem.
They use deep packet inspection, analyzing traffic patterns at the millisecond level.
They monitor connections and block suspicious patterns.
They even block entire protocols that might be used for circumvention.

And yet...

Meanwhile, technically savvy users create their own VPN servers on cloud platforms. These look like normal encrypted web traffic.
Students studying abroad connect back to their home country's servers.
Businesses maintain international connections that can't be blocked without crippling trade.

The government would have to block all encrypted traffic to all foreign servers—which would shut down international business.
China's economy depends on foreign investment, manufacturing exports, and international trade.
Cutting off encrypted connections to the outside world would be economic suicide.

*   [So even China can't fully stop it?]
    Exactly. They make it harder and drive people to shadier solutions.
    They've spent billions of dollars and two decades building the most sophisticated censorship system in human history.
    But they can't eliminate the fundamental problem without breaking the internet itself.
    -> The_Real_Problem

=== Approved_VPNs ===
"We'll only allow corporate or government-approved VPNs!"

This creates a two-tier internet:
Businesses and the wealthy get secure, private connections.
Regular citizens are forced to expose their browsing to government surveillance.

Think about what "approved" means in practice:
- The government can see where the VPN connects
- They can demand logs of who uses it and when
- They can revoke approval at any time
- They create a list of "trusted" VPNs that must cooperate with authorities

This transforms a security tool into a surveillance tool.

It's like saying: "Curtains are now illegal unless you're rich enough to apply for a curtain license."
And oh, by the way, the government gets to peek through approved curtains whenever they want.

Who gets approval? Corporations, certainly. Government contractors. Maybe large hospitals and universities.
But freelance journalists? Political activists? Ordinary citizens who value privacy? Probably not.

*   [That doesn't seem fair.]
    It's not. And it doesn't solve the original problem.
    Kids can still use their parent's work laptop or a friend's "approved" VPN.
    You've created a surveillance infrastructure without preventing the behavior you wanted to stop.
    -> The_Real_Problem
