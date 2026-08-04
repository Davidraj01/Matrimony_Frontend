export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-8 text-pink-600">Help Center</h1>

        <div className="space-y-6">
          <div className="border rounded-xl p-5">
            <h2 className="font-semibold text-lg">
              How do I create an account?
            </h2>
            <p className="text-gray-600 mt-2">
              Register using your email or mobile number and complete your
              profile details.
            </p>
          </div>

          <div className="border rounded-xl p-5">
            <h2 className="font-semibold text-lg">
              How do I upgrade to premium?
            </h2>
            <p className="text-gray-600 mt-2">
              Visit the Plans page and choose the premium plan to unlock all
              features.
            </p>
          </div>

          <div className="border rounded-xl p-5">
            <h2 className="font-semibold text-lg">
              How can I contact support?
            </h2>
            <p className="text-gray-600 mt-2">
              You can contact us through the Email Support page.
            </p>
          </div>

          <div className="border rounded-xl p-5">
            <h2 className="font-semibold text-lg">Why is my profile hidden?</h2>
            <p className="text-gray-600 mt-2">
              Profiles violating platform policies may be temporarily hidden or
              removed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
