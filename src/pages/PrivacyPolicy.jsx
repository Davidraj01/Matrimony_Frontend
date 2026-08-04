export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-8 text-pink-600">
          Privacy Policy
        </h1>

        <div className="space-y-6 text-gray-700 leading-7">
          <p>
            We value your privacy and are committed to protecting your personal
            information.
          </p>

          <div>
            <h2 className="text-xl font-semibold mb-2">
              Information We Collect
            </h2>
            <p>
              We may collect profile details, contact information, photos, and
              preferences to improve matchmaking services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">
              How We Use Information
            </h2>
            <p>
              Your information is used to provide better matches, improve
              platform features, and ensure account security.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Data Security</h2>
            <p>
              We implement appropriate security measures to protect user data
              from unauthorized access.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
            <p>
              If you have any questions regarding privacy, contact us through
              our support email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
