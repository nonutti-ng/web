import Link from 'next/link';

export default function TermsPage() {
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
                        Terms of Service
                    </h1>
                    <p className='text-sm text-muted-foreground mb-8'>
                        Last Updated: November 1, 2025
                    </p>

                    <div className='prose prose-lg max-w-none'>
                        <section className='mb-8'>
                            <h2 className='text-2xl font-semibold text-foreground mb-3'>
                                1. Acceptance of Terms
                            </h2>
                            <p className='text-muted-foreground leading-relaxed'>
                                By accessing or using the nonutti.ng (the
                                &quot;Service&quot;), you agree to be bound by
                                these Terms of Service. If you do not agree to
                                these terms, you may not use the Service.
                            </p>
                        </section>

                        <section className='mb-8'>
                            <h2 className='text-2xl font-semibold text-foreground mb-3'>
                                2. Age Requirement
                            </h2>
                            <p className='text-muted-foreground leading-relaxed'>
                                You must be at least 18 years of age to use this
                                Service. By using the Service, you represent and
                                warrant that you are 18 years of age or older.
                                We reserve the right to terminate accounts of
                                users who are found to be under 18 years of age.
                            </p>
                        </section>

                        <section className='mb-8'>
                            <h2 className='text-2xl font-semibold text-foreground mb-3'>
                                3. Account Registration and Authentication
                            </h2>
                            <p className='text-muted-foreground mb-3'>
                                To use the Service, you must create an account
                                using Discord authentication. You agree to:
                            </p>
                            <ul className='space-y-2 text-muted-foreground ml-6 mb-4'>
                                <li className='list-disc'>
                                    Provide accurate and complete information
                                    during registration
                                </li>
                                <li className='list-disc'>
                                    Maintain the security of your account
                                    credentials
                                </li>
                                <li className='list-disc'>
                                    Accept responsibility for all activities
                                    under your account
                                </li>
                                <li className='list-disc'>
                                    Notify us immediately of any unauthorized
                                    access to your account
                                </li>
                            </ul>
                            <p className='text-muted-foreground leading-relaxed'>
                                We use Discord OAuth for authentication and
                                account verification. Additionally, you may
                                optionally link your Reddit account to enable
                                the Service to update your user flair on your
                                behalf. By linking your Reddit account, you
                                authorize us to use the Reddit API to update
                                your flair in accordance with Reddit&apos;s API
                                Terms of Use.
                            </p>
                        </section>

                        <section className='mb-8'>
                            <h2 className='text-2xl font-semibold text-foreground mb-3'>
                                4. User Data and Privacy
                            </h2>
                            <p className='text-muted-foreground leading-relaxed'>
                                We collect and store information including but
                                not limited to your Discord account information,
                                Reddit access tokens (if linked), age group,
                                gender, participation data, and timezone
                                preferences. Your use of the Service is also
                                governed by our Privacy Policy. We do not share
                                your personal information with third parties
                                except as described in our Privacy Policy.
                            </p>
                        </section>

                        <section className='mb-8'>
                            <h2 className='text-2xl font-semibold text-foreground mb-3'>
                                5. Acceptable Use
                            </h2>
                            <p className='text-muted-foreground mb-3'>
                                You agree to use the Service only for its
                                intended purpose of tracking your No Nut
                                November participation. You agree NOT to:
                            </p>
                            <ul className='space-y-2 text-muted-foreground ml-6'>
                                <li className='list-disc'>
                                    Use the Service for any illegal or
                                    unauthorized purpose
                                </li>
                                <li className='list-disc'>
                                    Attempt to gain unauthorized access to the
                                    Service or other users&apos; accounts
                                </li>
                                <li className='list-disc'>
                                    Interfere with or disrupt the Service or
                                    servers
                                </li>
                                <li className='list-disc'>
                                    Use automated scripts, bots, or other tools
                                    to manipulate the Service
                                </li>
                                <li className='list-disc'>
                                    Harass, abuse, or harm other users
                                </li>
                                <li className='list-disc'>
                                    Submit false or misleading information
                                </li>
                                <li className='list-disc'>
                                    Violate any applicable laws or regulations
                                </li>
                            </ul>
                        </section>

                        <section className='mb-8'>
                            <h2 className='text-2xl font-semibold text-foreground mb-3'>
                                6. Content and Conduct
                            </h2>
                            <p className='text-muted-foreground leading-relaxed'>
                                This Service is for personal tracking and
                                self-improvement purposes. The Service is
                                provided for entertainment and personal
                                challenge tracking. We are not responsible for
                                the actions or outcomes of your participation in
                                No Nut November.
                            </p>
                        </section>

                        <section className='mb-8'>
                            <h2 className='text-2xl font-semibold text-foreground mb-3'>
                                7. Service Availability
                            </h2>
                            <p className='text-muted-foreground leading-relaxed'>
                                We strive to keep the Service available and
                                functional, but we do not guarantee
                                uninterrupted or error-free operation. The
                                Service may be temporarily unavailable due to
                                maintenance, updates, or technical issues. We
                                reserve the right to modify or discontinue the
                                Service at any time without notice.
                            </p>
                        </section>

                        <section className='mb-8'>
                            <h2 className='text-2xl font-semibold text-foreground mb-3'>
                                8. Intellectual Property
                            </h2>
                            <p className='text-muted-foreground leading-relaxed'>
                                All content, features, and functionality of the
                                Service, including but not limited to text,
                                graphics, logos, and software, are owned by us
                                or our licensors and are protected by copyright,
                                trademark, and other intellectual property laws.
                            </p>
                        </section>

                        <section className='mb-8'>
                            <h2 className='text-2xl font-semibold text-foreground mb-3'>
                                9. Disclaimer of Warranties
                            </h2>
                            <p className='text-muted-foreground leading-relaxed'>
                                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND
                                &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF
                                ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT
                                WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED,
                                ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL
                                COMPONENTS.
                            </p>
                        </section>

                        <section className='mb-8'>
                            <h2 className='text-2xl font-semibold text-foreground mb-3'>
                                10. Limitation of Liability
                            </h2>
                            <p className='text-muted-foreground leading-relaxed'>
                                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL
                                NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                                SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR
                                ANY LOSS OF PROFITS OR REVENUES, WHETHER
                                INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF
                                DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES
                                RESULTING FROM YOUR USE OF THE SERVICE.
                            </p>
                        </section>

                        <section className='mb-8'>
                            <h2 className='text-2xl font-semibold text-foreground mb-3'>
                                11. Account Termination
                            </h2>
                            <p className='text-muted-foreground leading-relaxed'>
                                We reserve the right to suspend or terminate
                                your account at any time for any reason,
                                including but not limited to violation of these
                                Terms of Service, fraudulent activity, or being
                                under the age of 18. You may delete your account
                                at any time through the Settings page.
                            </p>
                        </section>

                        <section className='mb-8'>
                            <h2 className='text-2xl font-semibold text-foreground mb-3'>
                                12. Third-Party Services
                            </h2>
                            <p className='text-muted-foreground leading-relaxed'>
                                The Service integrates with Discord for
                                authentication and Reddit for optional flair
                                updates. Your use of these third-party services
                                is subject to their respective terms of service
                                and privacy policies. We are not responsible for
                                the practices or content of third-party
                                services.
                            </p>
                        </section>

                        <section className='mb-8'>
                            <h2 className='text-2xl font-semibold text-foreground mb-3'>
                                13. Changes to Terms
                            </h2>
                            <p className='text-muted-foreground leading-relaxed'>
                                We reserve the right to modify these Terms of
                                Service at any time. We will notify users of
                                significant changes by updating the &quot;Last
                                Updated&quot; date at the top of this page. Your
                                continued use of the Service after changes are
                                posted constitutes acceptance of the updated
                                terms.
                            </p>
                        </section>

                        <section className='mb-8'>
                            <h2 className='text-2xl font-semibold text-foreground mb-3'>
                                14. Governing Law
                            </h2>
                            <p className='text-muted-foreground leading-relaxed'>
                                These Terms of Service shall be governed by and
                                construed in accordance with applicable laws,
                                without regard to conflict of law principles, in
                                the jurisdiction of Michigan, USA.
                            </p>
                        </section>

                        <section className='mb-8'>
                            <h2 className='text-2xl font-semibold text-foreground mb-3'>
                                15. Contact Information
                            </h2>
                            <p className='text-muted-foreground mb-3'>
                                If you have any questions or concerns regarding
                                these Terms of Service, please contact us via:
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
