// Children's Unique Identifier - Deep Dive
// Part of the digital-id story

=== Childrens_Identifier ===
# diagram: childrens_id.jpg
The Children's Wellbeing and Schools Bill introduces a "consistent identifier" for every child in England.

The intent is good: prevent children falling through gaps between health, education, and social care.

But the implementation raises concerns.

*   [What does the bill actually say?]
    -> Bill_Text
*   [What's the problem?]
    -> SSN_Problem

=== Bill_Text ===
# diagram: bill_clause.jpg
Clause 4 inserts new sections into the Children Act 2004.[14]

Key provisions:

The Secretary of State specifies the identifier via **regulations**—not primary legislation. Parliament doesn't get a full vote.

"Designated persons" must include the identifier when processing children's data. Who counts as designated? Also set by regulations.

Compliance "does not breach any obligation of confidence"—existing confidentiality protections are overridden.

*   [So they can expand this without parliament?]
    -> Regulations_Concern
*   [What identifier will they use?]
    -> NHS_Number

=== Regulations_Concern ===
# diagram: regulations.jpg
Exactly. Both the identifier and who can access it are set by ministerial regulations.

Future governments can add new "designated persons" without a parliamentary vote. The infrastructure expands by default.

This follows a pattern: the Investigatory Powers Act started with serious crime, now councils use it for dog fouling and school catchment fraud.

*   [What identifier will they use?]
    -> NHS_Number
*   [What about vulnerable children?]
    -> Vulnerable_Groups

=== NHS_Number ===
# diagram: nhs_number.jpg
Almost certainly the NHS number—it's lifelong, universal, and already used across health services.

But here's the concern: standardized identifiers create standardized attack vectors.

*   [What do you mean?]
    -> SSN_Problem
*   [Has something like this happened before?]
    -> ContactPoint

=== SSN_Problem ===
# diagram: ssn_problem.jpg
The US Social Security Number is a cautionary tale.

Designed for one purpose (Social Security benefits), it became the de facto national ID through scope creep. Now used for credit, banking, employment, healthcare.

When leaked, it enables identity theft across all these systems. You can't change your SSN like a password.

If the NHS number becomes the universal child identifier—linking health, education, social care—a single breach exposes everything.

*   [Has this happened with children's data?]
    -> Kido_Breach
*   [What about vulnerable children?]
    -> Vulnerable_Groups

=== Kido_Breach ===
# diagram: kido_breach.jpg
In September 2025, hackers breached Kido nurseries and stole data on 8,000+ children.[15]

They published 10 children's full profiles online—names, dates of birth, addresses, parent details, accident reports.

Parents received threatening phone calls demanding ransom.

This is what happens when children's data is centralized. Now imagine every child in England with a single identifier linking all their records.

*   [What about vulnerable children specifically?]
    -> Vulnerable_Groups
*   [Has the UK tried this before?]
    -> ContactPoint

=== Vulnerable_Groups ===
# diagram: vulnerable.jpg
The bill's only protection for vulnerable children is discretionary.

Agencies don't have to share if they "consider that disclosure would be more detrimental to the child."

No defined criteria. No oversight mechanism. Individual judgment of each worker.

For children fleeing domestic violence, in witness protection, or adopted from abusive families—this is not a robust safeguard.

*   [Has the UK tried this before?]
    -> ContactPoint
*   [What should we do?]
    -> What_Now

=== ContactPoint ===
# diagram: contactpoint.jpg
The UK tried a similar system called ContactPoint in 2009.

It was supposed to help agencies share information about children. Instead:
• Access expanded beyond original scope
• Security concerns mounted
• Scrapped in 2010 after privacy outcry

The bill's regulations mechanism makes scope creep even easier than ContactPoint.

*   [What should we do about this?]
    -> What_Now
*   [Back to Digital ID overview]
    -> Security_Risks

=== What_Now ===
# diagram: action.jpg
The bill is still being debated. Key questions to ask:

Why are identifier and access defined by regulations rather than legislation?

What hard safeguards exist for vulnerable children—not just discretionary judgment?

What prevents scope creep to other uses?

What happens when (not if) this data is breached?

*   [Tell me about broader digital ID concerns]
    -> Security_Risks
*   [Back to the bill overview]
    ~ navigateTo("childrens-wellbeing-bill")
    -> END
