import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div className='min-h-screen bg-background'>
            <div className='max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
                <div className='mb-8'>
                    <Link
                        href='/'
                        className='inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors'
                    >
                        <svg
                            className='w-4 h-4 mr-2'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M15 19l-7-7 7-7'
                            />
                        </svg>
                        Back to Home
                    </Link>
                </div>

                <div className='bg-card border border-border rounded-lg shadow-sm p-8 md:p-12'>
                    <h1 className='text-4xl font-bold text-foreground mb-2'>
                        Privacy Policy
                    </h1>
                    <p className='text-sm text-muted-foreground mb-8'>
                        Last Updated: November 1, 2025
                    </p>

                    <div className='prose prose-lg max-w-none'>
                        <section className='mb-8'>
                            <h2 className='text-2xl font-semibold text-foreground mb-3'>
                                1. Introduction
                            </h2>
                            <p className='text-muted-foreground leading-relaxed'>
                                This Privacy Policy explains how nonutti.ng (the
                                &quot;Service&quot;, &quot;we&quot;,
                                &quot;us&quot;, or &quot;our&quot;) collects,
                                uses, stores, and protects your personal
                                information. By using the Service, you agree to
                                the collection and use of information in
                                accordance with this policy.
                            </p>
                        </section>

                        <section className='mb-8'>
                            <h2 className='text-2xl font-semibold text-foreground mb-4'>
                                2. Information We Collect
                            </h2>

                            <div className='mb-6'>
                                <h3 className='text-xl font-semibold text-foreground mb-3'>
                                    2.1 Account Information
                                </h3>
                                <p className='text-muted-foreground mb-3'>
                                    When you create an account, we collect:
                                </p>
                                <ul className='space-y-2 text-muted-foreground ml-6'>
                                    <li className='list-disc'>
                                        <strong className='text-foreground'>
                                            User ID:
                                        </strong>{' '}
                                        A unique identifier for your account
                                    </li>
                                    <li className='list-disc'>
                                        <strong className='text-foreground'>
                                            Name:
                                        </strong>{' '}
                                        Your display name from Discord
                                    </li>
                                    <li className='list-disc'>
                                        <strong className='text-foreground'>
                                            Email Address:
                                        </strong>{' '}
                                        Your email address from Discord
                                    </li>
                                    <li className='list-disc'>
                                        <strong className='text-foreground'>
                                            Email Verification Status:
                                        </strong>{' '}
                                        Whether your email has been verified
                                    </li>
                                    <li className='list-disc'>
                                        <strong className='text-foreground'>
                                            Profile Image:
                                        </strong>{' '}
                                        Your profile picture from Discord
                                    </li>
                                    <li className='list-disc'>
                                        <strong className='text-foreground'>
                                            Account Creation Date:
                                        </strong>{' '}
                                        When you created your account
                                    </li>
                                    <li className='list-disc'>
                                        <strong className='text-foreground'>
                                            Onboarding Status:
                                        </strong>{' '}
                                        Whether you have completed the initial
                                        setup
                                    </li>
                                    <li className='list-disc'>
                                        <strong className='text-foreground'>
                                            Browser Notification Token:
                                        </strong>{' '}
                                        If you opt-in to receive browser
                                        notifications
                                    </li>
                                </ul>
                            </div>

                            <div className='mb-6'>
                                <h3 className='text-xl font-semibold text-foreground mb-3'>
                                    2.2 Anonymized Onboarding Data
                                </h3>
                                <p className='text-muted-foreground mb-3'>
                                    During onboarding, we collect the following
                                    demographic and motivational information.
                                    This data is stored separately from your
                                    user account to protect your privacy and is
                                    used only for aggregate analytics:
                                </p>
                                <ul className='space-y-2 text-muted-foreground ml-6'>
                                    <li className='list-disc'>
                                        <strong className='text-foreground'>
                                            Age Group:
                                        </strong>{' '}
                                        Your age range (not your exact age)
                                    </li>
                                    <li className='list-disc'>
                                        <strong className='text-foreground'>
                                            Gender:
                                        </strong>{' '}
                                        Your self-identified gender
                                    </li>
                                    <li className='list-disc'>
                                        <strong className='text-foreground'>
                                            Previous Participation Status:
                                        </strong>{' '}
                                        Whether you have participated in No Nut
                                        November before
                                    </li>
                                    <li className='list-disc'>
                                        <strong className='text-foreground'>
                                            Motivation:
                                        </strong>{' '}
                                        Your reasons for participating
                                        (optional)
                                    </li>
                                </ul>
                            </div>

                            <div className='mb-6'>
                                <h3 className='text-xl font-semibold text-foreground mb-3'>
                                    2.3 Authentication Data
                                </h3>
                                <p className='text-muted-foreground mb-3'>
                                    We store authentication information from
                                    third-party providers (Discord and
                                    optionally Reddit):
                                </p>
                                <ul className='space-y-2 text-muted-foreground ml-6'>
                                    <li className='list-disc'>
                                        <strong className='text-foreground'>
                                            Provider Account ID:
                                        </strong>{' '}
                                        Your unique ID from the authentication
                                        provider
                                    </li>
                                    <li className='list-disc'>
                                        <strong className='text-foreground'>
                                            Provider ID:
                                        </strong>{' '}
                                        The name of the authentication provider
                                        (Discord, Reddit)
                                    </li>
                                    <li className='list-disc'>
                                        <strong className='text-foreground'>
                                            Access Tokens:
                                        </strong>{' '}
                                        Tokens used to access third-party APIs
                                        on your behalf
                                    </li>
                                    <li className='list-disc'>
                                        <strong className='text-foreground'>
                                            Refresh Tokens:
                                        </strong>{' '}
                                        Tokens used to maintain your
                                        authenticated session
                                    </li>
                                    <li className='list-disc'>
                                        <strong className='text-foreground'>
                                            Token Expiration Dates:
                                        </strong>{' '}
                                        When tokens expire
                                    </li>
                                    <li className='list-disc'>
                                        <strong className='text-foreground'>
                                            Scope:
                                        </strong>{' '}
                                        Permissions granted to our Service
                                    </li>
                                </ul>
                            </div>

                            <div className='mb-6'>
                                <h3 className='text-xl font-semibold text-foreground mb-3'>
                                    2.4 Session Information
                                </h3>
                                <p className='text-muted-foreground mb-3'>
                                    When you log in, we collect session data to
                                    maintain your authenticated state and
                                    enhance security:
                                </p>
                                <ul className='space-y-2 text-muted-foreground ml-6'>
                                    <li className='list-disc'>
                                        <strong className='text-foreground'>
                                            Session ID:
                                        </strong>{' '}
                                        A unique identifier for your session
                                    </li>
                                    <li className='list-disc'>
                                        <strong className='text-foreground'>
                                            Session Token:
                                        </strong>{' '}
                                        A secure token for authentication
                                    </li>
                                    <li className='list-disc'>
                                        <strong className='text-foreground'>
                                            IP Address:
                                        </strong>{' '}
                                        Your IP address at the time of login
                                    </li>
                                    <li className='list-disc'>
                                        <strong className='text-foreground'>
                                            User Agent:
                                        </strong>{' '}
                                        Information about your browser and
                                        device
                                    </li>
                                    <li className='list-disc'>
                                        <strong className='text-foreground'>
                                            Session Creation and Expiration:
                                        </strong>{' '}
                                        When your session was created and when
                                        it expires
                                    </li>
                                </ul>
                            </div>

                            <div className='mb-6'>
                                <h3 className='text-xl font-semibold text-foreground mb-3'>
                                    2.5 Challenge Participation Data
                                </h3>
                                <p className='text-muted-foreground mb-3'>
                                    We collect information about your
                                    participation in No Nut November:
                                </p>
                                <ul className='space-y-2 text-muted-foreground ml-6'>
                                    <li className='list-disc'>
                                        <strong className='text-foreground'>
                                            Try Records:
                                        </strong>{' '}
                                        Information about your attempts,
                                        including year and current status
                                    </li>
                                    <li className='list-disc'>
                                        <strong className='text-foreground'>
                                            Daily Entries:
                                        </strong>{' '}
                                        Your daily check-ins and status updates
                                    </li>
                                    <li className='list-disc'>
                                        <strong className='text-foreground'>
                                            Timestamps:
                                        </strong>{' '}
                                        When you create or update entries
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section className='mb-8'>
                            <h2 className='text-2xl font-semibold text-foreground mb-3'>
                                3. How We Use Your Information
                            </h2>
                            <p className='text-muted-foreground mb-3'>
                                We use the collected information to:
                            </p>
                            <ul className='space-y-2 text-muted-foreground ml-6'>
                                <li className='list-disc'>
                                    Provide and maintain the Service
                                </li>
                                <li className='list-disc'>
                                    Authenticate your identity and manage
                                    sessions
                                </li>
                                <li className='list-disc'>
                                    Track your progress in the challenge
                                </li>
                                <li className='list-disc'>
                                    Send notifications (if you opt-in) about
                                    your progress
                                </li>
                                <li className='list-disc'>
                                    Update your Reddit flair on your behalf (if
                                    you link your Reddit account)
                                </li>
                                <li className='list-disc'>
                                    Improve the Service through aggregate
                                    analytics (using anonymized onboarding data)
                                </li>
                                <li className='list-disc'>
                                    Detect and prevent fraud or abuse
                                </li>
                                <li className='list-disc'>
                                    Communicate with you about the Service,
                                    updates, or issues
                                </li>
                                <li className='list-disc'>
                                    Comply with legal obligations
                                </li>
                            </ul>
                        </section>

                        <section className='mb-8'>
                            <h2 className='text-2xl font-semibold text-foreground mb-3'>
                                4. Data Storage and Security
                            </h2>
                            <p className='text-muted-foreground mb-3'>
                                We take the security of your data seriously and
                                implement appropriate technical and
                                organizational measures:
                            </p>
                            <ul className='space-y-2 text-muted-foreground ml-6'>
                                <li className='list-disc'>
                                    All data is stored in a secure MySQL
                                    database with access controls
                                </li>
                                <li className='list-disc'>
                                    Sensitive authentication tokens are
                                    encrypted at rest
                                </li>
                                <li className='list-disc'>
                                    Connections to the Service use HTTPS
                                    encryption
                                </li>
                                <li className='list-disc'>
                                    Onboarding demographic data is stored
                                    separately from user accounts for
                                    anonymization
                                </li>
                                <li className='list-disc'>
                                    Session data includes IP addresses and user
                                    agents for security monitoring
                                </li>
                            </ul>
                            <p className='text-muted-foreground mt-4'>
                                However, no method of transmission over the
                                internet or electronic storage is 100% secure.
                                While we strive to use commercially acceptable
                                means to protect your information, we cannot
                                guarantee absolute security.
                            </p>
                        </section>

                        <section className='mb-8'>
                            <h2 className='text-2xl font-semibold text-foreground mb-3'>
                                5. Data Retention
                            </h2>
                            <p className='text-muted-foreground mb-3'>
                                We retain your data as follows:
                            </p>
                            <ul className='space-y-2 text-muted-foreground ml-6'>
                                <li className='list-disc'>
                                    <strong className='text-foreground'>
                                        Account Data:
                                    </strong>{' '}
                                    Retained until you delete your account
                                </li>
                                <li className='list-disc'>
                                    <strong className='text-foreground'>
                                        Session Data:
                                    </strong>{' '}
                                    Automatically deleted after expiration
                                </li>
                                <li className='list-disc'>
                                    <strong className='text-foreground'>
                                        Challenge Data:
                                    </strong>{' '}
                                    Retained indefinitely for historical
                                    tracking purposes, but deleted if you delete
                                    your account
                                </li>
                                <li className='list-disc'>
                                    <strong className='text-foreground'>
                                        Anonymized Onboarding Data:
                                    </strong>{' '}
                                    Retained permanently for analytics (cannot
                                    be linked back to you)
                                </li>
                            </ul>
                        </section>

                        <section className='mb-8'>
                            <h2 className='text-2xl font-semibold text-foreground mb-4'>
                                6. Third-Party Services
                            </h2>

                            <div className='mb-6'>
                                <h3 className='text-xl font-semibold text-foreground mb-3'>
                                    6.1 Discord
                                </h3>
                                <p className='text-muted-foreground'>
                                    We use Discord OAuth for authentication.
                                    When you log in with Discord, we receive
                                    your Discord user ID, username, email, and
                                    profile picture. Discord&apos;s use of your
                                    information is governed by their Privacy
                                    Policy.
                                </p>
                            </div>

                            <div className='mb-6'>
                                <h3 className='text-xl font-semibold text-foreground mb-3'>
                                    6.2 Reddit (Optional)
                                </h3>
                                <p className='text-muted-foreground'>
                                    If you choose to link your Reddit account,
                                    we use the Reddit API to update your user
                                    flair on your behalf. We store Reddit access
                                    tokens and refresh tokens to maintain this
                                    connection. You can revoke this access at
                                    any time in the Settings page.
                                    Reddit&apos;s use of your information is
                                    governed by their Privacy Policy.
                                </p>
                            </div>
                        </section>

                        <section className='mb-8'>
                            <h2 className='text-2xl font-semibold text-foreground mb-3'>
                                7. Data Sharing and Disclosure
                            </h2>
                            <p className='text-muted-foreground mb-3'>
                                We do not sell, trade, or rent your personal
                                information to third parties. We may share your
                                information only in the following circumstances:
                            </p>
                            <ul className='space-y-2 text-muted-foreground ml-6'>
                                <li className='list-disc'>
                                    <strong className='text-foreground'>
                                        With Your Consent:
                                    </strong>{' '}
                                    When you explicitly authorize us to share
                                    information (e.g., updating your Reddit
                                    flair)
                                </li>
                                <li className='list-disc'>
                                    <strong className='text-foreground'>
                                        Service Providers:
                                    </strong>{' '}
                                    With trusted third-party service providers
                                    who assist in operating the Service (e.g.,
                                    hosting providers), under strict
                                    confidentiality agreements
                                </li>
                                <li className='list-disc'>
                                    <strong className='text-foreground'>
                                        Legal Requirements:
                                    </strong>{' '}
                                    When required by law, court order, or
                                    governmental authority
                                </li>
                                <li className='list-disc'>
                                    <strong className='text-foreground'>
                                        Protection of Rights:
                                    </strong>{' '}
                                    To protect our rights, property, or safety,
                                    or that of our users or the public
                                </li>
                            </ul>
                        </section>

                        <section className='mb-8'>
                            <h2 className='text-2xl font-semibold text-foreground mb-3'>
                                8. Your Data Rights
                            </h2>
                            <p className='text-muted-foreground mb-3'>
                                You have the following rights regarding your
                                data:
                            </p>
                            <ul className='space-y-2 text-muted-foreground ml-6'>
                                <li className='list-disc'>
                                    <strong className='text-foreground'>
                                        Access:
                                    </strong>{' '}
                                    Request a copy of the personal information
                                    we hold about you
                                </li>
                                <li className='list-disc'>
                                    <strong className='text-foreground'>
                                        Correction:
                                    </strong>{' '}
                                    Request correction of inaccurate or
                                    incomplete information
                                </li>
                                <li className='list-disc'>
                                    <strong className='text-foreground'>
                                        Deletion:
                                    </strong>{' '}
                                    Delete your account and associated data at
                                    any time through the Settings page
                                </li>
                                <li className='list-disc'>
                                    <strong className='text-foreground'>
                                        Data Portability:
                                    </strong>{' '}
                                    Request your data in a structured,
                                    machine-readable format
                                </li>
                                <li className='list-disc'>
                                    <strong className='text-foreground'>
                                        Withdraw Consent:
                                    </strong>{' '}
                                    Revoke consent for data processing (e.g.,
                                    unlinking your Reddit account, disabling
                                    notifications)
                                </li>
                            </ul>
                            <p className='text-muted-foreground mt-4'>
                                To exercise these rights, please contact us
                                using the information provided in Section 13.
                            </p>
                        </section>

                        <section className='mb-8'>
                            <h2 className='text-2xl font-semibold text-foreground mb-3'>
                                9. Cookies and Tracking
                            </h2>
                            <p className='text-muted-foreground'>
                                We use session tokens and browser storage to
                                maintain your authenticated state. We do not use
                                third-party tracking cookies or analytics
                                services that track you across other websites.
                            </p>
                        </section>

                        <section className='mb-8'>
                            <h2 className='text-2xl font-semibold text-foreground mb-3'>
                                10. Children&apos;s Privacy
                            </h2>
                            <p className='text-muted-foreground'>
                                The Service is intended for users aged 18 and
                                older. We do not knowingly collect personal
                                information from anyone under 18 years of age.
                                If you are a parent or guardian and believe your
                                child has provided us with personal information,
                                please contact us, and we will delete such
                                information.
                            </p>
                        </section>

                        <section className='mb-8'>
                            <h2 className='text-2xl font-semibold text-foreground mb-3'>
                                11. International Data Transfers
                            </h2>
                            <p className='text-muted-foreground'>
                                Your information may be transferred to and
                                maintained on servers located outside of your
                                state, province, country, or other governmental
                                jurisdiction where data protection laws may
                                differ. By using the Service, you consent to the
                                transfer of your information to the United
                                States and/or other countries.
                            </p>
                        </section>

                        <section className='mb-8'>
                            <h2 className='text-2xl font-semibold text-foreground mb-3'>
                                12. Changes to This Privacy Policy
                            </h2>
                            <p className='text-muted-foreground'>
                                We may update this Privacy Policy from time to
                                time. We will notify you of any changes by
                                updating the &quot;Last Updated&quot; date at
                                the top of this policy. Significant changes will
                                be communicated through the Service or via
                                email. Your continued use of the Service after
                                changes are posted constitutes acceptance of the
                                updated policy.
                            </p>
                        </section>

                        <section className='mb-8'>
                            <h2 className='text-2xl font-semibold text-foreground mb-3'>
                                13. Contact Information
                            </h2>
                            <p className='text-muted-foreground mb-3'>
                                If you have any questions, concerns, or requests
                                regarding this Privacy Policy or your personal
                                data, please contact us:
                            </p>
                            <ul className='space-y-2 text-muted-foreground ml-6'>
                                <li className='list-disc'>
                                    Reddit: u/JustALinuxNerd17
                                </li>
                                <li className='list-disc'>
                                    Discord: sticksdev
                                </li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
