=== E2E_Encryption ===

= Breaking_E2E
End-to-end encryption is supposed to mean that *only* you and the recipient can read your messages. # diagram: e2e_broken.png

Not the app developer. Not the phone company. Not the government. Nobody in between.

The way it works: your message is scrambled on your device, travels as gibberish through the internet, and only unscrambles on the recipient's device. Even if someone intercepts it in transit, all they see is meaningless noise.

This is what protects journalists, activists, domestic abuse survivors, whistleblowers, and everyday people who just value their privacy.

But on-device scanning changes the equation entirely.

= The_Catch
Here's the problem: # diagram: scanning_before_encryption.png

If your phone scans your messages *before* encrypting them, then the encryption is meaningless.

Yes, the message is still encrypted when it travels across the internet. But it was read in plain text on your device first - by scanning software that reports back to... someone.

Apple, Google, the government - whoever operates the scanning system gets to see your content before you hit "send."

This is like having a security camera in your home that only encrypts the video *after* it's been recorded and analyzed. Sure, the video is encrypted in transit to the monitoring company, but they've already seen everything.

*   [Who exactly is doing the scanning?]
    -> Scanning_Mechanism.What_Gets_Scanned

*   [But surely this is just for CSAM, right?]
    -> Scope_Creep.Starts_With_CSAM

*   [What about false positives?]
    -> False_Positives.Innocent_Content

*   [I want to know about that nudity filter.]
    -> Nudity_Filter.Age_Verification_Requirement
