import React from "react";

const page = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 ">
      <header className="mb-8">
        <h1 className="font-bold">Terms of Use</h1>
        <p className=" text-gray-500">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
      </header>

      <div className="prose prose-lg max-w-none space-y-3">
        <section>
          <h2 className=" font-semibold">Terms of Use</h2>
          <p className="dark:text-gray-500">
            CHTVANGUARD welcomes readers and visitors to the terms and
            conditions for use of CHTVANGUARD and its associated contents,
            services and applications. One can access the content of CHTVANGUARD
            in several ways by using multiple channels including www (world wide
            web), digital and social platforms. To use our content, services,
            pictures, videos, information or whatsoever, readers and visitors
            must have to accept the ‘Terms and Conditions’ of use including
            Dhaka Post’s Privacy Policy. However, if anyone has any objection or
            reservation to any clause in the ‘Terms and Conditions’ of use or
            the Privacy Policy, one may raise the issue with CHTVANGUARD by
            sending an email at: [info@CHTVANGUARD .com]. But the authority of
            CHTVANGUARD reserves all right to reject or accept any such
            objection or reservation. All the users of CHTVANGUARD are required
            to abide by this ‘Terms and Conditions’ of use. Failure to comply
            with the terms may lead to suspension of the account or prohibition
            from access to the website.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">Intellectual Property Rights</h2>
          <p className="dark:text-gray-500">
            CHTVANGUARD &apos;s content, logos, copyright, trademarks, patents,
            images, text, graphics, domain names, audio, video and other related
            intellectual property rights or other features of CHTVANGUARD and
            name belong to Dhaka Post. Users cannot claim any rights in Dhaka
            Post’s intellectual property whether for commercial or
            non-commercial use. In addition, users are prevented from making any
            derivative work from the content of Dhaka Post.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">Permitted Use of Our Services</h2>
          <p className="dark:text-gray-500">
            Users are required to use CHTVANGUARD services only for lawful means
            and for read-only purpose. The audio and video elements of the
            website can only be listened and viewed and nothing beyond. However,
            CHTVANGUARD encourages its users to share its contents in their
            social media profile, groups and related communities. But the
            contents must not be shared with anyone or any digital platforms
            with any modification or alteration.
          </p>
          <p
            className="dark:text-gray-500"
          >
            The users must use the services only for non-commercial purpose.
            Users may use available services for personal and private purposes
            only, the users must not exploit, sell or use any content appearing
            on our services for any kind of commercial purposes.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">Content Management</h2>
          <p className="dark:text-gray-500">
            Taking down contents CHTVANGUARD can take down any of its contents
            at any time from its website. The users cannot refuse to remove
            content from their respective devices if asked by Dhaka Post.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">Prohibited Activities</h2>
          <p className="dark:text-gray-500">
            The user is specifically required not to associate CHTVANGUARD with
            any political party, racism, sexism or otherwise damage its
            reputation. The user is also prohibited from defaming Dhaka Post.
            Harassing, bullying or upsetting the people or any other user is
            strongly prohibited. The user must not post or upload any image or
            comment which is offensive or obscure or immoral. Personal attack by
            way of comment or image is likewise prohibited.
          </p>
        </section>
        <section>
          <h2 className="font-semibold">
            Prohibition on sharing mark, contents, images
          </h2>
          <p className="dark:text-gray-500">
            CHTVANGUARD prohibits the users from sharing marks, contents or
            images for whatever purpose, be it commercial or not. All users are
            prohibited from taking credit from the contents or images shared,
            published or generated by Dhaka Post.
          </p>
        </section>
      </div>
    </div>
  );
};

export default page;
