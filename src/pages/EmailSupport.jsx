export default function EmailSupport() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-6 text-pink-600">Email Support</h1>

        <p className="text-gray-600 leading-7 mb-4">
          Need help with your account, payment, matches, or technical issues?
          Our support team is here to help you.
        </p>

        <div className="space-y-4 mt-6">
          <div className="border rounded-xl p-4">
            <h2 className="font-semibold text-lg">Support Email</h2>
            <p className="text-gray-600 mt-2">info@skiezdigital.com</p>
          </div>

          <div className="border rounded-xl p-4">
            <h2 className="font-semibold text-lg">Response Time</h2>
            <p className="text-gray-600 mt-2">
              We usually respond within 24 hours.
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <h2 className="font-semibold text-lg">Working Hours</h2>
            <p className="text-gray-600 mt-2">
              Monday - Saturday | 9:00 AM - 6:00 PM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
