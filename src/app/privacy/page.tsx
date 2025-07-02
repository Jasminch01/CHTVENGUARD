import React from "react";

const page = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-0 py-12">
      <header className="mb-2">
        <h1 className="font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
      </header>

      <div className="prose prose-lg max-w-none space-y-5">
        <section>
          <p className=" dark:text-gray-500">
            CHTVANGUARD respects the privacy of its users. It is our foremost
            duty to protect your personal information while you are using our
            website. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you visit our website, mobile
            applications, or use our services.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">Information We Collect</h2>
          <p className="mb-2 dark:text-gray-500">
            We may collect information about you in a variety of ways including
            registering to the site, subscribing to the newsletter, responding
            to a survey or participating in a competition, etc.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">How We Use Your Information</h2>
          <p className="mb-2 dark:text-gray-500">
            Having accurate information about you permits us to provide you with
            a smooth, efficient, and customized experience. Specifically, we may
            use information collected about you to generate a personal profile
            about you to make future visits easy, analyze usage and trends to
            improve your experience, notify you many updates, request feedback
            from you. If anybody wants to remove his/her personal data from our
            database the person has to email info@dhakapost.com requesting the
            removal of personal data. The person has to mention his/her email
            address in the email. The email subject should be &quot;Requesting
            personal data removal&quot;.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">Information Disclosure</h2>
          <p className="dark:text-gray-500">CHTVANGUARD will not share your information to any third party.</p>
        </section>

        <section>
          <h2 className="font-semibold">Security of Your Information</h2>
          <p className="mb-2 dark:text-gray-500">
            We use administrative, technical, and physical security measures to
            help protect your personal information. However, any information
            disclosed online is vulnerable to interception and misuse by
            unauthorized parties. Therefore, we cannot guarantee complete
            security if you provide personal information.
          </p>
        </section>

        <section>
          <h2 className=" font-semibold">Push Notifications</h2>
          <p className="mb-2 dark:text-gray-500">
            We may request you to send you push notifications on breaking news.
            If you wish to opt-out from receiving these notifications, you may
            turn them off in your device’s settings.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">Comment Policy</h2>
          <p className="dark:text-gray-500">
            CHTVANGUARD welcomes relevant debate on any specific topic but it
            discourages personal attacks on authors, other users or any
            individual. All abusive language, hate speech and anti-religious
            comments are strictly prohibited. We encourage users to keep your
            comment relevant to the topic or content of the news reports.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">Cookie Policy</h2>
          <p className="mb-2 dark:text-gray-500">
            We do not store any personal data based on cookies. The information
            collected through cookies is generally anonymized and used for
            statistical purposes or to enhance website functionality. We respect
            your privacy and take appropriate measures to ensure the protection
            of any personal data we may collect through other means, as outlined
            in our Privacy Policy.
          </p>
          <p className="mb-2 dark:text-gray-500">
            Our website may contain content and links from third-party websites.
            These third parties may also set cookies on your device. We do not
            have control over the cookies used by these third parties, and we
            recommend reviewing their respective cookie policies for more
            information.
          </p>
          <p className="mb-2 dark:text-gray-500">
            Most web browsers are set to accept cookies by default. However, you
            can modify your browser settings to control or disable cookies if
            you prefer. Please note that blocking or deleting cookies may impact
            your browsing experience and restrict certain features of our
            website. Changes to this Cookie Policy: We may update this Cookie
            Policy from time to time. Any changes will be effective immediately
            upon posting the revised version on our website. We encourage you to
            review this policy periodically for any updates.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-semibold">Modification of Privacy Policy</h2>
          <p className="dark:text-gray-500">
            CHTVANGUARD reserves the right to amend, modify, alter, or omit any
            terms in the ‘Privacy Policy’ at any time. CHTVANGUARD encourages
            users to periodically check back and review this policy so that
            visitors and readers will always know what information we collect,
            how we use it, and with whom we share it.
          </p>
        </section>
      </div>
    </div>
  );
};

export default page;
