const sections = [
  {
    title: "Online Store Terms",
    content: [
      "By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you have given consent for minor dependents to use this site.",
      "You may not use our products for any illegal or unauthorized purpose or violate any laws in your jurisdiction.",
      "Transmission of malicious code, viruses, or destructive software is strictly prohibited.",
      "Any breach of these Terms will result in immediate termination of services.",
    ],
  },
  {
    title: "General Conditions",
    content: [
      "We reserve the right to refuse service to anyone for any reason at any time.",
      "Your content (excluding credit card information) may be transferred unencrypted over various networks.",
      "Credit card information is always encrypted during transfer.",
      "You agree not to reproduce, duplicate, sell, or exploit any portion of the service without written permission.",
    ],
  },
  {
    title: "Accuracy of Information",
    content: [
      "We are not responsible if information on this site is inaccurate, incomplete, or outdated.",
      "The content is provided for general information only and should not be relied upon as the sole basis for decisions.",
    ],
  },
  {
    title: "Modifications to Service & Pricing",
    content: [
      "Prices for our products are subject to change without notice.",
      "We reserve the right to modify or discontinue the service at any time without notice.",
    ],
  },
  {
    title: "Products & Services",
    content: [
      "Certain products or services may be available exclusively online.",
      "These products may have limited quantities and are subject to return or exchange as per our Return Policy.",
    ],
  },
  {
    title: "Billing & Account Information",
    content: [
      "We reserve the right to refuse or cancel any order.",
      "Purchase limits may apply per person, household, or order.",
    ],
  },
  {
    title: "Third-Party Tools & Links",
    content: [
      "We may provide access to third-party tools over which we have no control.",
      "Third-party links may direct you to websites not affiliated with us.",
    ],
  },
  {
    title: "User Submissions",
    content: [
      "You agree that we may use comments, feedback, or submissions you provide without restriction.",
    ],
  },
  {
    title: "Personal Information",
    content: [
      "Your submission of personal information is governed by our Privacy Policy.",
    ],
  },
  {
    title: "Errors & Omissions",
    content: [
      "Information on our site may occasionally contain errors related to product descriptions, pricing, or availability.",
    ],
  },
  {
    title: "Prohibited Uses",
    content: [
      "You are prohibited from using the site for unlawful purposes or violating regulations and laws.",
    ],
  },
  {
    title: "Disclaimer & Limitation of Liability",
    content: [
      "We do not guarantee uninterrupted or error-free service.",
      "We may suspend or cancel services without notice.",
    ],
  },
  {
    title: "Indemnification",
    content: [
      "You agree to indemnify and hold harmless our company, affiliates, and partners from any claims or demands.",
    ],
  },
  {
    title: "Severability",
    content: [
      "If any provision is deemed unenforceable, the remaining provisions remain valid.",
    ],
  },
  {
    title: "Governing Law",
    content: [
      "These Terms are governed by the laws of India, with jurisdiction in Chennai, Tamil Nadu.",
    ],
  },
];

const TermsSection = () => {
  return (
    <div className="p-4!">
      <div className="mx-auto! bg-white rounded-xl shadow-md! p-6! md:p-10!">
        <div className="flex flex-col gap-1!">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Terms & Conditions
          </h1>
          <p className="text-sm text-gray-500 text-center">
            Please read these terms carefully before using our services.
          </p>
        </div>

        <div className="space-y-8!">
          {sections.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-1! items-start">
              <h2 className="text-lg font-semibold text-gray-800 border-l-4! border-blue-600 pl-3!">
                {section.title}
              </h2>
              <ul className="list-disc! text-left list-inside! pl-4! text-gray-600 text-sm leading-relaxed">
                {section.content.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsSection;
