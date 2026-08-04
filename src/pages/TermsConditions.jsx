export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-8 text-pink-600">
          Terms & Conditions
        </h1>

        <div className="space-y-6 text-gray-700 leading-7">
          <div>
            <h2 className="text-xl font-semibold mb-2">Acceptance of Terms</h2>
            <p>
              By using this platform, you agree to follow all terms and
              conditions mentioned here.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">User Responsibility</h2>
            <p>
              Users must provide accurate information and avoid abusive,
              fraudulent, or inappropriate activities.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Premium Services</h2>
            <p>
              Premium subscriptions are subject to pricing and validity periods
              mentioned on the Plans page.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Account Suspension</h2>
            <p>
              We reserve the right to suspend or terminate accounts violating
              platform rules.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Changes to Terms</h2>
            <p>Terms may be updated from time to time without prior notice.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
